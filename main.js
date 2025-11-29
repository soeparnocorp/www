const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let ripples = [];

class ElectricRipple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = Math.max(innerWidth, innerHeight) * 1.2;
    this.speed = 2.5;
    this.alpha = 1;
    this.thickness = 4;
    this.sparks = [];
    for(let i = 0; i < 30; i++) {
      this.sparks.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 80,
        speed: 1 + Math.random() * 3,
        life: 1
      });
    }
  }

  update() {
    this.radius += this.speed;
    this.alpha = 1 - (this.radius / this.maxRadius);
    this.thickness = 4 * this.alpha;
    
    this.sparks.forEach(s => {
      s.dist += s.speed;
      s.life -= 0.02;
    });
  }

  draw() {
    if (this.alpha <= 0) return;

    // Gelombang utama
    const gradient = ctx.createRadialGradient(this.x, this.y, this.radius - 50, this.x, this.y, this.radius);
    gradient.addColorStop(0, `hsla(200, 100%, 70%, ${this.alpha})`);
    gradient.addColorStop(0.7, `hsla(270, 100%, 60%, ${this.alpha * 0.6})`);
    gradient.addColorStop(1, 'transparent');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.thickness;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Percikan kecil
    this.sparks.forEach(s => {
      if (s.life <= 0) return;
      const sx = this.x + Math.cos(s.angle) * s.dist;
      const sy = this.y + Math.sin(s.angle) * s.dist;
      ctx.fillStyle = `hsla(190, 100%, 80%, ${s.life})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ripples = ripples.filter(r => r.alpha > 0.02);
  ripples.forEach(r => {
    r.update();
    r.draw();
  });

  requestAnimationFrame(animate);
}
animate();

document.body.addEventListener('pointerdown', e => {
  ripples.push(new ElectricRipple(e.clientX, e.clientY));
  
  // Efek getar halus
  document.body.style.transform = 'translate(4px, 4px)';
  setTimeout(() => document.body.style.transform = '', 100);
});

window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
