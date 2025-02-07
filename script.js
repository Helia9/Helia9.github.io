const canvas = document.getElementById('constellation');
const ctx = canvas.getContext('2d');


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let mouse = {
    x: undefined,
    y: undefined,
    radius: 150
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 0.2 - 0.1;
        this.vy = Math.random() * 0.2 - 0.1;
        this.radius = Math.random() * 1.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }
}

const particles = Array.from({ length: 100 }, () => new Particle());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    particles.forEach(particle => {
        particle.update();
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            ctx.beginPath();
            ctx.strokeStyle = isDarkMode ? 
                `rgba(255, 255, 255, ${0.1 * (1 - distance/mouse.radius)})` : 
                `rgba(0, 0, 0, ${0.1 * (1 - distance/mouse.radius)})`;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        particles.forEach(otherParticle => {
            const dx2 = particle.x - otherParticle.x;
            const dy2 = particle.y - otherParticle.y;
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            
            if (distance2 < 100) {
                ctx.beginPath();
                ctx.strokeStyle = isDarkMode ? 
                    `rgba(255, 255, 255, ${0.1 * (1 - distance2/100)})` : 
                    `rgba(0, 0, 0, ${0.1 * (1 - distance2/100)})`;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animate);
}

animate();

const translations = {
    en: {
        title: "test website",
        about: "About Me",
        aboutText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        projects: "Projects",
        project1: "Project 1",
        project1Desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        project2: "Project 2",
        project2Desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        contact: "Contact",
        contactText: "Email: lorem.ipsum@example.com",
        resume: "📄 CV",
        downloadResume: "Download Resume"
    },
    fr: {
        title: "site web de test",
        about: "À propos de moi",
        aboutText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        projects: "Projets",
        project1: "Projet 1",
        project1Desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        project2: "Projet 2",
        project2Desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        contact: "Contact",
        contactText: "Email: lorem.ipsum@example.com",
        resume: "📄 CV",
        downloadResume: "Télécharger le CV"
    }
};

function isMobile() {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobileDevice;
}

const themeToggle = document.getElementById("theme-toggle");
const langToggle = document.getElementById("lang-toggle");
let currentLang = "fr";

// Set initial state
document.addEventListener('DOMContentLoaded', () => {
    langToggle.checked = false; // French is unchecked state
    updateContent();
});

document.body.classList.add("dark-mode");
themeToggle.checked = false;

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

langToggle.addEventListener("change", () => {
    currentLang = langToggle.checked ? "en" : "fr"; // Fixed logic - unchecked is French
    updateContent();
});

function updateContent() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t[key];
    });
}

const modal = document.getElementById("resume-modal");
const resumeBtn = document.getElementById("resume-btn");
const closeBtn = document.getElementsByClassName("close")[0];
const resumePreview = document.getElementById("resume-preview");
const downloadBtn = document.getElementById("download-resume");

resumeBtn.onclick = function() {
    const isMobileDevice = isMobile();
    const fileFormat = isMobileDevice ? "png" : "pdf";
    
    modal.style.display = "block";
    resumePreview.src = `assets/resume_${currentLang}.${fileFormat}#toolbar=0&navpanes=0&scrollbar=1`;
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

downloadBtn.onclick = function() {
    const isMobileDevice = isMobile();
    const fileFormat = isMobileDevice ? "png" : "pdf";
    window.open(`assets/resume_${currentLang}.${fileFormat}`, '_blank');
}