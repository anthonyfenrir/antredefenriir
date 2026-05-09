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

  const selector = "p, li, h2, h3";
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {
      let text = node.nodeValue;
      const fragment = document.createDocumentFragment();

      const regex = new RegExp(
        `\\b(${Object.keys(termMap).join("|")})\\b`,
        "g"
      );

      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );

        const span = document.createElement("span");
        span.className = termMap[match[0]];
        span.textContent = match[0];

        fragment.appendChild(span);

        lastIndex = regex.lastIndex;
      }

      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));

      node.parentNode.replaceChild(fragment, node);
    });
  });
});
