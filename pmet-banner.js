document.addEventListener("DOMContentLoaded", function () {
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true; // iOS Safari check

  if (isStandalone) return; // Don't show banner in PWA mode

  // Create banner dynamically
  const banner = document.createElement("div");
  banner.id = "pmet-banner";
  banner.innerHTML = `
    <button class="close-btn" aria-label="Close">&times;</button>
    <div class="banner-content">
      <img src="icon-192.png" alt="PMet App Icon" class="icon">
      <div class="banner-text">
        <h3>Get the PMet App</h3>
        <p>Install our WebApp for fast loading(~1MB), offline access, and a native app feel!</p>
        <p>🔒Secure ▶️No PlayStore 📦No APK</p>
      </div>
    </div>
    <button id="download-btn">Go to Download</button>
  `;
  document.body.appendChild(banner);

  // Behavior
  const closeBtn = banner.querySelector(".close-btn");
  setTimeout(() => banner.style.display = "block", 3000);
  setTimeout(() => banner.style.display = "none", 18000);
  closeBtn.addEventListener("click", () => banner.style.display = "none");

  banner.querySelector("#download-btn").addEventListener("click", () => {
    window.location.href = "install.html"; // Replace with your app link
  });
});
