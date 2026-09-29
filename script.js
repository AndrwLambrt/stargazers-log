const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function formatStarredDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium"
  }).format(date);
}

function renderRepository(event) {
  const item = document.createElement("li");
  item.className = "repository-item";

  const link = document.createElement("a");
  link.className = "repository-name";
  link.href = event.url;
  link.textContent = event.repository;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = event.description || "No description provided.";

  const meta = document.createElement("p");
  meta.className = "repository-meta";

  const language = document.createElement("span");
  language.textContent = event.language || "Language not specified";

  const starredDate = document.createElement("span");
  starredDate.textContent = `Starred ${formatStarredDate(event.starred_at)}`;

  meta.append(language, starredDate);
  item.append(link, description, meta);

  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    const starredRepositories = events.filter((event) => event.type === "starred");

    repositoryList.replaceChildren(...starredRepositories.map(renderRepository));
    listStatus.textContent = `${starredRepositories.length} repositories`;
  } catch (error) {
    listStatus.textContent = "Could not load repositories.";
    console.error("Failed to load starred repositories:", error);
  }
}

loadRepositories();