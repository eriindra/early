// Birthday messages collection
const messages = [
  {
    greeting: "Dear Birthday Star! 🌟",
    text: `Happy Birthday!

Wishing you a day filled with love, laughter, and endless joy. 

May this year bring you countless blessings and dreams come true.`,
    signature: "With love 💕"
  },
  {
    greeting: "To Someone Special! 🎂",
    text: `Another year older, another year wiser!

May your birthday be as wonderful as you are. Keep shining bright.

Here's to making unforgettable memories!`,
    signature: "Cheers! 🥳"
  },
  {
    greeting: "Happy Birthday! 🎉",
    text: `On your special day:
- Endless smiles 😊
- Warm hugs 🤗
- Sweet surprises 🎁
- Beautiful moments 💖

May all your wishes come true!`,
    signature: "Enjoy! 🎈"
  }
];

// Current state
let currentMessageIndex = 0;
let isTyping = false;

// DOM Elements
const greetingEl = document.getElementById('greeting');
const messageTextEl = document.getElementById('message-text');
const signatureEl = document.getElementById('signature');
const typingIndicator = document.getElementById('typing-indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const startBtn = document.getElementById('start-btn');
const pageCounter = document.getElementById('page-counter');
const dpadLeft = document.getElementById('dpad-left');
const dpadRight = document.getElementById('dpad-right');

// Typing animation function with auto-scroll
function typeText(element, text, speed = 40) {
  return new Promise((resolve) => {
    element.textContent = '';
    element.classList.add('typing-cursor');
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        
        // Auto-scroll to bottom as text appears
        const messageContent = document.querySelector('.message-content');
        messageContent.scrollTop = messageContent.scrollHeight;
      } else {
        clearInterval(interval);
        element.classList.remove('typing-cursor');
        resolve();
      }
    }, speed);
  });
}

// Display message with typing animation
async function displayMessage(index) {
  if (isTyping) return;
  
  isTyping = true;
  const message = messages[index];
  const messageContent = document.querySelector('.message-content');
  
  // Clear previous content
  greetingEl.textContent = '';
  messageTextEl.textContent = '';
  signatureEl.textContent = '';
  
  // Reset scroll to top
  messageContent.scrollTop = 0;
  
  // Show typing indicator
  typingIndicator.classList.add('active');
  
  // Wait a bit before starting
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Hide typing indicator
  typingIndicator.classList.remove('active');
  
  // Type greeting
  await typeText(greetingEl, message.greeting, 50);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Type main message
  await typeText(messageTextEl, message.text, 25);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Type signature
  await typeText(signatureEl, message.signature, 40);
  
  isTyping = false;
}

// Update page counter and buttons
function updateControls() {
  pageCounter.textContent = `${currentMessageIndex + 1}/${messages.length}`;
  
  // Update button states
  prevBtn.disabled = currentMessageIndex === 0;
  nextBtn.disabled = currentMessageIndex === messages.length - 1;
}

// Navigate to previous message
function previousMessage() {
  if (currentMessageIndex > 0 && !isTyping) {
    currentMessageIndex--;
    displayMessage(currentMessageIndex);
    updateControls();
  }
}

// Navigate to next message
function nextMessage() {
  if (currentMessageIndex < messages.length - 1 && !isTyping) {
    currentMessageIndex++;
    displayMessage(currentMessageIndex);
    updateControls();
  }
}

// Back to menu
function backToMenu() {
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '0';

  fadeOutMusic(() => {
    setTimeout(() => {
      window.location.href = 'menu.html';
    }, 200);
  });
}



// Event Listeners
prevBtn.addEventListener('click', previousMessage);
nextBtn.addEventListener('click', nextMessage);
backBtn.addEventListener('click', backToMenu);
startBtn.addEventListener('click', backToMenu);

// D-pad navigation
dpadLeft.addEventListener('click', previousMessage);
dpadRight.addEventListener('click', nextMessage);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (isTyping) return;
  
  switch(e.key) {
    case 'ArrowLeft':
      previousMessage();
      break;
    case 'ArrowRight':
      nextMessage();
      break;
    case 'Escape':
    case 'Backspace':
      backToMenu();
      break;
    case 'Enter':
      backToMenu();
      break;
  }
});

// Initialize
window.addEventListener('load', () => {
  // Fade in effect
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  // Display first message
  setTimeout(() => {
    displayMessage(currentMessageIndex);
    updateControls();
  }, 500);
  fadeInMusic();
});

const messageMusic = document.getElementById('messageMusic');

const MAX_VOLUME = 0.3;
const START_TIME = 15;       // mulai dari detik ke-15
const FADE_DURATION = 3000;  // 3 detik fade (halus)

messageMusic.volume = 0;

let musicFadeFrame;


function fadeInMusic() {
  cancelAnimationFrame(musicFadeFrame);
  messageMusic.volume = 0;

  const startPlay = () => {
    messageMusic.currentTime = START_TIME;
    messageMusic.play().catch(() => {});
  };

  if (messageMusic.readyState >= 1) {
    startPlay();
  } else {
    messageMusic.addEventListener('loadedmetadata', startPlay, { once: true });
  }

  const start = performance.now();

  function fade(now) {
    const progress = Math.min((now - start) / FADE_DURATION, 1);
    const eased = progress * progress; // ease-in

    messageMusic.volume = eased * MAX_VOLUME;

    if (progress < 1) {
      musicFadeFrame = requestAnimationFrame(fade);
    }
  }

  musicFadeFrame = requestAnimationFrame(fade);
}

function fadeOutMusic(callback) {
  cancelAnimationFrame(musicFadeFrame);

  // 🔒 Kalau musik belum jalan / volume sudah 0
  if (messageMusic.paused || messageMusic.volume === 0) {
    messageMusic.pause();
    messageMusic.currentTime = 0;
    if (callback) callback();
    return;
  }

  const startVolume = messageMusic.volume;
  const start = performance.now();
  const FADE_OUT_DURATION = 1500;

  function fade(now) {
    const progress = Math.min((now - start) / FADE_OUT_DURATION, 1);
    const eased = 1 - progress * progress;

    messageMusic.volume = startVolume * eased;

    if (progress < 1) {
      musicFadeFrame = requestAnimationFrame(fade);
    } else {
      messageMusic.volume = 0;
      messageMusic.pause();
      messageMusic.currentTime = 0;
      if (callback) callback(); // ✅ PASTI DIPANGGIL
    }
  }

  musicFadeFrame = requestAnimationFrame(fade);
}


// Console log
console.log('💌 Message Console Loaded');
console.log('Total messages:', messages.length);
console.log('Controls: ◀/▶ buttons, D-pad, Arrow keys');
console.log('Back: B button, START, ESC, or Backspace');