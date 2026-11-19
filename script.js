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
  // Allow ?to=mr-huang only when opening locally via file:// on your computer
  if (isLocalFile) {
    const params = new URLSearchParams(window.location.search);
    const queryKey = normalizeSlug(params.get("to"));
    if (queryKey && TEACHERS[queryKey]) return queryKey;
    return null;
  }

  // Strictly match /teacher-name path on live site
  const pathSlug = normalizeSlug(window.location.pathname.replace(/^\/|\/$/g, ""));
  if (pathSlug && TEACHERS[pathSlug]) return pathSlug;

  return null;
}

function renderLetter(key) {
  currentTeacherKey = key;
  bloomCount = 0;
  const data = TEACHERS[key];
  document.title = `For ${data.name} • Thank You`;

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

  document.getElementById("cover-view").classList.add("hidden");
  document.getElementById("letter-view").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();

  if (window.gsap) {
    gsap.from(".reveal", {
      y: 22,
      opacity: 0,
      duration: 0.85,
      stagger: 0.14,
      ease: "power3.out"
    });
  }
}

document.getElementById("appreciate-btn").addEventListener("click", () => {
  if (!currentTeacherKey) return;
  const data = TEACHERS[currentTeacherKey];
  bloomCount++;
  if (window.confetti) {
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.72 },
      colors: [data.accent, "#fbbf24", "#f472b6", "#34d399"]
    });
  }
  document.getElementById("appreciate-label").textContent =
    bloomCount === 1 ? "Bloom Sent!" : `Sent ${bloomCount} Blooms`;
});

// Boot
const teacherKey = detectTeacherKey();
if (teacherKey) {
  renderLetter(teacherKey);
} else {
  document.getElementById("ambient-glow").style.background =
    "radial-gradient(ellipse at top, rgba(245, 158, 11, 0.08), transparent 70%)";
  if (window.lucide) lucide.createIcons();
}