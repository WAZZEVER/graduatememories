// 1. Initialize Lucide Icons
lucide.createIcons();

// 2. GSAP Entrance Animations
gsap.from(".hero-animate", {
  y: 24,
  opacity: 0,
  duration: 0.8,
  stagger: 0.12,
  ease: "power3.out"
});

// 3. Dark Mode Toggle with LocalStorage Persistence
const themeToggle = document.getElementById("theme-toggle");
const htmlEl = document.documentElement;

if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  htmlEl.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  htmlEl.classList.toggle("dark");
  localStorage.theme = htmlEl.classList.contains("dark") ? "dark" : "light";
});

// 4. Interactive Confetti Button
document.getElementById("celebrate-btn").addEventListener("click", () => {
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.7 }
  });
});

// 5. Category Filter Logic
const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button styling
    filterBtns.forEach((b) => {
      b.classList.remove("bg-indigo-600", "text-white");
      b.classList.add("bg-slate-200/70", "dark:bg-slate-800");
    });
    btn.classList.remove("bg-slate-200/70", "dark:bg-slate-800");
    btn.classList.add("bg-indigo-600", "text-white");

    // Filter cards
    const filter = btn.getAttribute("data-filter");
    cards.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (filter === "all" || category === filter) {
        card.classList.remove("hidden-card");
        gsap.fromTo(card, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.3 });
      } else {
        card.classList.add("hidden-card");
      }
    });
  });
});

// 6. Copy Email to Clipboard
const copyBtn = document.getElementById("copy-email-btn");
const copyText = document.getElementById("copy-text");

copyBtn.addEventListener("click", async () => {
  const email = copyBtn.getAttribute("data-email");
  await navigator.clipboard.writeText(email);
  copyText.textContent = "Copied to clipboard!";
  setTimeout(() => {
    copyText.textContent = email;
  }, 2000);
});