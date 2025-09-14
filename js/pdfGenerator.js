const { jsPDF } = window.jspdf;

function html2canvasWrapper(domElement) {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.appendChild(domElement);
    document.body.appendChild(container);

    html2canvas(domElement, { scale: 2 }).then((canvas) => {
      document.body.removeChild(container);
      resolve(canvas);
    });
  });
}

async function generatePDF(entries) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });

  for (let i = 0; i < entries.length; i++) {
    const { name, template, message } = entries[i];
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
      bg: "./assets/img/svg/bg.svg",
    });

    const canvas = await html2canvasWrapper(htmlElement);
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
    if (i < entries.length - 1) pdf.addPage();
  }

  pdf.save("gramoty.pdf");
}
