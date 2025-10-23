// notifications.js

// --- Notification Categories ---
const metroSecurity = [
  "🔒 Don't share your metro card with others.",
  "👮 Report suspicious activity to metro staff.",
  "📸 Surveillance cameras are in operation."
];

const metroTips = [
  "🚇 Plan your route in advance using the Metro app.",
  "📱 Tap-to-pay is available at all stations.",
  "🕒 Avoid peak hours for a more comfortable ride."
];

const metroMore = [
   "📸 Surveillance cameras are in operation.",
   "🚇Plan your route in advance using the PMet app.",
   "👮 Report suspicious activity to metro staff.",
  "Give way for the PersonsWith Disabilities, Sr. Citizens, Ladies & sick Persons",
  "Take care of your loose items like saree, dupatta, dhoti and bag etc. while boarding/alighting.",
  "Extra vigilant while travelling with children & infant.",
  "Mind the gap between platform and train doors.",
  "Check your destination from System Map",
  "Take Care of your Valuables"
];

// --- Combine All Notifications ---
const notifications = [...metroSecurity, ...metroTips, ...metroMore];

// --- Settings ---
let currentIndex = 2;
const delayBetween = 5000;     // Time between messages (ms)
const autoHideDelay = 6000;     // Time each message is visible (ms)
const startDelay = 8000;        // Time after page load to start (ms)

// --- Show Notification ---
function showNotification(message) {
  if (document.getElementById("metro-notification")) return;

  const notification = document.createElement("div");
  notification.id = "metro-notification";
  notification.innerText = message;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2c3e50;
    color: #ecf0f1;
    padding: 14px 22px;
    border-radius: 6px;
    font-family: sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.5s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
  }, autoHideDelay);
}

// --- Cycle Notifications ---
function cycleNotifications() {
  if (currentIndex >= notifications.length) return;

  showNotification(notifications[currentIndex]);
  currentIndex++;

  if (currentIndex < notifications.length) {
    setTimeout(cycleNotifications, delayBetween);
  }
}

// --- Check for PWA Standalone Mode ---
function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

// --- Initialize Notification System ---
window.addEventListener("load", () => {
  if (isStandaloneMode()) return;

  // Delay the start of the notification system
  setTimeout(() => {
    cycleNotifications();
  }, startDelay);
});
