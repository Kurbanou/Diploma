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
    .replace("{bg}", `templates/${templateName}/bg.svg`);

  const container = document.createElement("div");
  container.innerHTML = filledHtml;

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

  const orientationTag = container.querySelector(".template-meta");
  const orientation = orientationTag?.dataset.orientation || "landscape";

  const wrapper = container.querySelector(".wrapper");
  const bg = container.querySelector(".background");

  if (orientation === "portrait") {
    wrapper.style.width = "210mm";
    wrapper.style.height = "297mm";
    bg.style.width = "210mm";
    bg.style.height = "297mm";
  } else {
    wrapper.style.width = "297mm";
    wrapper.style.height = "210mm";
    bg.style.width = "297mm";
    bg.style.height = "210mm";
  }

  return container;
}
