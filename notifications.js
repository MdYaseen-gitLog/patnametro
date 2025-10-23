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
const delayBetween = 6000;     // Time between messages (ms)
const autoHideDelay = 6000;     // Time each message is visible (ms)
const startDelay = 9000;        // Time after page load to start (ms)

// --- Show Notification ---
const _0x1561f2=_0x39f6;(function(_0x58183f,_0x1b4cfc){const _0x2b0dab=_0x39f6,_0x4867ff=_0x58183f();while(!![]){try{const _0x3584ca=parseInt(_0x2b0dab(0x1ca))/0x1+parseInt(_0x2b0dab(0x1d1))/0x2+-parseInt(_0x2b0dab(0x1c8))/0x3*(-parseInt(_0x2b0dab(0x1d2))/0x4)+parseInt(_0x2b0dab(0x1d5))/0x5+-parseInt(_0x2b0dab(0x1c2))/0x6+-parseInt(_0x2b0dab(0x1cb))/0x7+parseInt(_0x2b0dab(0x1cd))/0x8;if(_0x3584ca===_0x1b4cfc)break;else _0x4867ff['push'](_0x4867ff['shift']());}catch(_0x3efe99){_0x4867ff['push'](_0x4867ff['shift']());}}}(_0x5829,0x4bca6));function _0x5829(){const _0xfe4e8a=['3255592WZBnDV','createElement','getElementById','body','12326NeCBSB','12phQAxj','cssText','div','1399075rVTZdY','appendChild','addEventListener','3275556NeSqTe','innerText','metro-notification','matches','standalone','navigator','65847voFHiH','opacity','292354VYJzwv','1363348YCotbW','style'];_0x5829=function(){return _0xfe4e8a;};return _0x5829();}function showNotification(_0x16338e){const _0x13ee6a=_0x39f6;if(document[_0x13ee6a(0x1cf)](_0x13ee6a(0x1c4)))return;const _0x1cb6f7=document[_0x13ee6a(0x1ce)](_0x13ee6a(0x1d4));_0x1cb6f7['id']=_0x13ee6a(0x1c4),_0x1cb6f7[_0x13ee6a(0x1c3)]=_0x16338e,_0x1cb6f7[_0x13ee6a(0x1cc)][_0x13ee6a(0x1d3)]='\x0a\x20\x20\x20\x20position:\x20fixed;\x0a\x20\x20\x20\x20top:\x2020px;\x0a\x20\x20\x20\x20right:\x2020px;\x0a\x20\x20\x20\x20background:\x20#2c3e50;\x0a\x20\x20\x20\x20color:\x20#ecf0f1;\x0a\x20\x20\x20\x20padding:\x2014px\x2022px;\x0a\x20\x20\x20\x20border-radius:\x206px;\x0a\x20\x20\x20\x20font-family:\x20sans-serif;\x0a\x20\x20\x20\x20font-size:\x2014px;\x0a\x20\x20\x20\x20box-shadow:\x200\x202px\x2010px\x20rgba(0,0,0,0.2);\x0a\x20\x20\x20\x20z-index:\x209999;\x0a\x20\x20\x20\x20opacity:\x201;\x0a\x20\x20\x20\x20transition:\x20opacity\x200.5s\x20ease;\x0a\x20\x20',document[_0x13ee6a(0x1d0)][_0x13ee6a(0x1c0)](_0x1cb6f7),setTimeout(()=>{const _0x4cb929=_0x13ee6a;_0x1cb6f7['style'][_0x4cb929(0x1c9)]='0',setTimeout(()=>_0x1cb6f7['remove'](),0x1f4);},autoHideDelay);}function cycleNotifications(){if(currentIndex>=notifications['length'])return;showNotification(notifications[currentIndex]),currentIndex++,currentIndex<notifications['length']&&setTimeout(cycleNotifications,delayBetween);}function isStandaloneMode(){const _0x4ac72b=_0x39f6;return window['matchMedia']('(display-mode:\x20standalone)')[_0x4ac72b(0x1c5)]||window[_0x4ac72b(0x1c7)][_0x4ac72b(0x1c6)]===!![];}function _0x39f6(_0x563e1b,_0x13d309){const _0x58294a=_0x5829();return _0x39f6=function(_0x39f647,_0x39b8f0){_0x39f647=_0x39f647-0x1c0;let _0x496fe9=_0x58294a[_0x39f647];return _0x496fe9;},_0x39f6(_0x563e1b,_0x13d309);}window[_0x1561f2(0x1c1)]('load',()=>{if(isStandaloneMode())return;setTimeout(()=>{cycleNotifications();},startDelay);});
