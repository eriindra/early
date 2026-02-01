// Create floating particles for background effect
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  
  // Check if container exists
  if (!particlesContainer) {
    console.warn('Particles container not found');
    return;
  }
  
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random horizontal position
    particle.style.left = Math.random() * 100 + '%';
    
    // Random animation delay for staggered effect
    particle.style.animationDelay = Math.random() * 15 + 's';
    
    // Random animation duration for variety
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    particlesContainer.appendChild(particle);
  }
}

// Start game function - redirects to main console
function startGame() {
  console.log('🎮 Start button clicked!');
  
  const btn = event.target;
  
  // Add click effect to button
  btn.style.transform = 'scale(0.95) translateY(4px)';
  
  // Fade out entire page
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '0';
  
  // Redirect to main console page after fade animation
  setTimeout(() => {
    console.log('🚀 Redirecting to menu.html...');
    window.location.href = 'menu.html';
  }, 500);
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Start page loaded');

  // Get start button - try different selectors
  const startButton = document.getElementById('start-button') || 
                      document.querySelector('.start-btn') ||
                      document.querySelector('button');
  
  if (startButton) {
    console.log('✅ Start button found:', startButton);
    
    // Add click event to start button
    startButton.addEventListener('click', startGame);
  } else {
    console.error('❌ Start button not found!');
  }

  // Keyboard support for better accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (startButton) {
        startButton.click();
      }
    }
  });

  // Page load animation - fade in effect
  document.body.style.opacity = '0';
  
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);

  // Initialize particles when page loads
  createParticles();

  // Console log for debugging
  console.log('🎮 Console Start Screen Ready!');
  console.log('Press Enter or Space to start!');
});