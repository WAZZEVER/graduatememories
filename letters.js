const isLocalFile = window.location.protocol === "file:";
let currentTeacherKey = null;
let bloomCount = 0;

function normalizeSlug(raw) {
  return decodeURIComponent(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function detectTeacherKey() {
  const params = new URLSearchParams(window.location.search);
  const queryKey = normalizeSlug(params.get("to"));
  if (queryKey && TEACHERS[queryKey]) return queryKey;

  if (!isLocalFile) {
    const pathSlug = normalizeSlug(window.location.pathname.replace(/^\/|\/$/g, ""));
    if (pathSlug && TEACHERS[pathSlug]) return pathSlug;
  }

  return null;
}

function getTeacherUrl(key) {
  return isLocalFile ? `?to=${key}` : `/${key}`;
}

function renderSwitcher(activeKey) {
  const switcher = document.getElementById("teacher-switcher");
  const allLink = document.getElementById("all-notes-link");
  allLink.href = isLocalFile ? window.location.pathname : "/";

  switcher.innerHTML = "";
  Object.entries(TEACHERS).forEach(([key, data]) => {
    const isActive = key === activeKey;
    const btn = document.createElement("a");
    btn.href = getTeacherUrl(key);
    btn.textContent = data.name;
    btn.className = isActive
      ? "px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs transition"
      : "px-3 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition";

    if (isActive) {
      btn.style.backgroundColor = data.accent;
    }

    // Instant client-side switch without full page reload
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (key === currentTeacherKey) return;
      window.history.pushState({}, "", getTeacherUrl(key));
      renderLetter(key, true);
    });

    switcher.appendChild(btn);
  });
}

function renderLetter(key, isSwitch = false) {
  currentTeacherKey = key;
  bloomCount = 0;
  const data = TEACHERS[key];
  document.title = `For ${data.name} • Thank You`;

  // Update switcher pills
  renderSwitcher(key);

  // Apply teacher's accent colors
  document.getElementById("ambient-glow").style.background =
    `radial-gradient(ellipse at top, ${data.accentSoft}, transparent 70%)`;
  document.getElementById("card-accent-bar").style.backgroundColor = data.accent;

  const quoteEl = document.getElementById("memory-quote");
  quoteEl.style.backgroundColor = data.accentSoft;
  quoteEl.style.borderColor = data.accent;
  quoteEl.textContent = data.memoryQuote;

  const btn = document.getElementById("appreciate-btn");
  btn.style.backgroundColor = data.accent;
  document.getElementById("appreciate-label").textContent = "Send a Bloom";

  // Populate text content
  document.getElementById("teacher-role").textContent = data.role;
  document.getElementById("teacher-name").textContent = data.name;
  document.getElementById("letter-greeting").textContent = data.greeting;
  document.getElementById("letter-signoff").textContent = data.signOff;
  document.getElementById("letter-sender").textContent = data.sender;

  const paragraphsContainer = document.getElementById("letter-paragraphs");
  paragraphsContainer.innerHTML = "";
  data.paragraphs.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    paragraphsContainer.appendChild(p);
  });

  // Switch views
  document.getElementById("directory-view").classList.add("hidden");
  document.getElementById("letter-view").classList.remove("hidden");
  lucide.createIcons();

  if (isSwitch) {
    gsap.fromTo(".stationery-card", { y: 12, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
  } else {
    gsap.from(".reveal", {
      y: 22,
      opacity: 0,
      duration: 0.85,
      stagger: 0.14,
      ease: "power3.out"
    });
  }
}

// Single listener for the Bloom button
document.getElementById("appreciate-btn").addEventListener("click", () => {
  if (!currentTeacherKey) return;
  const data = TEACHERS[currentTeacherKey];
  bloomCount++;
  confetti({
    particleCount: 45,
    spread: 65,
    origin: { y: 0.72 },
    colors: [data.accent, "#fbbf24", "#f472b6", "#34d399"]
  });
  document.getElementById("appreciate-label").textContent =
    bloomCount === 1 ? "Bloom Sent!" : `Sent ${bloomCount} Blooms`;
});

function renderDirectory() {
  currentTeacherKey = null;
  document.title = "Notes of Gratitude • Class of 2026";
  document.getElementById("ambient-glow").style.background =
    "radial-gradient(ellipse at top, rgba(245, 158, 11, 0.08), transparent 70%)";

  const grid = document.getElementById("directory-grid");
  grid.innerHTML = "";

  const keys = Object.keys(TEACHERS);

  // "Preview Letters" button opens the first teacher immediately
  document.getElementById("open-first-btn").onclick = () => {
    const firstKey = keys[0];
    window.history.pushState({}, "", getTeacherUrl(firstKey));
    renderLetter(firstKey);
  };

  Object.entries(TEACHERS).forEach(([key, data]) => {
    const card = document.createElement("a");
    card.href = getTeacherUrl(key);
    card.className =
      "dir-card group p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between";

    card.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center font-serif font-semibold text-lg"
             style="background-color: ${data.accentSoft}; color: ${data.accent};">
          ${data.name.replace(/^(Ms|Mr)\s+/i, "")[0]}
        </div>
        <div>
          <h2 class="font-serif font-semibold text-lg text-stone-900 group-hover:underline">${data.name}</h2>
          <p class="text-xs text-stone-400">/${key}</p>
        </div>
      </div>
      <i data-lucide="arrow-up-right" class="w-4 h-4 text-stone-400 group-hover:text-stone-800 transition"></i>
    `;

    card.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", getTeacherUrl(key));
      renderLetter(key);
    });

    grid.appendChild(card);
  });

  document.getElementById("letter-view").classList.add("hidden");
  document.getElementById("directory-view").classList.remove("hidden");
  lucide.createIcons();

  gsap.from(".dir-card", {
    y: 16,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: "power2.out"
  });
}

// Handle browser Back / Forward buttons
window.addEventListener("popstate", () => {
  const key = detectTeacherKey();
  if (key) renderLetter(key);
  else renderDirectory();
});

// Boot
const initialKey = detectTeacherKey();
if (initialKey) {
  renderLetter(initialKey);
} else {
  renderDirectory();
}