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

  // 🔤 Глобальные шрифты
  const fontLinks = `
    <link href="https://fonts.googleapis.com/css2?family=Marck+Script&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
  `;
  const fontWrapper = document.createElement("div");
  fontWrapper.innerHTML = fontLinks;

  // 🎨 Локальные стили шаблона
  const styleTag = document.createElement("style");
  styleTag.textContent = cssText;

  // 📦 Вставляем всё в контейнер
  container.prepend(styleTag);
  container.prepend(fontWrapper);

  return container;
}
