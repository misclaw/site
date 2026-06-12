// Renders the project list on misclaw.app from the registry in projects.json.
// To add a project: append an entry to projects.json and push. See ../CLAUDE.md.

const listEl = document.getElementById("project-list");
const emptyEl = document.getElementById("empty-state");
const countEl = document.getElementById("project-count");

document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle: no data-theme attribute means "follow the system"; clicking
// pins an explicit choice in localStorage (read before paint in index.html).
document.getElementById("theme-toggle").addEventListener("click", () => {
  const current =
    document.documentElement.dataset.theme ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
});

/** Escape text before inserting into markup. */
function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function badge(status) {
  if (status === "live") return '<span class="badge badge--live">live</span>';
  if (status === "wip" || status === "building")
    return '<span class="badge badge--wip">building</span>';
  return "";
}

function card(project) {
  const host = (() => {
    try {
      return new URL(project.url).host;
    } catch {
      return project.slug ? `${project.slug}.misclaw.app` : "";
    }
  })();

  return `
    <li>
      <a class="project-card" href="${esc(project.url)}">
        <div class="project-card__top">
          <span class="project-card__name">${esc(project.name)}</span>
          ${badge(project.status)}
          <span class="project-card__host">${esc(host)}</span>
        </div>
        ${
          project.description
            ? `<p class="project-card__desc">${esc(project.description)}</p>`
            : ""
        }
      </a>
    </li>`;
}

function showEmpty(message) {
  listEl.hidden = true;
  countEl.hidden = true;
  if (message) emptyEl.textContent = message;
  emptyEl.hidden = false;
}

async function render() {
  let projects = [];
  try {
    const res = await fetch("./projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    projects = Array.isArray(data) ? data : (data.projects ?? []);
  } catch (err) {
    showEmpty("Couldn't load the project list right now. Try again shortly.");
    console.error("[misclaw] failed to load projects.json:", err);
    return;
  }

  if (projects.length === 0) {
    showEmpty();
    return;
  }

  // Live projects first, then alphabetical.
  projects.sort((a, b) => {
    const live = (p) => (p.status === "live" ? 0 : 1);
    return live(a) - live(b) || a.name.localeCompare(b.name);
  });

  emptyEl.hidden = true;
  listEl.hidden = false;
  listEl.innerHTML = projects.map(card).join("");
  countEl.textContent = `${projects.length} project${projects.length === 1 ? "" : "s"}`;
  countEl.hidden = false;
}

render();
