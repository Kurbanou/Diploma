async function loadTemplate(templateName, data) {
  const htmlPath = `templates/${templateName}/index.html`;
  const cssPath = `templates/${templateName}/styles.css`;

  const [htmlText, cssText] = await Promise.all([
    fetch(htmlPath).then((res) => res.text()),
    fetch(cssPath).then((res) => res.text()),
  ]);

  const filledHtml = htmlText
    .replace("{ФИО}", data.name)
    .replace("{текст}", data.message)
    .replace("{дата}", data.date)
    .replace("{заголовок}", data.title || "Грамота")
    .replace("{подзаголовок}", data.subtitle || "Почетная")
    .replace("{подпись}", data.signature || "А. Ч. Бумбуль")
    // .replace("{bg}", `templates/${templateName}/bg.svg`);
    .replace("{bg}", `templates/${templateName}/bg.jpg`);

  const container = document.createElement("div");
  container.innerHTML = filledHtml;

  // Глобальные шрифты
  const fontLinks = `
    <link href="https://fonts.googleapis.com/css2?family=Marck+Script&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
  `;
  const fontWrapper = document.createElement("div");
  fontWrapper.innerHTML = fontLinks;

  const styleTag = document.createElement("style");
  styleTag.textContent = cssText;

  container.prepend(styleTag);
  container.prepend(fontWrapper);

  // Ориентация
  const orientationTag = container.querySelector(".template-meta");
  const orientation = orientationTag?.dataset.orientation || "landscape";

  // Размеры в пикселях
  const mmToPx = (mm) => (mm * 96) / 25.4;
  const widthPx = mmToPx(orientation === "portrait" ? 210 : 297);
  const heightPx = mmToPx(orientation === "portrait" ? 297 : 210);

  const wrapper = container.querySelector(".wrapper");
  const bg = container.querySelector(".background");

  wrapper.style.width = `${widthPx}px`;
  wrapper.style.height = `${heightPx}px`;
  bg.style.width = `${widthPx}px`;
  bg.style.height = `${heightPx}px`;

  return container;
}
