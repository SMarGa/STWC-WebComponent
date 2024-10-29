const API_KEY = "c764a71de8f44db2b361542080db9371";
const API_URL = "https://newsapi.org/v2/everything?";
const TOPIC = "q=Universidad%20de%20la%20Laguna";
const DATE = `from=${
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
}`;
const SORT_BY = "sortBy=popularity";
const USE_MOCK_DATA = false; // Variable to toggle between mock and real API to not overload the API

function getApiUrl(searchTerm = "Universidad de la Laguna") {
  const TOPIC = `q=${encodeURIComponent(searchTerm)}`;
  return `${API_URL}${TOPIC}&${DATE}&${SORT_BY}&apiKey=${API_KEY}`;
}

async function fetchNews(searchTerm) {
  try {
    if (USE_MOCK_DATA) {
      const response = await fetch("data_mock/news.json");
      const data = await response.json();
      displayNews(data.articles);
    } else {
      const response = await fetch(getApiUrl(searchTerm));
      const data = await response.json();
      displayNews(data.articles.slice(0, 8));
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

function displayNews(articles) {
  const newsContainer = document.getElementById("newsContainer");

  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    const newsCard = document.createElement("news-card");
    newsCard.setAttribute("title", article.title);
    newsCard.setAttribute(
      "description",
      article.description || "No description available"
    );
    newsCard.setAttribute(
      "image",
      article.urlToImage || "https://via.placeholder.com/350x200"
    );
    newsCard.setAttribute("url", article.url);
    newsCard.setAttribute("publishedAt", article.publishedAt);

    newsContainer.appendChild(newsCard);
  });
}

async function fetchRatings() {
  try {
    const response = await fetch("data_mock/ratings.json");
    const data = await response.json();
    displayRatings(data.users);
  } catch (error) {
    console.error("Error fetching ratings:", error);
  }
}

function displayRatings(users) {
  const ratingsContainer = document.querySelector(".ratin-box");
  ratingsContainer.innerHTML = "";

  users.forEach((user) => {
    const ratingCard = document.createElement("rating-card");
    ratingCard.setAttribute("username", user.username);
    ratingCard.setAttribute("rating", user.rating);
    ratingCard.setAttribute("avatar", user.avatar);

    ratingsContainer.appendChild(ratingCard);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchNews();
  fetchRatings();

  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetchNews(e.target.value);
    }
  });
});
