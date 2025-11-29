const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let flows = [];
let particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.size = Math.random()*2;
    this.speed = 0.5 + Math.random();
    this.angle = Math.random()*Math.PI*2;
  }
  update() {
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed;
    if (this.x<0 || this.x>canvas.width || this.y<0 || this.y>canvas.height) this.reset();
  }
  draw() {
    ctx.fillStyle = 'rgba(0,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
  }
}

for(let i=0;i<80;i++) particles.push(new Particle());

class Flow {
  constructor(x,y,targetElement) {
    this.x = x; this.y = y;
    this.target = targetElement.getBoundingClientRect();
    this.points = [];
    this.progress = 0;
    this.speed = 0.008;
    this.glow = 1;
  }
  update() {
    this.progress += this.speed;
    if (this.progress > 1) this.glow -= 0.02;
  }
  draw() {
    if (this.glow <= 0) return;
    const centerX = this.target.left + this.target.width/2 + window.scrollX;
    const centerY = this.target.top + this.target.height/2 + window.scrollY;
    const dx = centerX - this.x;
    const dy = centerY - this.y;
    const eased = 1 - Math.pow(1 - this.progress, 3);
    const currentX = this.x + dx * eased;
    const currentY = this.y + dy * eased;

    ctx.strokeStyle = `hsla(180,100%,50%,${this.glow})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // glow di ujung
    ctx.fillStyle = `hsla(180,100%,70%,${this.glow})`;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6*this.glow, 0, Math.PI*2);
    ctx.fill();
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  particles.forEach(p => { p.update(); p.draw(); });
  flows = flows.filter(f => f.glow > 0);
  flows.forEach(f => { f.update(); f.draw(); });

  requestAnimationFrame(animate);
}
animate();

document.body.addEventListener('click', e => {
  document.querySelectorAll('h1,h2,p,.btn,.versions div,footer').forEach(el => {
    flows.push(new Flow(e.clientX, e.clientY, el));
  });
});

window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
