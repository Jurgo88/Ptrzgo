import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const textContainer = document.querySelector('.horizontal-scroll');
    const textContent = document.querySelector('.horizontal-text');
    const extraBubbleContainer = document.querySelectorAll('.extra-bubble');
    const lastWord = document.querySelector('.last');
    
    if (textContainer && textContent && extraBubbleContainer) {
        const wordElements = document.querySelectorAll('.word');
        const bubbleElements = document.querySelectorAll('.bubble');
        const wordsWithoutBubble = Array.from(wordElements).filter(word => !word.classList.contains('bubble'));

        console.log(wordsWithoutBubble);

        gsap.set(wordElements, { opacity: 0 });
        gsap.set(bubbleElements, { opacity: 0, scale: 0.5, y: 50 });
        gsap.set(extraBubbleContainer, { opacity: 0, scale: 0.5, y: 50 });

        // Hlavná animácia scrollovania
        gsap.to(textContent, {
            x: -(textContent.scrollWidth - textContainer.clientWidth),
            ease: 'none',
            scrollTrigger: {
                trigger: textContainer,
                start: 'top top',
                end: `+=${textContent.scrollWidth}`,
                scrub: 1.5,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const progress = self.progress * wordElements.length;
                    
                    wordElements.forEach((word, index) => {
                        // Nastavovanie opacity pre všetky prvky
                        gsap.to(word, { opacity: index <= progress ? 1 : 0, duration: 3.3 });
                    
                        // Animácia X posunu iba pre prvky, ktoré nemajú triedu "bubble"
                        if (!word.classList.contains("bubble")) {
                            gsap.to(word, { x: index <= progress ? 0 : 200, duration: 1.3 });
                        }
                    });
                    

                    // wordsWithoutBubble.forEach((word, index) => {
                    //     console.log("index", index, "progress", progress);
                    //     // gsap.to(word, { scale: index === progress ? 1.5 : 1, duration: 1.3 });
                    //     gsap.to(word, { x: index <= progress ? 0 : 300, duration: 1.3 });
                    //     gsap.to(word, { scale: 3, duration: 1.3 });
                    // });

                    bubbleElements.forEach((bubble, index) => {
                        gsap.to(bubble, { 
                            opacity: index <= progress ? 1 : 0, 
                            scale: index <= progress ? 1 : 2.4, 
                            y: index <= progress ? 0 : 50, 
                            duration: 1.5, 
                            ease: 'back.out(1.7)' 
                        });
                    });

                    // Zväčšenie posledného slova a zobrazenie extra-bubbly
                    if (lastWord) {
                        const lastWordIndex = wordElements.length - 1;
                       
                        if (progress >= lastWordIndex) {
                            const scale = 1 + (progress - lastWordIndex) * 1.5; // Opravené zväčšovanie
                            gsap.to(lastWord, { scale: scale,  duration: 0.6 });
                            gsap.to(lastWord, { scaleY: scale * 1.5, duration: 5 });
                            gsap.to(lastWord, { x: 300, duration: 2.6 });
                            // gsap.to(lastWord, { y: progress * 10, duration: 2.6, delay: 1.6 });

                    
                        } else {
                            gsap.to(lastWord, { scale: 1, duration: 0.6 });
                            gsap.to(lastWord, { x: 0, duration: 0.6 });
                            // gsap.to(lastWord, { y: 0, duration: 0.6 });

                            // Skrytie extra-bubbles pri návrate na predchádzajúcu pozíciu
                            gsap.to(extraBubbleContainer, { opacity: 0, scale: 0.5, y: 50, duration: 0.8 });
                        }
                    }

                    if (progress >= wordElements.length - 1) {
                      console.log("posledné slovo");
                      console.log(progress, wordElements.length - 1);
                        const otherWords = Array.from(wordElements).filter(word => word !== lastWord);
                        gsap.to(otherWords, { opacity: 0, scale: 0, duration: 3.6, delay: 1.5 }); // Skrytie všetkých slov
                                // Animácia pre extra-bubbles pri nabehnutí na posledné slovo
                                console.log("lietajúce bubliny");
                                extraBubbleContainer.forEach((bubble, index) => {
                                    gsap.to(bubble, {
                                        opacity: 1,
                                        scale: 2,
                                        y:  (Math.random() -0.5) * window.innerHeight , // Variabilita v Y pozícii
                                        x: (Math.random() -0.5 )* window.innerWidth, //Random  Variabilita v X pozícii
                                        duration: 1.5,
                                        delay: index * 1.2, // Postupné zobrazenie
                                        ease: 'back.out(1.7)',
                                    });
                                });
                                return;
                        
                    } else {
                        gsap.to(wordElements, { scale: 1, duration: 0.6 }); // Vrátenie na pôvodnú veľkosť
                    }
                },
            },
        });
    }
});
