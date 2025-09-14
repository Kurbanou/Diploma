const { jsPDF } = window.jspdf;

function html2canvasWrapper(domElement) {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.appendChild(domElement);
    document.body.appendChild(container);

    html2canvas(domElement, { scale: 2, useCORS: true }).then((canvas) => {
      document.body.removeChild(container);
      resolve(canvas);
    });
  });
}

async function generatePDF(entries) {
  if (entries.length === 0) return;

  const date = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const first = entries[0];
  const firstHtml = await loadTemplate(first.template, {
    name: first.name,
    message: first.message,
    date,
    title: "Грамота",
    subtitle: "Почетная",
    signature: "А. Ч. Бумбуль",
    bg: `templates/${first.template}/bg.svg`,
  });

  const orientationTag = firstHtml.querySelector(".template-meta");
  const orientation = orientationTag?.dataset.orientation || "landscape";

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation });

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    const htmlElement =
      i === 0
        ? firstHtml
        : await loadTemplate(entry.template, {
            name: entry.name,
            message: entry.message,
            date,
            title: "Грамота",
            subtitle: "Почетная",
            signature: "А. Ч. Бумбуль",
            bg: `templates/${entry.template}/bg.svg`,
          });

    const img = htmlElement.querySelector(".background");
    if (img && !img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }

    const canvas = await html2canvasWrapper(htmlElement);
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
    if (i < entries.length - 1) pdf.addPage();
  }

  pdf.save("gramoty.pdf");
}
