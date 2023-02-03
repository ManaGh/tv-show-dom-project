//You can edit ALL of the code here
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   rootElem.textContent = `Got ${episodeList.length} episode(s)`;
// }

// window.onload = setup;

let userShows = JSON.parse(localStorage.getItem("userShows"));
if (!userShows) {
  userShows = {};
}
const PAGES = {
  SHOWS: "shows",
  EPISODES: "episodes",
};

let allEpisodes;
let currentPage = PAGES.SHOWS;
let allShows;
let perPage = 4;
let currPageNum = 1;
let showsChunk;
let episodesChunk;
const sortBy = {
  key: "name",
  direction: 1,
};
let toObserve;
const rootElem = document.getElementById("root");
const searchBox = document.getElementById("search");
const searchCount = document.getElementById("search-count");
const goBack = document.getElementById("goback");
let currShowID;
const showDescLen = 200;
const episodeDescLen = 100;

const stripHTML = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText;
};

const truncDesc = (text, length) => {
  const descEl = document.createElement("p");
  if (stripHTML(text).length <= length) {
    descEl.innerHTML = text;
    return descEl;
  }
  descEl.innerText = `${stripHTML(text).substring(0, length)}...`;

  const readMoreEl = document.createElement("a");
  readMoreEl.innerText = "Read More";
  readMoreEl.setAttribute("href", "#");
  readMoreEl.addEventListener("click", (event) => {
    event.preventDefault();
    descEl.innerHTML = text;
  });
  descEl.appendChild(readMoreEl);
  return descEl;
};

const favButton = (ID) => {
  if (!userShows[ID]) {
    userShows[ID] = {};
  }
  const button = document.createElement("button");
  button.classList.add("button");
  button.classList.toggle("favourited", !!userShows[ID].favourite);
  button.innerText = userShows[ID].favourite
    ? "❤ In Your Favourites ❤"
    : "🖤 Favourite";
  button.addEventListener("click", (e) => {
    userShows[ID].favourite = !userShows[ID].favourite;
    e.target.innerText = userShows[ID].favourite
      ? "❤ In Your Favourites ❤"
      : "🖤 Favourite";
    localStorage.setItem("userShows", JSON.stringify(userShows));
    button.classList.toggle("favourited", !!userShows[ID].favourite);
  });
  return button;
};
const editNotesHandler = (e, inputNotes, ID) => {
  const action = e.target.value;
  if (action === "Save Notes") {
    userShows[ID].notes = inputNotes.value;
    localStorage.setItem("userShows", JSON.stringify(userShows));
    inputNotes.classList.toggle("hidden");
    e.target.value = userShows[ID].notes ? "Edit Notes" : "Add Notes";
    e.target.innerText = userShows[ID].notes ? "Edit Notes" : "Add Notes";
  } else if (action !== "Close") {
    inputNotes.classList.toggle("hidden");
    e.target.value = "Close";
    e.target.innerText = "Close";
  } else {
    inputNotes.classList.toggle("hidden");
    e.target.value = userShows[ID].notes ? "Edit Notes" : "Add Notes";
    e.target.innerText = userShows[ID].notes ? "Edit Notes" : "Add Notes";
  }
};
