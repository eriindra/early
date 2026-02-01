// =======================
// PLAYLIST (OFFLINE)
// =======================
const playlist = [
    {
    title: "Kata",
    artist: "Rizky Febian",
    src: "music/kata.mp3"
  },
  {
    title: "Anything 4 u",
    artist: "Lany",
    src: "music/anything4u.mp3"
  },
  {
    title: "Stuck",
    artist: "Lany",
    src: "music/Stuck.mp3"
  },
  {
    title: "Out Of My Leauge",
    artist: "LANY",
    src: "music/Out Of My League.mp3"
  },
  {
    title: "Super Far",
    artist: "Lany",
    src: "music/SuperFar.mp3"
  },
  {
    title: "Daisy",
    artist: "Wave To Earth",
    src: "music/daisy.mp3"
  },
  {
    title: "I Pray",
    artist: "Lany",
    src: "music/I Pray.mp3"
  },
  {
    title: "Love",
    artist: "Wave To Earth",
    src: "music/love.mp3"
  },
];

// =======================
// STATE
// =======================
let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

// =======================
// DOM ELEMENTS
// =======================
const trackCounter = document.getElementById('track-counter');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const progressFill = document.getElementById('progress-fill');
const progressBar = document.querySelector('.progress-bar');
const vinylRecord = document.querySelector('.vinyl-record');
const visualizer = document.getElementById('visualizer');

const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const startBtn = document.getElementById('start-btn');
const playPauseBtn = document.getElementById('play-pause-btn');

const dpadUp = document.getElementById('dpad-up');
const dpadDown = document.getElementById('dpad-down');
const dpadLeft = document.getElementById('dpad-left');
const dpadRight = document.getElementById('dpad-right');

// =======================
// INIT
// =======================
loadTrack(currentTrackIndex);

// =======================
// FUNCTIONS
// =======================
function loadTrack(index) {
  const track = playlist[index];

  audio.src = track.src;
  audio.load();

  trackCounter.textContent = `${index + 1}/${playlist.length}`;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;

  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent = "0:00";
  progressFill.style.width = "0%";

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === playlist.length - 1;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function startPlayback() {
  isPlaying = true;
  audio.play();
  audio.volume = 0.3; // suara jadi pelan

  playBtn.innerHTML = "⏸ PAUSE";
  vinylRecord.classList.add('playing');
  visualizer.classList.add('active');
}

function pausePlayback() {
  isPlaying = false;
  audio.pause();

  playBtn.innerHTML = "▶ PLAY";
  vinylRecord.classList.remove('playing');
  visualizer.classList.remove('active');
}

function togglePlayPause() {
  isPlaying ? pausePlayback() : startPlayback();
}

function nextTrack() {
  if (currentTrackIndex < playlist.length - 1) {
    currentTrackIndex++;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
  }
}

function prevTrack() {
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
  }
}

function backToMenu() {
  pausePlayback();
  document.body.style.transition = "opacity 0.5s";
  document.body.style.opacity = "0";
  setTimeout(() => {
    window.location.href = "menu.html";
    console.log("Back to menu");
    document.body.style.opacity = "1";
  }, 500);
}

// =======================
// AUDIO EVENTS
// =======================
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);

  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${percent}%`;
});

audio.addEventListener('ended', nextTrack);

// =======================
// SEEK BAR
// =======================
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  audio.currentTime = (clickX / rect.width) * audio.duration;
});

// =======================
// CONTROLS
// =======================
playBtn.addEventListener('click', togglePlayPause);
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
backBtn.addEventListener('click', backToMenu);
startBtn.addEventListener('click', backToMenu);

dpadLeft.addEventListener('click', prevTrack);
dpadRight.addEventListener('click', nextTrack);

dpadUp.addEventListener('click', () => audio.volume = Math.min(1, audio.volume + 0.1));
dpadDown.addEventListener('click', () => audio.volume = Math.max(0, audio.volume - 0.1));

// =======================
// KEYBOARD
// =======================
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft': prevTrack(); break;
    case 'ArrowRight': nextTrack(); break;
    case ' ': 
    case 'Enter':
      e.preventDefault();
      togglePlayPause();
      break;
    case 'Escape':
    case 'Backspace':
      backToMenu();
      break;
  }
});

// =======================
// FADE IN
// =======================
window.addEventListener('load', () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s";
    document.body.style.opacity = "1";
  }, 100);
});

console.log("🎵 Offline Music Player Ready");
