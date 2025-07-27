const toggleBtn = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

toggleBtn.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-theme");
  const newTheme = current === "dark" ? "light" : "dark";
  htmlEl.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  toggleBtn.innerHTML = newTheme === "dark" ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  htmlEl.setAttribute("data-theme", savedTheme);
  toggleBtn.innerHTML = savedTheme === "dark" ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
});
