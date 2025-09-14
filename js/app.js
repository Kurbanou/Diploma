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
