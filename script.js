document.addEventListener("DOMContentLoaded", () => {
  highlightToday();

  const page = document.body.dataset.page;
  if (page === "games") {
    initGamesPage();
  }
});

function highlightToday() {
  const today = new Date().getDay();
  const cards = document.querySelectorAll(".day-card");

  cards.forEach((card) => {
    if (Number(card.dataset.day) === today) {
      card.classList.add("today");
    }
  });
}

async function initGamesPage() {
  const filtersContainer = document.getElementById("filters");
  const gamesList = document.getElementById("games-list");

  if (!filtersContainer || !gamesList) return;

  try {
    const response = await fetch("jeux.json");
    if (!response.ok) {
      throw new Error("Impossible de charger jeux.json");
    }

    const games = await response.json();
    const categories = ["Tous", ...new Set(games.map((game) => game.categorie))];

    let activeCategory = "Tous";

    const handleFilterClick = (selected) => {
      activeCategory = selected;
      renderFilters(categories, activeCategory, filtersContainer, handleFilterClick);
      renderGames(games, activeCategory, gamesList);
    };

    renderFilters(categories, activeCategory, filtersContainer, handleFilterClick);
    renderGames(games, activeCategory, gamesList);
  } catch (error) {
    console.error(error);
    gamesList.innerHTML = `<div class="empty-state">Impossible de charger la liste des jeux pour le moment.</div>`;
  }
}

function renderFilters(categories, activeCategory, container, onClick) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `filter-btn${category === activeCategory ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => onClick(category));
    container.appendChild(button);
  });
}

function renderGames(games, activeCategory, container) {
  const filteredGames =
    activeCategory === "Tous"
      ? games
      : games.filter((game) => game.categorie === activeCategory);

  if (!filteredGames.length) {
    container.innerHTML = `<div class="empty-state">Aucun jeu trouvé pour cette catégorie.</div>`;
    return;
  }

  container.innerHTML = filteredGames
    .map(
      (game) => `
        <article class="game-card">
          <img class="game-image" src="${game.image}" alt="${escapeHtml(game.nom)}" />
          <div class="game-content">
            <div class="game-top">
              <div>
                <h2 class="game-title">${escapeHtml(game.nom)}</h2>
                <span class="game-category">${escapeHtml(game.categorie)}</span>
              </div>
              <div class="game-tier">Tier : ${escapeHtml(String(game.tier))}</div>
            </div>

            <p class="game-synopsis">${escapeHtml(game.synopsis)}</p>

            <div class="game-links">
              ${
                game.steam
                  ? `<a class="game-link" href="${game.steam}" target="_blank" rel="noopener noreferrer">Steam</a>`
                  : ""
              }
              ${
                game.autreLien
                  ? `<a class="game-link" href="${game.autreLien}" target="_blank" rel="noopener noreferrer">Voir plus</a>`
                  : ""
              }
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
