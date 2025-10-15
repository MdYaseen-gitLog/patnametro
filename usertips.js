 function waitForLeafletControl(selector, callback, timeout = 5000) {
  const start = Date.now();

  const checkExist = () => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else if (Date.now() - start < timeout) {
      requestAnimationFrame(checkExist);
    } else {
      console.warn(`Element ${selector} not found in time`);
    }
  };

  checkExist();
}

window.addEventListener('DOMContentLoaded', () => {
  // Zoom In button
  waitForLeafletControl('.leaflet-control-zoom-in', (btn) => {
    tippy(btn, {
      content: 'Zoom In',
      placement: 'left',
      theme: 'leaflet-dark',
      arrow: true,
      trigger: 'manual'  // important to disable default hover/focus triggers
    });
    btn._tippy.show();  // show immediately on load

    // Optional: auto hide after 5 seconds
    setTimeout(() => {
      btn._tippy.hide();
    }, 5000);
  });

  // Zoom Out button
  waitForLeafletControl('.leaflet-control-zoom-out', (btn) => {
    tippy(btn, {
      content: 'Zoom Out',
      placement: 'left',
      theme: 'leaflet-dark',
      arrow: true,
      trigger: 'manual'
    });
    btn._tippy.show();
    setTimeout(() => btn._tippy.hide(), 5000);
  });

  // Fullscreen button (if present)
  waitForLeafletControl('.leaflet-control-zoom-fullscreen', (btn) => {
    tippy(btn, {
      content: 'Full Screen',
      placement: 'bottom',
      theme: 'leaflet-dark',
      arrow: true,
      trigger: 'manual'
    });
    btn._tippy.show();
    setTimeout(() => btn._tippy.hide(), 5000);
  });

  const checkbox = document.getElementById('enableLocation');
          if (!checkbox) return;
    
          // Delay 10 seconds
          setTimeout(() => {
            // Start observing visibility
            const observer = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  // Tooltip logic
                  tippy(checkbox, {
                    content: 'Tip: Check this to find the nearest station to you!',
                    arrow: true,
                    placement: 'top',
                    theme: 'leaflet-dark',
                    trigger: 'manual',
                  });
    
                  checkbox._tippy.show();
    
                  // Hide tooltip after 15 seconds
                  setTimeout(() => {
                    checkbox._tippy.hide();
                  }, 15000);
    
                  // Stop observing after first appearance
                  observer.unobserve(checkbox);
                }
              });
            }, {
              threshold: 1.0 // Fully in view (you can set to 0.5 if partial is ok)
            });
    
            observer.observe(checkbox);
          }, 3000); // 10s delay

});