let ressources = [];
let activeCategorie = "Toutes";
let activeTag = "Tous";

const grid = document.getElementById("ressourcesGrid");
const categorieFilters = document.getElementById("ressourceCategorieFilters");
const tagFilters = document.getElementById("ressourceTagFilters");

fetch("data/ressources.json")
  .then(res => res.json())
  .then(data => {
    ressources = data.ressources;
    renderFilters();
    renderRessources();
  })
  .catch(err => console.error("Erreur chargement ressources :", err));

function renderFilters() {
  const categories = ["Toutes", ...new Set(ressources.flatMap(r => r.categorie || []))];
  const tags = ["Tous", ...new Set(ressources.flatMap(r => r.tag || []))];

  categorieFilters.innerHTML = categories.map(cat => `
    <button class="ressource-filter ${cat === activeCategorie ? "active" : ""}" data-categorie="${cat}">
      ${cat}
    </button>
  `).join("");

  tagFilters.innerHTML = tags.map(tag => `
    <button class="ressource-filter ${tag === activeTag ? "active" : ""}" data-tag="${tag}">
      ${tag}
    </button>
  `).join("");

  document.querySelectorAll("[data-categorie]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategorie = btn.dataset.categorie;
      renderFilters();
      renderRessources();
    });
  });

  document.querySelectorAll("[data-tag]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag;
      renderFilters();
      renderRessources();
    });
  });
}

function renderRessources() {
  const filtered = ressources.filter(item => {
    const matchCategorie =
      activeCategorie === "Toutes" || item.categorie.includes(activeCategorie);

    const matchTag =
      activeTag === "Tous" || item.tag.includes(activeTag);

    return matchCategorie && matchTag;
  });

  grid.innerHTML = filtered.map(item => `
    <article class="ressource-card">
      <div class="ressource-card-inner">
        <div class="ressource-card-front">
          <img src="ressources/${item.image}" alt="${item.nom}">
          <h3>${item.nom}</h3>
          <p>${item.categorie.join(" / ")}</p>
        </div>

        <div class="ressource-card-back">
          <h3>${item.nom}</h3>

          <div>
            <strong>Obtention</strong>
            <p>${cleanList(item.obtention)}</p>
          </div>

          <div>
            <strong>Effet</strong>
            <p>${item.effet || "—"}</p>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function cleanList(list) {
  return (list || []).filter(Boolean).join(" / ") || "—";
}
