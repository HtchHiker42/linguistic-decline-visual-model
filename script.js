const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

const startBtn = document.getElementById('startBtn');
const mergeRateInput = document.getElementById('mergeRate');
const dieRateInput = document.getElementById('dieRate');
const newSpeakersInput = document.getElementById('newSpeakers');

const mergeVal = document.getElementById('mergeVal');
const dieVal = document.getElementById('dieVal');
const newVal = document.getElementById('newVal');

let speakers = [];
let animation;

class Speaker {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 6 + Math.random() * 4;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fill();
    }
}

function initSpeakers() {
    speakers = [];
    const colors = ['#ff0040', '#00ffcc']; // Language A & B
    for (let i = 0; i < 150; i++) {
        speakers.push(new Speaker(Math.random() * canvas.width, Math.random() * canvas.height, colors[Math.floor(Math.random() * 2)]));
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const mergeRate = mergeRateInput.value / 100;
    const dieRate = dieRateInput.value / 100;
    const newRate = newSpeakersInput.value / 100;

    speakers.forEach(s => {
        s.move();

        // Merge / influence
        speakers.forEach(other => {
            if (s === other) return;
            const dx = s.x - other.x;
            const dy = s.y - other.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 20 && Math.random() < mergeRate) {
                if (Math.random() < 0.5) s.color = other.color;
            }
        });

        // Possible death
        if (Math.random() < dieRate / 100) {
            const index = speakers.indexOf(s);
            if (index > -1) speakers.splice(index, 1);
        }

        s.draw();
    });

    // Add new speakers
    if (Math.random() < newRate) {
        const colors = ['#ff0040', '#00ffcc'];
        speakers.push(new Speaker(Math.random() * canvas.width, Math.random() * canvas.height, colors[Math.floor(Math.random()*2)]));
    }

    animation = requestAnimationFrame(update);
}

startBtn.addEventListener('click', () => {
    cancelAnimationFrame(animation);
    initSpeakers();
    update();
});

// Update the percentage text when sliders move
mergeRateInput.addEventListener('input', () => mergeVal.textContent = mergeRateInput.value);
dieRateInput.addEventListener('input', () => dieVal.textContent = dieRateInput.value);
newSpeakersInput.addEventListener('input', () => newVal.textContent = newSpeakersInput.value);

// Initialize
initSpeakers();
update();