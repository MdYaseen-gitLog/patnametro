function clearWeatherEffects() {
      const container = document.getElementById('weatherEffect');
      container.className = 'weather-effect';
      container.innerHTML = '';
      document.body.classList.remove('active-lightning');
      document.querySelector('.flash').style.opacity = 0;
    }

    function setWeatherBackground(condition) {
      const body = document.body;
      const effect = document.getElementById('weatherEffect');
      clearWeatherEffects();
      const weather = condition.toLowerCase();

      switch (weather) {
        case 'clear':
          body.style.background = 'linear-gradient(to top, #56ccf2, #2f80ed)';
          break;
        case 'clouds':
          body.style.background = 'linear-gradient(to top, #bdc3c7, #2c3e50)';
          break;
        case 'rain':
          body.style.background = '#3a3f44';
          effect.classList.add('rain');
          for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'drop';
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.animationDelay = (Math.random() * 1) + 's';
            drop.style.height = (10 + Math.random() * 10) + 'px';
            drop.style.width = '2px';
            drop.style.animationDuration = '0.5s';
            effect.appendChild(drop);
          }
          break;
        case 'drizzle':
          body.style.background = '#4a4f53';
          effect.classList.add('rain');
          for (let i = 0; i < 40; i++) {
            const drop = document.createElement('div');
            drop.className = 'drop';
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.animationDelay = (Math.random() * 1) + 's';
            drop.style.height = (7 + Math.random() * 3) + 'px';
            drop.style.width = '1px';
            drop.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
            effect.appendChild(drop);
          }
          break;
        case 'snow':
          body.style.background = '#8aa6d3';
          effect.classList.add('snow');
          for (let i = 0; i < 100; i++) {
            const flake = document.createElement('div');
            flake.className = 'flake';
            flake.innerText = '❄';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animationDuration = (3 + Math.random() * 5) + 's';
            effect.appendChild(flake);
          }
          break;
        case 'thunderstorm':
          body.style.background = '#1e272e';
          body.classList.add('active-lightning');
          break;
        case 'mist':
        case 'fog':
        case 'haze':
          body.style.background = '#95a5a6';
          effect.classList.add('fog');
          break;
        default:
          body.style.background = '#333';
      }
    }