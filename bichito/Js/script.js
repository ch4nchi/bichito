//© Zero - Código libre no comercial

let firstClickDone = false;
let canShowLetter = false;
let letterFinished = false;

// Cargar el SVG y animar los corazones
fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // Después de la animación de dibujo, mueve y agranda el SVG
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        // Mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          // Mostrar petalos flotando
          startFloatingObjects();
          // Mostrar cuenta regresiva
          showCountdown();
          // Iniciar música de fondo
          playBackgroundMusic();
          // Mostrar imágenes de nebulosa alrededor del árbol
          showRandomNebulaImages();
        }, 1200); //Tiempo para agrandar el SVG
      }, totalDuration);
    }, 50);

    // Selecciona los corazones (formas rojas)
    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  if (!canShowLetter) return;
  
  let text = getURLParam('text');
  if (!text) {
  text = `Para mi bichito:\n\nGracias por sacar siempre el niño interior que llevo dentro y por hacerme la persona más feliz del mundo mundial. Cada día que paso contigo tengo más claro que quiero pasar toda mi vida a tu lado, construir una casita juntos y de tener un gato, o dos, o tres… o un perro, o dos, no sé, ya veremossss, pero contigo.\n\nGracias por estar siempre ahí cuando te necesito, en las malas, en las buenas y en todas las que vengan. Me encantaría seguir dándote mimos y cariño cada día, y poder vivir contigo todas las etapas que nos esperan, creciendo juntos, aprendiendo juntos y soñando siempre de la manita.\n\nEste es un pequeño contador del tiempo que llevamos juntos y de cuánto falta para nuestro cumpleaños, pero en realidad es un recordatorio de todo lo que hemos vivido y de todo lo que aún nos queda por vivir. Espero que te guste :)`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      // Al terminar el typing, mostrar la firma animada
      setTimeout(() => {
        showSignature();
        letterFinished = true; // Permitir imágenes después de la carta
      }, 600);
    }
  }
  type();
}

// Firma manuscrita animada
function showSignature() {
  // Cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Te quiere, Nelson <3 ";
  signature.classList.add('visible');
}



// Controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    // Posición inicial
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    // Animación flotante
    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    // Eliminar después de animar
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Generar más objetos
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// Cuenta regresiva o fecha especial
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2025-11-29T00:00:00'); 
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2026-11-29T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    
    // Calcular años, meses, días, horas, minutos y segundos desde que están juntos
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    
    // Ajustar si los días son negativos
    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // Ajustar si los meses son negativos
    if (months < 0) {
      years--;
      months += 12;
    }
    
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();
    
    // Ajustar valores negativos
    if (seconds < 0) {
      minutes--;
      seconds += 60;
    }
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    if (hours < 0) {
      days--;
      hours += 24;
    }
    
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `<div style="margin-bottom: 0.5em;">Llevamos juntos:</div>` +
      `<div style="display: inline-grid; grid-template-columns: repeat(6, auto); gap: 0.3em 0.8em; text-align: center; margin-bottom: 0.8em;">` +
      `<div><b>${years}</b></div><div><b>${months}</b></div><div><b>${days}</b></div><div><b>${hours}</b></div><div><b>${minutes}</b></div><div><b>${seconds}</b></div>` +
      `<div style="font-size: 0.75em; opacity: 0.8;">años</div><div style="font-size: 0.75em; opacity: 0.8;">meses</div><div style="font-size: 0.75em; opacity: 0.8;">días</div><div style="font-size: 0.75em; opacity: 0.8;">horas</div><div style="font-size: 0.75em; opacity: 0.8;">min</div><div style="font-size: 0.75em; opacity: 0.8;">seg</div>` +
      `</div>` +
      `<div style="margin-bottom: 0.5em; margin-top: 0.5em;">Nuestro aniversario:</div>` +
      `<div style="display: inline-grid; grid-template-columns: repeat(4, auto); gap: 0.3em 0.8em; text-align: center;">` +
      `<div><b>${eventDays}</b></div><div><b>${eventHours}</b></div><div><b>${eventMinutes}</b></div><div><b>${eventSeconds}</b></div>` +
      `<div style="font-size: 0.75em; opacity: 0.8;">días</div><div style="font-size: 0.75em; opacity: 0.8;">horas</div><div style="font-size: 0.75em; opacity: 0.8;">min</div><div style="font-size: 0.75em; opacity: 0.8;">seg</div>` +
      `</div>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

// --- Música de fondo ---
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // Lista de canciones disponibles
  const playlist = [
    'Barry B - Joga Bonito.mp3',
    'Bon Calso - AMOR DE GANGS7ER.mp3',
    'Bon Calso - via Maffia ft. superreservao.mp3',
    'C Marí - Qtalhoy.mp3',
    'Diego900 - Bonito Estrés.mp3',
    'Diego900 - Dam.mp3',
    'Ralphie Choo - VOYCONTODO.mp3',
    'rusowsky - 99%25.mp3',
    'tarchi - intro.mp3'
  ];
  
  let currentSongIndex = 0;
  let songHistory = [0]; // Historial de canciones reproducidas
  let playedInCurrentCycle = [0]; // Canciones reproducidas en el ciclo actual
  
  function getSongTitle(filename) {
    return filename.replace('.mp3', '').replace('%25', '%');
  }
  
  function getNextRandomSong() {
    // Si ya se reprodujeron todas en este ciclo, reiniciar el ciclo
    if (playedInCurrentCycle.length >= playlist.length) {
      playedInCurrentCycle = [];
    }
    
    // Obtener un índice aleatorio que no se haya reproducido en este ciclo
    let randomIndex;
    let attempts = 0;
    do {
      randomIndex = Math.floor(Math.random() * playlist.length);
      attempts++;
    } while (playedInCurrentCycle.includes(randomIndex) && attempts < 100);
    
    // Si no encontramos uno no reproducido (no debería pasar), usar cualquiera
    if (playedInCurrentCycle.includes(randomIndex)) {
      playedInCurrentCycle = [randomIndex];
    } else {
      playedInCurrentCycle.push(randomIndex);
    }
    
    songHistory.push(randomIndex);
    currentSongIndex = randomIndex;
    return randomIndex;
  }
  
  function getPrevSong() {
    // Buscar en el historial la canción anterior
    const currentPos = songHistory.lastIndexOf(currentSongIndex);
    if (currentPos > 0) {
      currentSongIndex = songHistory[currentPos - 1];
    }
    return currentSongIndex;
  }
  
  function loadSong(index) {
    currentSongIndex = index;
    audio.src = 'Music/' + playlist[index];
    audio.load();
    updateSongTitle();
    audio.play().then(() => {
      updatePlayButton(true);
    }).catch(() => {
      updatePlayButton(false);
    });
  }
  
  function updateSongTitle() {
    if (songTitle) {
      songTitle.textContent = getSongTitle(playlist[currentSongIndex]);
    }
  }
  
  function updatePlayButton(isPlaying) {
    if (playBtn) {
      playBtn.textContent = isPlaying ? '⏸' : '▶';
    }
  }

  // Crear reproductor estilo Spotify
  let player = document.getElementById('music-player');
  if (!player) {
    player = document.createElement('div');
    player.id = 'music-player';
    player.className = 'music-player';
    
    const songInfo = document.createElement('div');
    songInfo.className = 'music-info';
    songInfo.id = 'song-title';
    songInfo.textContent = getSongTitle(playlist[0]);
    
    const controls = document.createElement('div');
    controls.className = 'music-controls';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'music-btn';
    prevBtn.textContent = '⏮';
    prevBtn.title = 'Anterior';
    
    const playBtn = document.createElement('button');
    playBtn.className = 'music-btn play-btn';
    playBtn.textContent = '▶';
    playBtn.id = 'play-btn';
    playBtn.title = 'Reproducir/Pausar';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'music-btn';
    nextBtn.textContent = '⏭';
    nextBtn.title = 'Siguiente';
    
    controls.appendChild(prevBtn);
    controls.appendChild(playBtn);
    controls.appendChild(nextBtn);
    
    player.appendChild(songInfo);
    player.appendChild(controls);
    
    // Botón especial (siempre visible)
    const questionBtn = document.createElement('a');
    questionBtn.href = 'pregunta.html';
    questionBtn.className = 'mobile-question-btn';
    questionBtn.textContent = '💕';
    questionBtn.title = 'Pregunta especial';
    player.appendChild(questionBtn);
    
    document.body.appendChild(player);
    
    // Event listeners
    playBtn.onclick = () => {
      if (audio.paused) {
        audio.play().then(() => updatePlayButton(true));
      } else {
        audio.pause();
        updatePlayButton(false);
      }
    };
    
    nextBtn.onclick = () => {
      const nextIndex = getNextRandomSong();
      loadSong(nextIndex);
    };
    
    prevBtn.onclick = () => {
      const prevIndex = getPrevSong();
      loadSong(prevIndex);
    };
  }
  
  const songTitle = document.getElementById('song-title');
  const playBtn = document.getElementById('play-btn');
  
  // --- Opción archivo local por parámetro 'musica' ---
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  } else {
    audio.src = 'Music/' + playlist[0];
  }
  
  audio.volume = 0.7;
  
  // Cuando termine una canción, reproducir la siguiente aleatoria
  audio.addEventListener('ended', () => {
    const nextIndex = getNextRandomSong();
    loadSong(nextIndex);
  });
  
  // Actualizar el título inicial
  updateSongTitle();
  
  // Intentar reproducir inmediatamente con interacción del usuario
  const tryAutoplay = () => {
    audio.play().then(() => {
      updatePlayButton(true);
      document.removeEventListener('click', tryAutoplay);
      document.removeEventListener('touchstart', tryAutoplay);
    }).catch(() => {
      updatePlayButton(false);
    });
  };
  
  // Intentar reproducción inmediata
  tryAutoplay();
  
  // Si falla, esperar el primer click/touch del usuario
  document.addEventListener('click', tryAutoplay, { once: true });
  document.addEventListener('touchstart', tryAutoplay, { once: true });
}

// Mostrar imagen de nebulosa en posiciones aleatorias alrededor del árbol
function showRandomNebulaImages() {
  
  // Array de todas las imágenes disponibles
  const images = [
    'marta1.png', 'marta2.png', 'marta3.png', 'marta4.png', 'marta5.png',
    'marta6.png', 'marta7.png', 'marta8.png', 'marta9.png', 'marta10.png',
    'marta11.png', 'marta12.png', 'marta13.png', 'marta14.png', 'marta15.png',
    'marta16.png', 'marta17.png', 'marta18.png', 'marta19.png', 'marta20.png',
    'marta21.png', 'marta22.png', 'marta23.png', 'marta24.png', 'marta25.png',
    'marta26.png', 'marta27.png', 'marta28.png', 'marta29.png', 'marta30.png'
  ];
  
  function createNebulaImage() {
    const treeContainer = document.getElementById('tree-container');
    if (!treeContainer) return;
    
    const treeRect = treeContainer.getBoundingClientRect();
    const treeWidth = treeRect.width;
    const treeHeight = treeRect.height;
    const treeCenterX = treeRect.left + treeWidth / 2;
    const treeCenterY = treeRect.top + treeHeight / 2;
    
    // Radio para colocar las imágenes alrededor del árbol
    const radius = Math.max(treeWidth, treeHeight) / 2 + 80;
    
    const img = document.createElement('img');
    // Seleccionar una imagen aleatoria
    const randomImage = images[Math.floor(Math.random() * images.length)];
    img.src = 'Img/' + randomImage;
    img.className = 'nebula-image';
    
    // Generar un ángulo aleatorio alrededor del árbol
    const angle = Math.random() * 2 * Math.PI;
    
    // Calcular posición en el círculo alrededor del árbol
    const x = treeCenterX + radius * Math.cos(angle);
    const y = treeCenterY + radius * Math.sin(angle);
    
    // Ajustar tamaño según si es móvil
    const isMobile = window.innerWidth <= 700;
    const imgWidth = isMobile ? 220 : 450;
    const imgHeight = isMobile ? 160 : 320;
    
    // Calcular posición y asegurar que no se salga de la pantalla
    let posX = x - imgWidth / 2;
    let posY = y - imgHeight / 2;
    
    // Limitar para que no se salga de los bordes
    posX = Math.max(0, Math.min(posX, window.innerWidth - imgWidth));
    posY = Math.max(0, Math.min(posY, window.innerHeight - imgHeight));
    
    img.style.left = posX + 'px';
    img.style.top = posY + 'px';
    
    // Calcular rotación basada en la posición lateral
    // Convertir ángulo a grados
    const angleDeg = (angle * 180 / Math.PI) % 360;
    let rotation = 0;
    
    // Solo rotar si está a los lados (no arriba ni abajo)
    // Izquierda: entre 135° y 225° -> rotar a la izquierda (-15° a -25°)
    // Derecha: entre -45° y 45° o 315° y 360° -> rotar a la derecha (15° a 25°)
    // Arriba/Abajo: mantener recto (0°)
    if (angleDeg > 135 && angleDeg < 225) {
      // Lado izquierdo
      rotation = -15 - Math.random() * 10;
    } else if ((angleDeg >= 315 && angleDeg <= 360) || (angleDeg >= 0 && angleDeg < 45)) {
      // Lado derecho
      rotation = 15 + Math.random() * 10;
    }
    
    img.style.transform = `rotate(${rotation}deg)`;
    
    document.body.appendChild(img);
    
    // Hacer visible la imagen
    setTimeout(() => {
      img.classList.add('visible');
    }, 50);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
      img.classList.remove('visible');
      setTimeout(() => {
        if (img.parentNode) {
          img.parentNode.removeChild(img);
        }
      }, 500);
    }, 3000);
  }
  
  // Crear imágenes continuamente sin límite
  function scheduleNext() {
    createNebulaImage();
    setTimeout(scheduleNext, 2000 + Math.random() * 2000);
  }
  
  scheduleNext();
}

// Permitir crear imágenes con click
document.addEventListener('click', function(e) {
  // Primer click: activar el timer de 6 segundos para mostrar la carta
  if (!firstClickDone) {
    firstClickDone = true;
    setTimeout(() => {
      canShowLetter = true;
      showDedicationText();
    }, 6000);
    return; // No crear imagen en el primer click
  }
  
  // No permitir crear imágenes mientras la carta se está escribiendo
  if (canShowLetter && !letterFinished) {
    return;
  }
  
  // Array de todas las imágenes disponibles
  const images = [
    'marta1.png', 'marta2.png', 'marta3.png', 'marta4.png', 'marta5.png',
    'marta6.png', 'marta7.png', 'marta8.png', 'marta9.png', 'marta10.png',
    'marta11.png', 'marta12.png', 'marta13.png', 'marta14.png', 'marta15.png',
    'marta16.png', 'marta17.png', 'marta18.png', 'marta19.png', 'marta20.png',
    'marta21.png', 'marta22.png', 'marta23.png', 'marta24.png', 'marta25.png',
    'marta26.png', 'marta27.png', 'marta28.png', 'marta29.png', 'marta30.png'
  ];
  
  const img = document.createElement('img');
  // Seleccionar una imagen aleatoria
  const randomImage = images[Math.floor(Math.random() * images.length)];
  img.src = 'Img/' + randomImage;
  img.className = 'nebula-image';
  
  // Ajustar tamaño según si es móvil
  const isMobile = window.innerWidth <= 700;
  const imgWidth = isMobile ? 220 : 450;
  const imgHeight = isMobile ? 160 : 320;
  
  // Calcular posición y asegurar que no se salga de la pantalla
  let posX = e.clientX - imgWidth / 2;
  let posY = e.clientY - imgHeight / 2;
  
  // Limitar para que no se salga de los bordes
  posX = Math.max(0, Math.min(posX, window.innerWidth - imgWidth));
  posY = Math.max(0, Math.min(posY, window.innerHeight - imgHeight));
  
  // Posicionar en las coordenadas del click
  img.style.left = posX + 'px';
  img.style.top = posY + 'px';
  
  // Rotación aleatoria suave
  const rotation = (Math.random() - 0.5) * 20; // Entre -10 y 10 grados
  img.style.transform = `rotate(${rotation}deg)`;
  
  document.body.appendChild(img);
  
  setTimeout(() => {
    img.classList.add('visible');
  }, 50);
  
  setTimeout(() => {
    img.classList.remove('visible');
    setTimeout(() => {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    }, 500);
  }, 3000);
});

// Intentar reproducir la música lo antes posible (al cargar la página)
window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});
