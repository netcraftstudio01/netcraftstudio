// This script attempts to blur team images if a screenshot or screen recording is detected.
// Note: No method is 100% reliable, but this deters most users.

function enableScreenshotBlur() {
  document.body.classList.add('screenshot-blur');
  setTimeout(disableScreenshotBlur, 800);
}
function disableScreenshotBlur() {
  document.body.classList.remove('screenshot-blur');
}

// Desktop: PrintScreen key
window.addEventListener('keyup', (e) => {
  if (e.key === 'PrintScreen') {
    enableScreenshotBlur();
  }
});

// Tab hidden (many screenshot tools)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    enableScreenshotBlur();
  }
});

// Window blur (screen recording, screenshot, app switch)
window.addEventListener('blur', () => {
  enableScreenshotBlur();
});

// Mobile: Touch events (3-finger tap, long press, volume+power)
window.addEventListener('touchstart', (e) => {
  if (e.touches.length >= 3) {
    enableScreenshotBlur();
  }
});

// Mobile: Listen for orientation change (sometimes triggers screenshot)
window.addEventListener('orientationchange', () => {
  enableScreenshotBlur();
});

// Optionally, always blur on mobile for extra protection
if (/Mobi|Android/i.test(navigator.userAgent)) {
  // Uncomment below to always blur on mobile
  // enableScreenshotBlur();
}
