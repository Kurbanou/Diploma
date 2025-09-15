const entryContainer = document.getElementById("entry-container");
async function printAll() {
  const entries = Array.from(document.querySelectorAll(".entry-card")).map(
    (card) => ({
      name: card.querySelector(".name-input").value,
      template: card.querySelector(".template-select").value,
      message: card.querySelector(".message-input").value,
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

  card.innerHTML = `
    <div class="field">
      <label>ФИО</label>
      <input class="name-input" value="${entry.name || ""}" />
    </div>
    <div class="field">
      <label>Шаблон</label>
      <select class="template-select">
        <option value="blagodarnots" ${
          entry.template === "blagodarnots" ? "selected" : ""
        }>Благодарность</option>
        <option value="pochetnaja" ${
          entry.template === "pochetnaja" ? "selected" : ""
        }>Почетная</option>
        <option value="gramota" ${
          entry.template === "gramota" ? "selected" : ""
        }>Грамота</option>
        <option value="lesorub" ${
          entry.template === "lesorub" ? "selected" : ""
        }>Лесоруб</option>
        <option value="sertificate" ${
          entry.template === "sertificate" ? "selected" : ""
        }>Sertificate</option>
      </select>
    </div>
    <div class="field">
      <label>Поздравление</label>
      <textarea class="message-input">${entry.message || ""}</textarea>
    </div>
    <div class="actions">
      <button class="preview-entry">🔍</button>
      <button class="delete-entry">🗑️</button>
    </div>
  `;

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
  const template = card.querySelector(".template-select").value;
  const message = card.querySelector(".message-input").value;

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
        <body>
        </body>
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
    template: card.querySelector(".template-select").value,
    message: card.querySelector(".message-input").value,
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

restoreEntriesFromStorage();

document.getElementById("print-all").addEventListener("click", printAll);
