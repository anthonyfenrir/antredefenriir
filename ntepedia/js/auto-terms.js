document.addEventListener("DOMContentLoaded", () => {
  const termMap = {
    "Incantation": "term-attribute attr-incantation",
    "Psyché": "term-attribute attr-psyche",
    "Psyche": "term-attribute attr-psyche",
    "Anima": "term-attribute attr-anima",
    "Chaos": "term-attribute attr-chaos",
    "Cosmos": "term-attribute attr-cosmos",
    "Lakshana": "term-attribute attr-lakshana"

  };

  document.querySelectorAll("p, li, h2, h3, span").forEach(el => {
    if (el.closest("script, style")) return;

    let html = el.innerHTML;

    Object.entries(termMap).forEach(([term, className]) => {
      const regex = new RegExp(`\\b${term}\\b`, "g");
      html = html.replace(
        regex,
        `<span class="${className}">${term}</span>`
      );
    });

    el.innerHTML = html;
  });
});
