const tableBody = document.querySelector("#data-table tbody");

function addRow(entry = {}) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input class="name-input" value="${entry.name || ""}" /></td>
    <td>
      <select class="template-select">
        <option value="diploma" ${
          entry.template === "diploma" ? "selected" : ""
        }>Грамота</option>
        <option value="lesorub" ${
          entry.template === "lesorub" ? "selected" : ""
        }>Лесоруб</option>
        <option value="sertificate" ${
          entry.template === "sertificate" ? "selected" : ""
        }>sertificate</option>
      </select>
    </td>
    <td><textarea class="message-input">${entry.message || ""}</textarea></td>
    <td>
      <button class="preview-row">🔍</button>
      <button class="delete-row">🗑️</button>
    </td>
  `;

  row.querySelector(".preview-row").addEventListener("click", () => {
    previewRow(row);
  });

  row.querySelector(".delete-row").addEventListener("click", () => {
    row.remove();
    updateLocalStorageFromTable();
  });

  tableBody.appendChild(row);
}

async function previewRow(row) {
  const name = row.querySelector(".name-input").value;
  const template = row.querySelector(".template-select").value;
  const message = row.querySelector(".message-input").value;

  const date = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const htmlElement = await loadTemplate(template, {
    name,
    message,
    date,
    title: "Грамота",
    subtitle: "Почетная",
    signature: "А. Ч. Бумбуль",
    bg: "bg.svg",
  });

  const printWindow = window.open("", "_blank");
  printWindow.document.write("<html><head><title>Предпросмотр</title>");
  printWindow.document.write('<link href="styles.css" rel="stylesheet" />');
  printWindow.document.write(
    '<link href="https://fonts.googleapis.com/css2?family=Marck+Script&display=swap" rel="stylesheet" />'
  );
  printWindow.document.write("</head><body>");
  printWindow.document.body.appendChild(htmlElement);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.focus();
}

function updateLocalStorageFromTable() {
  const rows = document.querySelectorAll("#data-table tbody tr");
  const entries = [];

  rows.forEach((row) => {
    const name = row.querySelector(".name-input").value;
    const template = row.querySelector(".template-select").value;
    const message = row.querySelector(".message-input").value;
    entries.push({ name, template, message });
  });

  localStorage.setItem("gramotyData", JSON.stringify(entries));
}

function restoreTableFromStorage() {
  const saved = localStorage.getItem("gramotyData");
  if (saved) {
    const entries = JSON.parse(saved);
    entries.forEach(addRow);
  }
}

function getEntries() {
  const rows = document.querySelectorAll("#data-table tbody tr");
  return Array.from(rows).map((row) => ({
    name: row.querySelector(".name-input").value,
    template: row.querySelector(".template-select").value,
    message: row.querySelector(".message-input").value,
  }));
}

document.getElementById("add-row").addEventListener("click", () => {
  addRow();
  updateLocalStorageFromTable();
});

restoreTableFromStorage();
