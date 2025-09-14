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
        <option value="doska" ${
          entry.template === "doska" ? "selected" : ""
        }>Доска</option>
      </select>
    </td>
    <td><textarea class="message-input">${entry.message || ""}</textarea></td>
    <td><button class="delete-row">🗑️</button></td>
  `;

  row.querySelector(".delete-row").addEventListener("click", () => {
    row.remove();
    updateLocalStorageFromTable();
  });

  tableBody.appendChild(row);
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

document.getElementById("add-row").addEventListener("click", () => {
  addRow();
  updateLocalStorageFromTable();
});

restoreTableFromStorage();
