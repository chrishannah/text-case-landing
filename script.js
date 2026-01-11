// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or system preference
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme
function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme
setTheme(getPreferredTheme());

// Toggle theme on button click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.getElementById('header')?.offsetHeight || 72;
            const targetPosition = targetElement.offsetTop - headerHeight - 24;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Format Tabs =====
const formatTabs = document.querySelectorAll('.format-tab');
const formatPanels = document.querySelectorAll('.format-panel');

formatTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Update active tab
        formatTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active panel
        formatPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `panel-${targetTab}`) {
                panel.classList.add('active');
            }
        });
    });
});

// ===== Intersection Observer for Scroll Animations =====
const animateElements = document.querySelectorAll(
    '.feature-card, .step, .format-category, .platform-item, .trust-badge, .section-header'
);

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach((el, index) => {
    el.classList.add('animate-on-scroll');
    el.style.transitionDelay = `${index * 0.05}s`;
    observer.observe(el);
});

// ===== Header Scroll Effect =====
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

function handleHeaderScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll();

// ===== Stats Counter Animation =====
const statValues = document.querySelectorAll('.stat-value');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent;
            const match = text.match(/(\d+)/);

            if (match) {
                const finalValue = parseInt(match[1]);
                const suffix = text.replace(match[1], '');
                animateCounter(target, finalValue, suffix);
            }

            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = Math.ceil(target / 30);
    const duration = 1000;
    const stepTime = duration / 30;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = current + suffix;
        }
    }, stepTime);
}

statValues.forEach(stat => {
    // Skip elements marked with data-no-animate (like prices)
    if (!stat.hasAttribute('data-no-animate')) {
        statsObserver.observe(stat);
    }
});

// ===== Floating Cards Parallax (Desktop Only) =====
if (window.innerWidth > 1024) {
    const floatingCards = document.querySelectorAll('.floating-card');

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 10;
            const x = mouseX * speed;
            const y = mouseY * speed;
            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===== Prefers Reduced Motion =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition', '0s');
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');

    // Remove scroll animations
    animateElements.forEach(el => {
        el.classList.remove('animate-on-scroll');
        el.classList.add('visible');
    });
}

// ===== Dynamic Year in Footer =====
const yearElements = document.querySelectorAll('.footer-bottom p');
yearElements.forEach(el => {
    const currentYear = new Date().getFullYear();
    el.innerHTML = el.innerHTML.replace(/\d{4}/, currentYear);
});

// ===== Feature Card Hover Effect =====
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===== Format Chip Interactive Demo =====
const formatChips = document.querySelectorAll('.format-chip');

formatChips.forEach(chip => {
    chip.addEventListener('click', function() {
        // Add a brief "clicked" animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// ===== Keyboard Navigation Support =====
document.addEventListener('keydown', (e) => {
    // Tab navigation for format tabs
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeTab = document.querySelector('.format-tab.active');
        if (activeTab && document.activeElement === activeTab) {
            const tabs = Array.from(formatTabs);
            const currentIndex = tabs.indexOf(activeTab);
            let newIndex;

            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % tabs.length;
            } else {
                newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }

            tabs[newIndex].focus();
            tabs[newIndex].click();
        }
    }
});

// ===== Console Easter Egg =====
console.log(
    '%c Text Case ',
    'background: linear-gradient(135deg, #D80D04, #FF4136); color: white; font-size: 24px; padding: 10px 20px; border-radius: 8px; font-weight: bold;'
);
console.log(
    '%c Transform your text instantly with 100+ formats ',
    'color: #6E6E73; font-size: 14px;'
);
console.log('%c https://textcase.app ', 'color: #D80D04; font-size: 12px;');

// ===== Image Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const screenImages = document.querySelectorAll('.screen-image');

screenImages.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});
