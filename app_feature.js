// JavaScript
document.addEventListener('DOMContentLoaded', function () {
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true; // iOS Safari check

  if (!isStandalone) return; // Don't show banner in PWA mode
  const banner = document.getElementById('feature-banner');
  if (!banner) return;

  // Set banner content
  banner.innerHTML = `
        <img src="getdirection.jpg" alt="Metro Map Screenshot">
        <h3>Tap on station & get Direction</h3>
    `;

  // Show banner with transition
  banner.classList.add('show');

  // Auto-hide after 10 seconds
  setTimeout(() => {
    banner.classList.remove('show');
  }, 10000); // 10,000 ms = 10 seconds
});
