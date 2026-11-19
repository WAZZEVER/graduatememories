function normalizeSlug(raw) {
  return decodeURIComponent(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-"); // Converts spaces ("mr huang") to hyphens ("mr-huang")
}

function detectTeacherKey() {
  const params = new URLSearchParams(window.location.search);
  const queryKey = normalizeSlug(params.get("to"));
  if (queryKey && TEACHERS[queryKey]) return queryKey;

  const pathSlug = normalizeSlug(window.location.pathname.replace(/^\/|\/$/g, ""));
  if (pathSlug && TEACHERS[pathSlug]) return pathSlug;

  return null;
}

function renderLetter(key) {
  const data = TEACHERS[key];
  document.title = `For ${data.name} • Thank You`;

  // Apply teacher's accent colors
  document.getElementById("ambient-glow").style.background =
    `radial-gradient(ellipse at top, ${data.accentSoft}, transparent 70%)`;
  document.getElementById("card-accent-bar").style.backgroundColor = data.accent;
  document.getElementById("badge-icon").style.color = data.accent;

  const quoteEl = document.getElementById("memory-quote");
  quoteEl.style.backgroundColor = data.accentSoft;
  quoteEl.style.borderColor = data.accent;
  quoteEl.textContent = data.memoryQuote;

  const btn = document.getElementById("appreciate-btn");
  btn.style.backgroundColor = data.accent;

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

  // Show Letter View & animate
  document.getElementById("letter-view").classList.remove("hidden");
  lucide.createIcons();

  gsap.from(".reveal", {
    y: 22,
    opacity: 0,
    duration: 0.85,
    stagger: 0.14,
    ease: "power3.out"
  });

  // Interactive Bloom Confetti Button
  let bloomCount = 0;
  btn.addEventListener("click", () => {
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
}

function renderDirectory() {
  const grid = document.getElementById("directory-grid");
  grid.innerHTML = "";

  Object.entries(TEACHERS).forEach(([key, data]) => {
    const card = document.createElement("a");
    card.href = window.location.protocol === "file:" ? `?to=${key}` : `/${key}`;
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
    grid.appendChild(card);
  });

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

// Boot
const teacherKey = detectTeacherKey();
if (teacherKey) {
  renderLetter(teacherKey);
} else {
  renderDirectory();
}