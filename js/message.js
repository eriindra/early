// =======================
// LOREM IPSUM MESSAGES (DEMO)
// =======================
const messages = [
  {
    greeting: "Lorem Ipsum 🌟",
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
nisi ut aliquip ex ea commodo consequat.`,
    signature: "— Lorem Ipsum"
  },
  {
    greeting: "Dolor Sit Amet 🎂",
    text: `Duis aute irure dolor in reprehenderit in voluptate velit esse 
cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
officia deserunt mollit anim id est laborum.`,
    signature: "— Placeholder Text"
  },
  {
    greeting: "Consectetur 🎉",
    text: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
accusantium doloremque laudantium.

Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et 
quasi architecto beatae vitae dicta sunt explicabo.`,
    signature: "— Demo Content"
  }
];

// =======================
// STATE
// =======================
let currentMessageIndex = 0;
let isTyping = false;

// =======================
// DOM ELEMENTS
// =======================
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

// =======================
// TYPING EFFECT
// =======================
function typeText(element, text, speed = 40) {
  return new Promise((resolve) => {
    element.textContent = '';
    element.classList.add('typing-cursor');
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;

        const container = document.querySelector('.message-content');
        container.scrollTop = container.scrollHeight;
      } else {
        clearInterval(interval);
        element.classList.remove('typing-cursor');
        resolve();
      }
    }, speed);
  });
}

// =======================
// DISPLAY MESSAGE
// =======================
async function displayMessage(index) {
  if (isTyping) return;
  isTyping = true;

  const msg = messages[index];
  const content = document.querySelector('.message-content');

  greetingEl.textContent = '';
  messageTextEl.textContent = '';
  signatureEl.textContent = '';
  content.scrollTop = 0;

  typingIndicator.classList.add('active');
  await new Promise(r => setTimeout(r, 300));
  typingIndicator.classList.remove('active');

  await typeText(greetingEl, msg.greeting, 50);
  await new Promise(r => setTimeout(r, 150));
  await typeText(messageTextEl, msg.text, 25);
  await new Promise(r => setTimeout(r, 150));
  await typeText(signatureEl, msg.signature, 40);

  isTyping = false;
}

// =======================
// CONTROLS
// =======================
function updateControls() {
  pageCounter.textContent = `${currentMessageIndex + 1}/${messages.length}`;
  prevBtn.disabled = currentMessageIndex === 0;
  nextBtn.disabled = currentMessageIndex === messages.length - 1;
}

function previousMessage() {
  if (currentMessageIndex > 0 && !isTyping) {
    currentMessageIndex--;
    displayMessage(currentMessageIndex);
    updateControls();
  }
}

function nextMessage() {
  if (currentMessageIndex < messages.length - 1 && !isTyping) {
    currentMessageIndex++;
    displayMessage(currentMessageIndex);
    updateControls();
  }
}

// =======================
// BACK
// =======================
function backToMenu() {
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '0';
  setTimeout(() => {
    window.location.href = 'menu.html';
  }, 500);
}

// =======================
// EVENTS
// =======================
prevBtn.addEventListener('click', previousMessage);
nextBtn.addEventListener('click', nextMessage);
backBtn.addEventListener('click', backToMenu);
startBtn.addEventListener('click', backToMenu);

dpadLeft.addEventListener('click', previousMessage);
dpadRight.addEventListener('click', nextMessage);

document.addEventListener('keydown', (e) => {
  if (isTyping) return;

  switch (e.key) {
    case 'ArrowLeft': previousMessage(); break;
    case 'ArrowRight': nextMessage(); break;
    case 'Escape':
    case 'Backspace':
    case 'Enter':
      backToMenu();
      break;
  }
});

// =======================
// INIT
// =======================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);

  setTimeout(() => {
    displayMessage(currentMessageIndex);
    updateControls();
  }, 500);
});

console.log("📄 Lorem Ipsum Message Demo Loaded");
