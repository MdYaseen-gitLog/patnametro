const NY_TEST_MODE = true; // ← false in production

(function () {
  const today = new Date();
  const year = today.getFullYear();

  if (!NY_TEST_MODE) {
    const startDate = new Date(year - 1, 11, 25);
    const endDate   = new Date(year, 0, 2);
    if (today < startDate || today >= endDate) return;
  }

  //if (localStorage.getItem("nyOverlayClosed")) return;

  /* ===============================
     STYLES
  =============================== */
  const style = document.createElement("style");
  style.innerHTML = `
  .ny-overlay{
    position:fixed;inset:0;z-index:99999;
    background:linear-gradient(
      135deg,
      rgba(15,32,39,.92),
      rgba(32,58,67,.88),
      rgba(44,83,100,.92)
    );
    backdrop-filter: blur(12px);
    display:flex;align-items:center;justify-content:center;
    animation:fadeIn .8s ease;
    font-family:Segoe UI,sans-serif;
  }
  .ny-card{
    background:rgba(255,255,255,.08);
    border:1px solid rgba(255,255,255,.2);
    border-radius:22px;
    padding:36px;
    max-width:620px;
    width:90%;
    text-align:center;
    color:#fff;
    box-shadow:0 25px 60px rgba(0,0,0,.45);
  }
  .ny-title{
    font-size:36px;
    font-weight:700;
    margin-bottom:12px;
    text-shadow:0 0 20px rgba(255,255,255,.25);
  }
  .ny-sub{
    font-size:18px;
    opacity:.95;
    margin-bottom:20px;
  }
  .ny-msg{
    font-size:15px;
    line-height:1.7;
    opacity:.9;
    margin-bottom:28px;
  }
  .ny-actions{
    display:flex;
    justify-content:center;
    gap:14px;
    flex-wrap:wrap;
  }
  .ny-btn{
    padding:12px 22px;
    border-radius:30px;
    border:none;
    cursor:pointer;
    font-size:15px;
    font-weight:600;
  }
  .ny-primary{
    background:#00e5ff;
    color:#003b44;
  }
  .ny-secondary{
    background:rgba(255,255,255,.18);
    color:#fff;
  }
  .confetti{
    position:absolute;
    top:-10px;
    font-size:20px;
    animation:fall linear infinite;
    opacity:.9;
  }
  @keyframes fall{
    to{transform:translateY(120vh) rotate(360deg)}
  }
  @keyframes fadeIn{
    from{opacity:0}to{opacity:1}
  }
  @media(max-width:600px){
    .ny-title{font-size:28px}
    .ny-sub{font-size:16px}
  }
    .ny-bg-logo{
  position:absolute;
  inset:0;
  background:url("data/icons/icon-512.png") center/420px no-repeat;
  opacity:0.1;
  filter: blur(1px);
  transform: rotate(0deg);
  pointer-events:none;
}

@media(max-width:600px){
  .ny-bg-logo{
    background-size:280px;
  }
}

  `;
  document.head.appendChild(style);

  /* ===============================
     HTML
  =============================== */
  const overlay = document.createElement("div");
  overlay.className = "ny-overlay";
  overlay.innerHTML = `
  <div class="ny-bg-logo"></div>

    <div class="ny-card">
      <div class="ny-title">Happy New Year 2026</div>
      <div class="ny-sub">A new year. New journeys. Endless destinations.</div>
      🎆
      <div class="ny-msg">
        May this year take you to the places you dream of,
        connect you to the people you love,
        and move you closer to every goal you’ve planned.
        <br><br>
        Travel smarter, ride safer, and arrive happier with us.
        Let every station be a new beginning 🚆✨
      </div>
      <div class="ny-actions">
        <button class="ny-btn ny-primary" id="nyContinue">Continue Journey</button>
        <button class="ny-btn ny-secondary" id="nyClose">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ===============================
     ACTIONS
  =============================== */
  function closeOverlay() {
    overlay.remove();
   // localStorage.setItem("nyOverlayClosed", "true");
  }

  overlay.querySelector("#nyClose").onclick = closeOverlay;
  overlay.querySelector("#nyContinue").onclick = closeOverlay;

  /* ===============================
     TRAVEL CONFETTI
  =============================== */
  const icons = ["🚆","🚉","🧳","🗺️","✈️"];

  setInterval(() => {
    const c = document.createElement("div");
    c.className = "confetti";
    c.innerText = icons[Math.floor(Math.random()*icons.length)];
    c.style.left = Math.random()*100 + "vw";
    c.style.animationDuration = 4 + Math.random()*3 + "s";
    overlay.appendChild(c);
    setTimeout(()=>c.remove(),7000);
  }, 600);
})();

