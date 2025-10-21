window.addEventListener("load", function () {
  // 🚫 Skip if running as a PWA in standalone mode
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  if (isStandalone) return;

  // Get current count from sessionStorage
  const count = parseInt(sessionStorage.getItem("metroBannerCount") || "0", 10);

  // Show banner only if shown less than once per session
  if (count >= 1) return;

  // Load banner.html
  fetch("banner.html")
    .then(res => res.text())
    .then(html => {
      if (document.getElementById("metro-banner")) return;

      document.body.insertAdjacentHTML("afterbegin", html);

      const banner = document.getElementById("metro-banner");
      if (!banner) return;

      // ✅ Store the count after successful insertion
      sessionStorage.setItem("metroBannerCount", (count + 1).toString());

      banner.style.display = "block";

      // Auto-hide after 8s + 1s fade
      setTimeout(() => {
        banner.style.animation = "fadeOut 1s forwards";
        setTimeout(() => banner.remove(), 1000);
      }, 8000);
    })
    .catch(err => console.error("🚨 Banner failed to load:", err));
});

