(function () {
    const banner = document.createElement("div");
    banner.id = "christmasBanner";
    banner.innerHTML = `
        <div class="christmas-banner-content">
            <img src="data/icons/icon-192.png" alt="Logo" />
            <div>
                <h1>🎄 Merry Christmas! 🎅</h1>
                <p>Wishing you peace, joy, and warmth.</p>
            </div>
            <div id="bottomMessage"> Happy Journey with Patna Metro </div>
        

            <canvas id="snowCanvas"></canvas>
        </div>
    `;
    document.body.appendChild(banner);

    // Load styles
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "christmas-banner.css";
    document.head.appendChild(link);


    /* ❄️ Snowfall Logic */
    const canvas = document.getElementById("snowCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let snowflakes = [];

    function createSnowflake() {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: -10,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 1,
            drift: Math.random() * 1 - 0.5
        });
    }

    function updateSnow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snowflakes.forEach(flake => {
            flake.y += flake.speed;
            flake.x += flake.drift;

            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        });

        snowflakes = snowflakes.filter(flake => flake.y < canvas.height);

        requestAnimationFrame(updateSnow);
    }

    setInterval(createSnowflake, 100);
    updateSnow();

    // Auto-hide banner after 5 seconds
    setTimeout(() => {
        const banner = document.getElementById("christmasBanner");
        banner.style.opacity = "0";
        banner.style.transition = "opacity 1s ease";

        setTimeout(() => {
            banner.style.display = "none";
        }, 1000);
    }, 7000);



})();
