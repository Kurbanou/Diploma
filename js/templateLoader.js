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

  const styleTag = document.createElement("style");
  styleTag.textContent = cssText;
  container.prepend(styleTag);

  return container;
}
