(function () {
    const banner = document.createElement("div");
    banner.id = "diwaliBanner";
    banner.innerHTML = `
        <div class="diwali-banner-content">
            <img src="icon-192.png" alt="Logo" />
            <div>
                <h1>🎆 Happy Diwali! 🎇</h1>
                <p>Wishing you joy, light, and prosperity.</p>
            </div>
            <div id="bottomMessage"> Happy Journey with Patna Metro </div>
            <button id="closeBanner" disabled>Celebrate!</button>

            <canvas id="fireworksCanvas"></canvas>
        </div>
    `;
    document.body.appendChild(banner);

    // Load styles
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "diwali-banner.css";
    document.head.appendChild(link);

    // Close button
    document.getElementById("closeBanner").onclick = function () {
        document.getElementById("diwaliBanner").style.display = "none";
    };

    // Fireworks logic
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let fireworks = [];

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2;
        const count = 50 + Math.random() * 50;
        const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        const particles = [];

        for (let i = 0; i < count; i++) {
            particles.push({
                x,
                y,
                angle: Math.random() * 2 * Math.PI,
                speed: Math.random() * 5 + 1,
                radius: Math.random() * 2 + 1,
                alpha: 1,
                color
            });
        }

        fireworks.push(particles);
    }

    function updateFireworks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((particles, i) => {
            particles.forEach(p => {
                const dx = Math.cos(p.angle) * p.speed;
                const dy = Math.sin(p.angle) * p.speed;
                p.x += dx;
                p.y += dy;
                p.alpha -= 0.01;
            });
            fireworks[i] = particles.filter(p => p.alpha > 0);
        });

        fireworks = fireworks.filter(p => p.length > 0);

        fireworks.forEach(particles => {
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            });
        });

        ctx.globalAlpha = 1;

        requestAnimationFrame(updateFireworks);
    }

    setInterval(createFirework, 700);
    updateFireworks();

    // Optional: auto-close after 10 seconds
    setTimeout(() => {
        document.getElementById("diwaliBanner").style.display = "none";
    }, 80000);

    const btn = document.getElementById("closeBanner");
    btn.innerText = "Please wait...";
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
    // Enable "Celebrate!" button after 15 seconds
    setTimeout(() => {
        const btn = document.getElementById("closeBanner");
        btn.disabled = false;
        btn.innerText = "Close & Celebrate!";
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
    }, 15000);

})();



