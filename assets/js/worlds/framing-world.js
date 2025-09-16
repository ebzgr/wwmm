// Framing World Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-out',
            once: true,
            offset: 50
        });
    }
    
    // Load footer component
    fetch('../../components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.log('Footer component not found, using fallback');
        });

    // Framing Lab interactions (prototype)
    try {
        setupFramingChoice();
        setupAnchoringExperiment();
        setupButtonRipples();
        nudgeAttention();
        setupRevealFade();
    } catch (e) {
        console.warn('Framing Lab setup skipped:', e);
    }
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Reveal slider logic
function setupRevealFade() {
    const wraps = document.querySelectorAll('.reveal-wrap');
    
    wraps.forEach((wrap, index) => {
        if (!wrap) return;

        // No automatic animation - user must click to start

        // Allow user to toggle back to first image and restart animation
        wrap.addEventListener('click', () => {
            const topImg = wrap.querySelector('.reveal-img.top');
            const bottomImg = wrap.querySelector('.reveal-img.bottom');
            
            if (wrap.classList.contains('reveal-animate')) {
                // Animation is running - stop it and reset to first image
                wrap.classList.remove('reveal-animate');
                
            // Hide the message
            const message = wrap.querySelector('.reveal-message');
            if (message) {
                message.classList.remove('show');
            }
                
                // Reset both images to their initial state
                if (topImg) {
                    topImg.style.animation = 'none';
                    topImg.style.transform = 'perspective(1200px) rotateY(0deg)';
                    topImg.style.opacity = '1';
                }
                if (bottomImg) {
                    bottomImg.style.animation = 'none';
                    bottomImg.style.transform = 'perspective(1200px) rotateY(180deg)';
                    bottomImg.style.opacity = '0';
                }
            } else {
                // No animation running - start the reveal animation
                // Reset any inline styles first
                if (topImg) {
                    topImg.style.animation = '';
                    topImg.style.transform = '';
                    topImg.style.opacity = '';
                }
                if (bottomImg) {
                    bottomImg.style.animation = '';
                    bottomImg.style.transform = '';
                    bottomImg.style.opacity = '';
                }
                
                // Force reflow to ensure clean restart
                // eslint-disable-next-line no-unused-expressions
                wrap.offsetHeight;
                
                // Start the animation
                wrap.classList.add('reveal-animate');
                
                // Show message when second image is fully visible (around 2.5s into the 3s animation)
                const message = wrap.querySelector('.reveal-message');
                if (message) {
                    setTimeout(() => {
                        message.classList.add('show');
                    }, 2500);
                }
            }
        });
    });
}

// Microinteraction: click ripple on primary lab buttons
function setupButtonRipples() {
    const buttons = document.querySelectorAll('.choice-btn, .rate-btn, .toggle-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    });
}

// Periodic attention nudge on CTAs
function nudgeAttention() {
    const targets = document.querySelectorAll('#lab-framing .choice-btn, #lab-anchoring .rate-btn');
    if (targets.length === 0) return;
    setInterval(() => {
        targets.forEach((el, idx) => {
            setTimeout(() => {
                el.classList.add('attention');
                setTimeout(() => el.classList.remove('attention'), 900);
            }, idx * 120);
        });
    }, 5000);
}

// Experiment 1: Positive vs Negative framing
function setupFramingChoice() {
    const result = document.getElementById('framing-result');
    const overlay = document.getElementById('lab-overlay');
    const overlayMsg = document.getElementById('lab-overlay-message');
    const buttons = document.querySelectorAll('.choice-btn');
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.getAttribute('data-choice');
            const picked = choice === 'positive' ? 'Positive frame (80% fat-free)' : 'Negative frame (20% fat)';
            if (result) {
                result.textContent = `You preferred: ${picked}. Same fact, different feelings.`;
                result.classList.add('show');
            }

            // Big central dynamic overlay
            if (overlay && overlayMsg) {
                const detail = choice === 'positive'
                    ? 'Positive framing makes the exact same information feel safer and more appealing.'
                    : 'Negative framing makes the exact same information feel riskier and less appealing.';
                const headline = choice === 'positive'
                    ? '<span class="manipulated">You were manipulated.</span>'
                    : '<span class="praise">Good job! You are better than marketing.</span>';
                overlayMsg.innerHTML = `${headline}<span class="explain">Framing effect: ${detail} Both labels describe the same yoghurt (80% fat-free = 20% fat). Your judgment changed because the wording guided your attention and emotion, not because the facts changed.</span>`;
                overlay.classList.add('show');
                overlay.setAttribute('aria-hidden', 'false');

                // Auto-hide after ~4.5s
                clearTimeout(window.__labOverlayTimeout);
                window.__labOverlayTimeout = setTimeout(() => {
                    overlay.classList.remove('show');
                    overlay.setAttribute('aria-hidden', 'true');
                }, 4500);
            }

            // Track event (if system available)
            if (window.EventSystem) {
                window.EventSystem.trackEvent('framing_choice', { choice });
            }
        });
    });
}

// Experiment 2: Anchoring
function setupAnchoringExperiment() {
    const anchorValue = document.getElementById('anchor-value');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const rateBtns = document.querySelectorAll('.rate-btn');
    const result = document.getElementById('anchor-result');
    const overlay = document.getElementById('lab-overlay');
    const overlayMsg = document.getElementById('lab-overlay-message');
    if (!anchorValue || rateBtns.length === 0) return;

    let currentAnchor = 199; // fixed high anchor

    rateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rating = parseInt(btn.getAttribute('data-rating'), 10);
            // Simple text feedback that varies with anchor level
            const feel = currentAnchor >= 150 ? ['still pricey', 'reasonable', 'amazing'][rating - 1] : ['meh', 'pretty good', 'nice'][rating - 1];
            if (result) {
                result.textContent = `With anchor at €${currentAnchor}, €99 feels ${feel} to you.`;
                result.classList.add('show');
            }

            if (window.EventSystem) {
                window.EventSystem.trackEvent('anchor_rate', { anchor: currentAnchor, rating });
            }

            // Big central dynamic overlay (happy style, same as section 1)
            if (overlay && overlayMsg) {
                const headline = rating === 3
                    ? '<span class="manipulated">You were manipulated.</span>'
                    : '<span class="praise">Good job! You are better than marketing.</span>';
                
                const explanation = rating === 3
                    ? 'Anchoring effect: The €199 reference price made €99 seem like a great deal. The initial anchor influenced your judgment, even though it was irrelevant to the actual value.'
                    : 'You successfully avoided the anchoring bias! Despite seeing €199 first, you evaluated €99 on its own merits rather than being influenced by the initial high price anchor.';
                
                overlayMsg.innerHTML = `${headline}<span class=\"explain\">${explanation}</span>`;
                overlay.classList.add('show');
                overlay.setAttribute('aria-hidden', 'false');

                clearTimeout(window.__labOverlayTimeout);
                window.__labOverlayTimeout = setTimeout(() => {
                    overlay.classList.remove('show');
                    overlay.setAttribute('aria-hidden', 'true');
                }, 4500);
            }
        });
    });
}