// banner.js
window.addEventListener("load", function() {
  // Skip if already shown this session
//   if (sessionStorage.getItem("metroBannerShown")) return;
//   sessionStorage.setItem("metroBannerShown", "true");

  // Load banner.html
  fetch("banner.html")
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);

      const banner = document.getElementById("metro-banner");
      banner.style.display = "block";

      // Auto-hide after 10 seconds
      setTimeout(() => {
        banner.style.animation = "fadeOut 1s forwards";
        setTimeout(() => banner.remove(), 1000);
      }, 10000);
    })
    .catch(err => console.error("Banner failed to load:", err));
});
