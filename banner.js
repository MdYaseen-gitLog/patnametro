window.addEventListener("load", function () {
  // Get current count from sessionStorage
  const count = parseInt(sessionStorage.getItem("metroBannerCount") || "0", 10);

  // Show banner only if shown less than 3 times
  if (count >= 1) return;

  // Increment and store the new count
  sessionStorage.setItem("metroBannerCount", (count + 1).toString());

  // Load banner.html
  fetch("banner.html")
    .then(res => res.text())
    .then(html => {
      if (document.getElementById("metro-banner")) return;
      document.body.insertAdjacentHTML("afterbegin", html);

      const banner = document.getElementById("metro-banner");
      if (!banner) return;

      banner.style.display = "block";

      // Auto-hide after 10 seconds
      setTimeout(() => {
        banner.style.animation = "fadeOut 1s forwards";
        setTimeout(() => banner.remove(), 1000);
      }, 10000);
    })
    .catch(err => console.error("🚨 Banner failed to load:", err));
});
