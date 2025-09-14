const { jsPDF } = window.jspdf;

async function generatePDF(entries) {
  if (typeof domtoimage === "undefined") {
    console.error("domtoimage не загружен. Проверь подключение CDN.");
    alert(
      "Ошибка: dom-to-image-more не загружен. Проверь порядок подключения скриптов в index.html."
    );
    return;
  }

  if (!entries || entries.length === 0) return;

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
          });

    const wrapper = htmlElement.querySelector(".wrapper");

    // Вставляем в DOM для корректного рендеринга
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.visibility = "visible";
    container.style.zIndex = "-1";
    container.appendChild(wrapper);
    document.body.appendChild(container);

    // Дожидаемся шрифтов и отрисовки
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => r()));

    // Генерируем изображение
    const imgData = await domtoimage.toJpeg(wrapper, {
      quality: 1,
      bgcolor: "white",
      cacheBust: true,
    });

    document.body.removeChild(container);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
    if (i < entries.length - 1) pdf.addPage();
  }

  pdf.save("gramoty.pdf");
}
