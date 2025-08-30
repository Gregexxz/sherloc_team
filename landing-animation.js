// js/landing-animation.js

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Seleciona todos os painéis
    const textPanels = gsap.utils.toArray('.text-panel');
    const visualPanels = gsap.utils.toArray('.visual-panel');

    // Cria a timeline principal de animação
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#pin-container",
            pin: true,          // "Pina" a seção na tela
            scrub: 1,           // Suaviza a animação com o scroll
            start: "top top",
            end: "+=3000",      // Duração do scroll para a animação
        }
    });

    // Inicia a animação: Mostra o primeiro painel
    timeline.to(textPanels[0], { opacity: 1, duration: 0.5 });
    timeline.to(visualPanels[0], { opacity: 1, duration: 0.5 }, "<"); // "<" faz começar junto com a animação anterior

    // Transição para o segundo painel
    timeline.to(textPanels[0], { opacity: 0, duration: 0.5 }, "+=1"); // "+=1" espera 1 "segundo" de scroll
    timeline.to(visualPanels[0], { opacity: 0, duration: 0.5 }, "<");
    timeline.to(textPanels[1], { opacity: 1, duration: 0.5 });
    timeline.to(visualPanels[1], { opacity: 1, duration: 0.5 }, "<");

    // Transição para o terceiro painel
    timeline.to(textPanels[1], { opacity: 0, duration: 0.5 }, "+=1");
    timeline.to(visualPanels[1], { opacity: 0, duration: 0.5 }, "<");
    timeline.to(textPanels[2], { opacity: 1, duration: 0.5 });
    timeline.to(visualPanels[2], { opacity: 1, duration: 0.5 }, "<");
});