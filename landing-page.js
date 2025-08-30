// js/landing-page.js (VERSÃO COMPLETA PARA SUBSTITUIR)

document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO CARROSSEL E FAQ ---
    const carouselContainer = document.querySelector('.carousel-container');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    if (carouselContainer) {
        const cardWidth = carouselContainer.querySelector('.design-card').offsetWidth;
        nextButton.addEventListener('click', () => {
            carouselContainer.scrollLeft += cardWidth + 24;
        });
        prevButton.addEventListener('click', () => {
            carouselContainer.scrollLeft -= cardWidth + 24;
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // --- LÓGICA DE ANIMAÇÕES AVANÇADAS COM GSAP ---
    gsap.registerPlugin(ScrollTrigger);
    const heroTitle = new SplitType('.hero-content h1', { types: 'chars' });
    gsap.from(heroTitle.chars, {
        duration: 1, opacity: 0, y: 50, rotateX: -90, stagger: 0.03, ease: "power2.out", delay: 0.5
    });

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        document.addEventListener('mousemove', (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5);
            const yPercent = (e.clientY / window.innerHeight - 0.5);
            gsap.to(heroImage, {
                duration: 0.5, x: xPercent * 30, y: yPercent * 30, ease: 'power1.out'
            });
        });
    }

    gsap.utils.toArray('.fade-in-section').forEach(section => {
        gsap.from(section, {
            opacity: 0, y: 70, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
                trigger: section, start: "top 85%", toggleActions: "play none none none"
            }
        });
    });

    gsap.from(".feature-item", {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
            trigger: ".features-grid", start: "top 80%"
        }
    });

    // --- NOVA LÓGICA: CABEÇALHO INTELIGENTE (SHOW/HIDE ON SCROLL) ---
    const header = document.querySelector('.floating-header');
    let lastScrollY = window.scrollY; 

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (header) { // Garante que o header existe
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                // Rolando para BAIXO
                header.classList.add('is-hidden');
            } else {
                // Rolando para CIMA
                header.classList.remove('is-hidden');
            }
        }
        
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY; // Evita valores negativos em alguns browsers
    });
});