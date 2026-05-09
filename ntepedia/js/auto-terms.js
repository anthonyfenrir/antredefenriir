document.addEventListener("DOMContentLoaded", () => {
  const termMap = {
    "incantation": "term-attribute attr-incantation",
    "psyche": "term-attribute attr-psyche",
    "anima": "term-attribute attr-anima",
    "chaos": "term-attribute attr-chaos",
    "cosmos": "term-attribute attr-cosmos",
    "lakshana": "term-attribute attr-lakshana"
  };

  function normalize(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  document.querySelectorAll("p, li, h2, h3").forEach(element => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(node => {
      const words = node.nodeValue.split(/(\s+|[,:;.!?()]+)/);
      const fragment = document.createDocumentFragment();

      words.forEach(word => {
        const normalized = normalize(word);

        if (termMap[normalized]) {
          const span = document.createElement("span");
          span.className = termMap[normalized];
          span.textContent = word; // garde l'accent visuellement
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(word));
        }
      });

      node.parentNode.replaceChild(fragment, node);
    });
  });
});
