async function loadTemplate(templateName, data) {
  const htmlPath = `templates/${templateName}/index.html`;
  const cssPath = `templates/${templateName}/styles.css`;

  // Загружаем HTML и CSS шаблона
  const [htmlText, cssText] = await Promise.all([
    fetch(htmlPath).then((res) => res.text()),
    fetch(cssPath).then((res) => res.text()),
  ]);

  // Подставляем данные в шаблон
  const filledHtml = htmlText
    .replace("{ФИО}", data.name)
    .replace("{текст}", data.message)
    .replace("{proffesion}", data.proffesion)
    .replace("{дата}", data.date)
    .replace("{заголовок}", data.title || "Грамота")
    .replace("{подзаголовок}", data.subtitle || "Почетная")
    .replace("{подпись}", data.signature || "А. Ч. Бумбуль");

  // Создаём контейнер
  const container = document.createElement("div");
  container.innerHTML = filledHtml;

  // Вставляем глобальные шрифты
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

  // Определяем ориентацию
  const orientationTag = container.querySelector(".template-meta");
  const orientation = orientationTag?.dataset.orientation || "landscape";

  // Переводим миллиметры в пиксели (A4)
  const mmToPx = (mm) => (mm * 96) / 25.4;
  const widthPx = mmToPx(orientation === "portrait" ? 210 : 297);
  const heightPx = mmToPx(orientation === "portrait" ? 297 : 210);

  // Настраиваем wrapper
  const wrapper = container.querySelector(".wrapper");
  wrapper.style.width = `${widthPx}px`;
  wrapper.style.height = `${heightPx}px`;
  wrapper.style.position = "relative";
  wrapper.style.overflow = "hidden";

  // Устанавливаем фон через background-image
  wrapper.style.backgroundImage = `url(templates/${templateName}/bg.svg)`;
  wrapper.style.backgroundSize = "cover";
  wrapper.style.backgroundPosition = "center";
  wrapper.style.backgroundRepeat = "no-repeat";

  return container;
}
