// For the API I used the NewsAPI or mocked data that was randomly generated
// For the ratings I used a random generator of users and ratings and saved it in a json file you can add or remove users and ratings
// by editing the json file located in data_mock/ratings.json

const API_KEY = "c764a71de8f44db2b361542080db9371";
const API_URL = "https://newsapi.org/v2/everything?";
const TOPIC = "q=Universidad%20de%20la%20Laguna";
const DATE = `from=${
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
}`; // This is the date of the last 30 days, the api only allows news from recent dates
const SORT_BY = "sortBy=popularity";
const USE_MOCK_DATA = false; // Variable to toggle between mock and real API to not overload the API

// This function returns the url of the api with the search term
function getApiUrl(searchTerm = "Universidad de la Laguna") {
  const TOPIC = `q=${encodeURIComponent(searchTerm)}`;
  return `${API_URL}${TOPIC}&${DATE}&${SORT_BY}&apiKey=${API_KEY}`;
}

// This function fetches the news from the api or the mock data and displays it
async function fetchNews(searchTerm) {
  try {
    // If USE_MOCK_DATA is true, it fetches the mock data, otherwise it fetches the news from the api
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

// This function displays the news in the news container
function displayNews(articles) {
  const newsContainer = document.getElementById("newsContainer");

  newsContainer.innerHTML = "";

  // This loop creates a news card for each article and sets the attributes
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

// This function fetches the ratings from the mock data and displays it
async function fetchRatings() {
  try {
    const response = await fetch("data_mock/ratings.json");
    const data = await response.json();
    displayRatings(data.users);
  } catch (error) {
    console.error("Error fetching ratings:", error);
  }
}

// This function displays the ratings in the ratings container
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

// This function is executed when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchNews();

  // This is the input to search for news
  const searchInput = document.getElementById("searchInput");
  // This is the button to toggle the ratings
  const toggleButton = document.getElementById("toggleRatings");

  // Handle ratings toggle
  toggleButton.addEventListener("click", () => {
    const ratingsContainer = document.querySelector(".ratin-box");
    const isVisible = ratingsContainer.classList.toggle("visible");
    toggleButton.textContent = isVisible ? "Hide Ratings" : "Show Ratings";

    if (isVisible) {
      fetchRatings();
    } else {
      ratingsContainer.innerHTML = "";
    }
  });

  // This is the event listener for the search input
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetchNews(e.target.value);
    }
  });
});
