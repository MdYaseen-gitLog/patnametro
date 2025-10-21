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
    // Show tooltip after 10 seconds
    setTimeout(() => {
      btn._tippy.show();
      // Hide tooltip after 10 seconds (optional)
      setTimeout(() => btn._tippy.hide(), 10000);
    }, 10000); // 10000 ms = 10 seconds
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
    // Show tooltip after 12 seconds
    setTimeout(() => {
      btn._tippy.show();

      // Hide tooltip after 8 seconds (optional)
      setTimeout(() => btn._tippy.hide(), 8000);
    }, 12000); // 12000 ms = 10 seconds
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

    // Show tooltip after 14 seconds
    setTimeout(() => {
      btn._tippy.show();

      // Hide tooltip after 6 seconds (optional)
      setTimeout(() => btn._tippy.hide(), 6000);
    }, 14000); // 10000 ms = 10 seconds
  });

  const checkbox = document.getElementById('enableLocation');
  if (!checkbox) return;
  // Call for checkbox
  showTooltipOnceWhenVisible('enableLocation', 'Tip: Check this to find the nearest station to you!');

  // Call for swap button
  showTooltipOnceWhenVisible('btnSwap', 'Tip: Click to swap origin and destination!');


});

function showTooltipOnceWhenVisible(elementId, tooltipContent, delay = 10000, duration = 15000) {
  const el = document.getElementById(elementId);
  if (!el) return;

  setTimeout(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tippy(el, {
            content: tooltipContent,
            arrow: true,
            placement: 'top',
            theme: 'leaflet-dark',
            trigger: 'manual',
          });

          if (el._tippy) {
            el._tippy.show();

            setTimeout(() => {
              el._tippy.hide();
            }, duration);
          }

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 1.0 // Only when fully in view
    });

    observer.observe(el);
  }, delay);
}