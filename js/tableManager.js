document.getElementById("add-row").addEventListener("click", () => {
  const tbody = document.querySelector("#data-table tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text" placeholder="ФИО" /></td>
    <td>
      <select>
        <option value="diploma">Грамота</option>
        <option value="lesorub">Лесоруб</option>
        <option value="doska">Доска почёта</option>
      </select>
    </td>
    <td><textarea rows="3" placeholder="Текст поздравления"></textarea></td>
    <td><button onclick="this.closest('tr').remove()">🗑️</button></td>
  `;

  tbody.appendChild(row);
});
