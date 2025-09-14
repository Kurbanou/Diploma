document.getElementById("generate-pdf").addEventListener("click", () => {
  const rows = document.querySelectorAll("#data-table tbody tr");
  const entries = [];

  rows.forEach((row) => {
    const name = row.querySelector("input").value.trim();
    const template = row.querySelector("select").value;
    const message = row.querySelector("textarea").value.trim();

    if (name && message) {
      entries.push({ name, template, message });
    }
  });

  if (entries.length > 0) {
    generatePDF(entries);
  } else {
    alert("Заполните хотя бы одну строку");
  }
});
