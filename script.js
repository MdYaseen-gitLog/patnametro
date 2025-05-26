const eventDate = new Date("2025-08-15"); // <-- Set your event date here
let countdownElement = document.getElementById("countdown");
let splash = document.getElementById("splash");
let mainContent = document.getElementById("main-content");


let opacity = 1; // Opacity value between 0 (transparent) and 1 (opaque)
// Set background color with opacity (e.g., black with 50% opacity)

let seconds = daysFromToday(eventDate);
console.log(seconds);
if (seconds > 0) {

  countdownElement.textContent = seconds;
  const countdownInterval = setInterval(() => {
    opacity = (seconds - 1) / 100;
    countdownElement.textContent = seconds;
    
    seconds--;

    splash.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;

    if (seconds <= 0) {
      clearInterval(countdownInterval);
      splash.style.display = "none";
      mainContent.style.display = "block";
    }
  }, 50);
}



function daysFromToday(targetDate) {
  const today = new Date(); // current date
  const target = new Date(targetDate);

  // Clear the time portion to only compare dates
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

// Example usage
const endDate = '2025-05-20';
console.log(); // Output: Number of days from today to May 20, 2025

