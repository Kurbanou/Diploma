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

document.getElementById("preview-page").addEventListener("click", async () => {
  const row = document.querySelector("#data-table tbody tr");
  if (!row) return alert("Добавьте хотя бы одну строку");

  const name = row.querySelector("input").value.trim();
  const template = row.querySelector("select").value;
  const message = row.querySelector("textarea").value.trim();

  if (!name || !message) return alert("Заполните ФИО и поздравление");

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
    bg: `templates/${template}/bg.svg`,
  });

  const previewWindow = window.open("", "_blank");
  previewWindow.document.write(`
    <html>
      <head>
        <title>Предпросмотр грамоты</title>
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>${htmlElement.innerHTML}</body>
    </html>
  `);
  previewWindow.document.close();
});

async function printAll(entries) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write("<html><head><title>Печать всех грамот</title>");
  printWindow.document.write('<link href="styles.css" rel="stylesheet" />');
  printWindow.document.write(
    '<link href="https://fonts.googleapis.com/css2?family=Marck+Script&display=swap" rel="stylesheet" />'
  );
  printWindow.document.write("</head><body>");

  for (const entry of entries) {
    const date = new Date().toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const htmlElement = await loadTemplate(entry.template, {
      ...entry,
      date,
      title: "Грамота",
      subtitle: "Почетная",
      signature: "А. Ч. Бумбуль",
      bg: "bg.svg",
    });

    printWindow.document.body.appendChild(htmlElement.cloneNode(true));
  }

  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

document.getElementById("print-all").addEventListener("click", () => {
  const entries = getEntries();
  if (entries.length > 0) printAll(entries);
});
