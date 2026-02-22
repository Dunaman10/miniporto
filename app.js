// ===== Particle Background =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h;
  const particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.8 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;

      if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) {
        this.reset();
        // Spawn from edge
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { this.x = -5; this.y = Math.random() * h; }
        else if (side === 1) { this.x = w + 5; this.y = Math.random() * h; }
        else if (side === 2) { this.y = -5; this.x = Math.random() * w; }
        else { this.y = h + 5; this.x = Math.random() * w; }
      }
    }
    draw() {
      const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${Math.max(0, pulseOpacity)})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          const opacity = (1 - dist / 140) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
  }

  animate();
})();

// ===== Staggered Link Animations =====
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.link-item');
  links.forEach((link, index) => {
    setTimeout(() => {
      link.classList.add('visible');
    }, 600 + index * 120);
  });
});

// ===== Ripple Effect on Link Click =====
document.querySelectorAll('.link-item').forEach(link => {
  link.addEventListener('click', function (e) {
    // Create ripple
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 255, 136, 0.2);
      width: 10px;
      height: 10px;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out forwards;
      pointer-events: none;
    `;

    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleEffect {
    to { transform: scale(30); opacity: 0; }
  }
`;
document.head.appendChild(style);
