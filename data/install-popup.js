// install-popup.js
let deferredPrompt;

function showInstallPopup() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        return; // Don't show for standalone users
    }

    // Avoid showing again if dismissed recently
    if (localStorage.getItem('pmet_popup_dismissed') === 'true') return;

    setTimeout(() => {
        const popup = document.createElement('div');
        popup.id = 'installPopup';
        popup.className = 'install-popup shadow-lg';
        popup.innerHTML = `
      <div class="install-content">
        <img src="data/icons/icon-192.png" alt="PMet Icon" class="app-icon">
        <div>
          <h5>Download PMet App</h5>
          <p>For better and faster performance, use the PMet app on your device.</p>
          <button id="installBtn" class="btn btn-primary btn-sm">Install Now</button>
          <button id="closePopup" class="btn btn-outline-secondary btn-sm">Maybe Later</button>
        </div>
      </div>
    `;
        document.body.appendChild(popup);

        document.getElementById('installBtn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                if (choice.outcome === 'accepted') {
                    // console.log('User accepted the PWA install prompt');
                }
                deferredPrompt = null;
            }
            popup.remove();
        });

        window.addEventListener('appinstalled', () => {
            // Track install event in Google Analytics
            gtag('event', 'pwa_install', {
                event_category: 'PWA',
                event_label: 'App Installed'
            });

            // User feedback
            alert('✅ PMet App installed successfully! Please wait while the app opens...');

            // Hide popup if visible
            const installBtn = document.getElementById('installBtn');
            if (installBtn) installBtn.style.display = 'none';

            const popup = document.getElementById('installPopup');
            if (popup) popup.remove();
        });

        document.getElementById('closePopup').addEventListener('click', () => {
            popup.remove();
            localStorage.setItem('pmet_popup_dismissed', 'true');
            // Popup won’t show again for 2 days
            setTimeout(() => localStorage.removeItem('pmet_popup_dismissed'), 2 * 24 * 60 * 60 * 1000);
        });
    }, 5000); // show after 5 seconds
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPopup();
});
