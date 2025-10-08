const entryContainer = document.getElementById("entry-container");

const templateList = [
  { value: "blagodarnots", label: "Благодарность" },
  { value: "pochetnaja", label: "Почетная" },
  { value: "gramota", label: "Грамота" },
  { value: "lesorub", label: "Лесоруб" },
  { value: "sertificate", label: "Sertificate" },
  { value: "lesovychok", label: "Детский" },
];

function getTemplateLabel(value) {
  return templateList.find((t) => t.value === value)?.label || "";
}

async function printAll() {
  const entries = Array.from(document.querySelectorAll(".entry-card")).map(
    (card) => ({
      name: card.querySelector(".name-input").value,
      template: card.querySelector(".template-select").dataset.value,
      message: card.querySelector(".message-input").innerHTML,
    })
  );

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Печать грамот</title>
        <link href="https://fonts.googleapis.com/css2?family=Marck+Script&display=swap" rel="stylesheet" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: white;
          }
          @page {
            margin: 0;
          }
          @media print {
            .gramota {
              width: 100%;
              height: auto;
              page-break-after: always;
            }
          }
          .gramota {
            page-break-after: always;
            width: 100vw;
            height: 100vh;
          }
        </style>
      </head>
      <body>
  `);

  for (const entry of entries) {
    const date = new Date().toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    try {
      const htmlElement = await loadTemplate(entry.template, {
        name: entry.name,
        message: entry.message,
        date,
        title: "Грамота",
        subtitle: "Почетная",
        signature: "А. Ч. Бумбуль",
        bg: "bg.svg",
      });

      const wrapper = document.createElement("div");
      wrapper.className = "gramota";
      wrapper.appendChild(htmlElement);
      printWindow.document.body.appendChild(wrapper);
    } catch (error) {
      console.error("Ошибка загрузки шаблона:", error);
      printWindow.document.body.innerHTML += `<p>Ошибка при генерации грамоты для ${entry.name}</p>`;
    }
  }

  printWindow.document.write("</body></html>");
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

function addEntry(entry = {}) {
  const card = document.createElement("div");
  card.className = "entry-card";

  const templateSelect = document.createElement("div");
  templateSelect.className = "template-select";
  templateSelect.dataset.value = entry.template || "";

  const selectedValue = document.createElement("div");
  selectedValue.className = "selected-value";
  selectedValue.textContent =
    getTemplateLabel(entry.template) || "Выбрать шаблон";

  const options = document.createElement("ul");
  options.className = "options";
  templateList.forEach((t) => {
    const li = document.createElement("li");
    li.dataset.value = t.value;
    li.textContent = t.label;
    options.appendChild(li);
  });

  templateSelect.appendChild(selectedValue);
  templateSelect.appendChild(options);

  templateSelect.addEventListener("click", () => {
    templateSelect.classList.toggle("open");
  });

  options.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedValue.textContent = li.textContent;
      templateSelect.dataset.value = li.dataset.value;
      templateSelect.classList.remove("open");
      updateLocalStorageFromEntries();
    });
  });

  document.addEventListener("click", (e) => {
    if (!templateSelect.contains(e.target)) {
      templateSelect.classList.remove("open");
    }
  });

  card.innerHTML = `
    <div class="field name">
      <input class="name-input" value="${entry.name || ""}" />
    </div>
    <div class="field"></div>
    <div class="field textaria">
      <div class="message-input" contenteditable="true">${
        entry.message || ""
      }</div>
    </div>
    <div class="actions">
      <button class="preview-entry">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#f0f6fc" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      <button class="delete-entry">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#f0f6fc" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M3 6h18" />
          <path d="M8 6l1-2h6l1 2" />
          <rect x="5" y="6" width="14" height="14" rx="2" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>
    </div>
  `;

  card.querySelectorAll(".field")[1].appendChild(templateSelect);

  card.querySelector(".preview-entry").addEventListener("click", () => {
    previewEntry(card);
  });

  card.querySelector(".delete-entry").addEventListener("click", () => {
    card.remove();
    updateLocalStorageFromEntries();
  });

  entryContainer.appendChild(card);
}

function previewEntry(card) {
  const name = card.querySelector(".name-input").value;
  const template = card.querySelector(".template-select").dataset.value;
  const message = card.querySelector(".message-input").innerHTML;

  const date = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  loadTemplate(template, {
    name,
    message,
    date,
    title: "Грамота",
    subtitle: "Почетная",
    signature: "А. Ч. Бумбуль",
    bg: "bg.svg",
  }).then((htmlElement) => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Предпросмотр</title>
          <link href="https://fonts.googleapis.com/css2?family=Marck+Script&display=swap" rel="stylesheet" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              background: white;
            }
            @page {
              margin: 0;
            }
            @media print {
              html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
              .gramota {
                width: 100vw;
                height: 100vh;
                page-break-after: avoid;
              }
            }
          </style>
        </head>
        <body></body>
      </html>
    `);

    printWindow.document.body.appendChild(htmlElement);
    printWindow.document.close();
    printWindow.focus();
  });
}

function updateLocalStorageFromEntries() {
  const cards = document.querySelectorAll(".entry-card");
  const entries = Array.from(cards).map((card) => ({
    name: card.querySelector(".name-input").value,
    template: card.querySelector(".template-select").dataset.value,
    message: card.querySelector(".message-input").innerHTML,
  }));
  localStorage.setItem("gramotyData", JSON.stringify(entries));
}

function restoreEntriesFromStorage() {
  const saved = localStorage.getItem("gramotyData");
  if (saved) {
    const entries = JSON.parse(saved);
    entries.forEach(addEntry);
  }
}

document.getElementById("add-entry").addEventListener("click", () => {
  addEntry();
  updateLocalStorageFromEntries();
});

document.getElementById("print-all").addEventListener("click", printAll);

restoreEntriesFromStorage();
