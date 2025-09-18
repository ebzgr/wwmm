// Gamification World Script
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

    // Dopamine Meter Logic
    const meter = document.querySelector('.dopamine-meter');
    const bar = document.querySelector('.dopamine-bar');
    const percentage = document.querySelector('.dopamine-percentage');
    const buttons = document.querySelectorAll('.push-btn');
    let dopamine = 0; // 0-100

    function setDopamine(value) {
        dopamine = Math.max(0, Math.min(100, value));
        if (bar) {
            bar.style.width = dopamine + '%';
            // emphasize glow as it fills
            const glowStrength = Math.min(1, dopamine / 100);
            bar.style.filter = `brightness(${1 + glowStrength * 0.4})`;
        }
        if (percentage) {
            percentage.textContent = Math.round(dopamine) + '%';
            meter && meter.setAttribute('aria-valuenow', String(Math.round(dopamine)));
        }
    }

    function spawnBurst(x, y, text) {
        const burst = document.createElement('div');
        burst.className = 'burst';
        burst.textContent = text;
        burst.style.left = x + 'px';
        burst.style.top = y + 'px';
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 700);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const boost = parseFloat(btn.getAttribute('data-boost') || '5');
            setDopamine(dopamine + boost);

            // Award points equal to the boost value
            award(boost);

            // visual burst near the button
            const rect = btn.getBoundingClientRect();
            spawnBurst(rect.left + rect.width / 2, rect.top + window.scrollY - 8, `+${boost}`);

            // optional haptic via subtle CSS change
            btn.style.transform = 'translateY(1px) scale(0.98)';
            setTimeout(() => { btn.style.transform = ''; }, 90);
        });
    });

    // mild decay over time to encourage more presses
    setInterval(() => {
        if (dopamine > 0) setDopamine(dopamine - 0.5);
    }, 600);

    // initialize display
    setDopamine(0);

    // (wheel removed)

    // Confetti effect for ending section
    function createConfetti() {
        const colors = ['#8b5cf6', '#06b6d4', '#feca57', '#ff6b6b', '#4ecdc4', '#45b7d1'];
        const confettiCount = 30;
        const endingSection = document.querySelector('.ending-section');
        
        if (!endingSection) return;
        
        const sectionRect = endingSection.getBoundingClientRect();
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.position = 'fixed';
                confetti.style.width = Math.random() * 8 + 4 + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = (sectionRect.left + Math.random() * sectionRect.width) + 'px';
                confetti.style.top = (sectionRect.top - 10) + 'px';
                confetti.style.zIndex = '9999';
                confetti.style.pointerEvents = 'none';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                
                document.body.appendChild(confetti);
                
                // Animate confetti falling within the section
                const animation = confetti.animate([
                    { 
                        transform: 'translateY(0px) rotate(0deg)', 
                        opacity: 1 
                    },
                    { 
                        transform: `translateY(${sectionRect.height + 50}px) rotate(720deg)`, 
                        opacity: 0 
                    }
                ], {
                    duration: Math.random() * 2000 + 1500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                
                animation.onfinish = () => {
                    confetti.remove();
                };
            }, i * 30);
        }
    }

    // Trigger continuous confetti when ending section comes into view
    const endingSection = document.querySelector('.ending-section');
    let confettiInterval;
    
    if (endingSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start continuous confetti
                    createConfetti();
                    confettiInterval = setInterval(createConfetti, 3000); // Every 3 seconds
                    observer.unobserve(entry.target); // Only trigger once
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(endingSection);
    }

    // Awareness percentage count-up
    const awarenessEl = document.getElementById('awareness-percentage');
    if (awarenessEl) {
        let value = 0;
        const target = 89;
        const durationMs = 1600;
        const stepMs = 30;
        const steps = Math.ceil(durationMs / stepMs);
        const increment = target / steps;
        const timer = setInterval(() => {
            value = Math.min(target, value + increment);
            awarenessEl.textContent = Math.round(value) + '%';
            if (value >= target) clearInterval(timer);
        }, stepMs);
    }

    // Image swapper slider logic
    const slider = document.getElementById('swap-slider');
    const imgNormal = document.getElementById('swap-image-normal');
    const imgPhones = document.getElementById('swap-image-phones');
    let lastImageState = null; // Track the last image state
    let imageChangeRewarded = false; // Track if first image change was rewarded

    function updateSwapImages(value) {
        const showPhones = Number(value) >= 50;
        if (imgNormal && imgPhones) {
            if (showPhones) {
                imgNormal.classList.remove('is-visible');
                imgPhones.classList.add('is-visible');
            } else {
                imgPhones.classList.remove('is-visible');
                imgNormal.classList.add('is-visible');
            }
        }
        return showPhones; // Return the current state
    }

    if (slider) {
        lastImageState = updateSwapImages(slider.value);
        slider.addEventListener('input', (e) => {
            const value = (e.target && e.target.value) || '0';
            const currentState = updateSwapImages(value);
            
            // Award points only once for the first image change
            if (currentState !== lastImageState && !imageChangeRewarded) {
                award(50);
                imageChangeRewarded = true;
                lastImageState = currentState;
            } else if (currentState !== lastImageState) {
                // Update state but don't award points
                lastImageState = currentState;
            }
        });
    }

    // Lightbox for images
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-image') : null;
    const lightboxCap = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    function openLightbox(src, captionText) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        if (lightboxCap) lightboxCap.textContent = ''; // Remove text from modals
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
    lightbox && lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Attach to all gallery/figure images
    const selectableFigures = document.querySelectorAll('.why-figure img, .dopamine-figure img, .better-card img');
    selectableFigures.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            const figure = img.closest('figure');
            const captionEl = figure ? figure.querySelector('figcaption') : null;
            const caption = captionEl ? captionEl.textContent : img.alt || '';
            openLightbox(img.src, caption);
        });
    });

    // SVG fallback if an image fails to load
    function createFallbackSVG(label, subtitle) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 1200 675');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.classList.add('img-fallback-svg');

        const bg = document.createElementNS(svgNS, 'rect');
        bg.setAttribute('x', '0');
        bg.setAttribute('y', '0');
        bg.setAttribute('width', '1200');
        bg.setAttribute('height', '675');
        bg.setAttribute('fill', '#1b1441');
        svg.appendChild(bg);

        const gradient = document.createElementNS(svgNS, 'defs');
        gradient.innerHTML = '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.8"/><stop offset="100%" stop-color="#06b6d4" stop-opacity="0.6"/></linearGradient>';
        svg.appendChild(gradient);

        const ring = document.createElementNS(svgNS, 'circle');
        ring.setAttribute('cx', '600');
        ring.setAttribute('cy', '337');
        ring.setAttribute('r', '240');
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', 'url(#g)');
        ring.setAttribute('stroke-width', '18');
        ring.setAttribute('opacity', '0.7');
        svg.appendChild(ring);

        const title = document.createElementNS(svgNS, 'text');
        title.setAttribute('x', '600');
        title.setAttribute('y', '320');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('fill', '#ffffff');
        title.setAttribute('font-size', '52');
        title.setAttribute('font-weight', '800');
        title.textContent = label || 'Image unavailable';
        svg.appendChild(title);

        const sub = document.createElementNS(svgNS, 'text');
        sub.setAttribute('x', '600');
        sub.setAttribute('y', '380');
        sub.setAttribute('text-anchor', 'middle');
        sub.setAttribute('fill', 'rgba(255,255,255,0.85)');
        sub.setAttribute('font-size', '28');
        sub.textContent = subtitle || 'Content fallback';
        svg.appendChild(sub);

        return svg;
    }

    function replaceWithFallback(imgEl) {
        if (!imgEl) return;
        const label = imgEl.getAttribute('data-fallback-label') || imgEl.alt || 'Image';
        const figure = imgEl.closest('figure');
        const subtitle = figure && figure.querySelector('figcaption') ? figure.querySelector('figcaption').textContent : '';
        const wrapper = document.createElement('div');
        wrapper.className = 'img-fallback-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = imgEl.style.height || imgEl.getAttribute('height') || '';
        const svg = createFallbackSVG(label, subtitle);
        wrapper.appendChild(svg);
        imgEl.replaceWith(wrapper);
    }

    document.querySelectorAll('img[data-fallback-label]').forEach(img => {
        img.addEventListener('error', () => replaceWithFallback(img), { once: true });
    });

    // Discover buttons: replace illustration with the original explanatory image (no popups)
    // Discover buttons -> open current illustration as a popup (lightbox)
    function setupDiscoverLightbox(buttonId, illuId) {
        const btn = document.getElementById(buttonId);
        const illu = document.getElementById(illuId);
        if (!btn || !illu) return;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(illu.src, illu.alt || '');
            // Award 40 points for discovering
            award(40);
        });
    }
    // Show specific images in the lightbox for each Discover button
    setupDiscoverLightbox('discover-why', 'why-original');
    setupDiscoverLightbox('discover-dopamine', 'dopamine-original');

    // Media buttons (podcast and sound)
    const podcastBtn = document.getElementById('btn-podcast');
    const soundBtn = document.getElementById('btn-sound');
    const podcastAudio = document.getElementById('podcast-audio');
    const sfxAudio = document.getElementById('sfx-audio');
    const musicAudio = document.getElementById('music-audio');

    if (podcastBtn && podcastAudio) {
        podcastBtn.addEventListener('click', async () => {
            try {
                if (podcastAudio.paused) {
                    await podcastAudio.play();
                    podcastBtn.textContent = '⏸ Pause podcast';
                } else {
                    podcastAudio.pause();
                    podcastBtn.textContent = '▶ Listen to podcast';
                }
            } catch (e) {
                console.warn('Podcast playback failed:', e);
            }
        });
    }
    if (soundBtn) {
        soundBtn.addEventListener('click', async () => {
            try {
                if (musicAudio) {
                    if (musicAudio.paused) {
                        if (podcastAudio && !podcastAudio.paused) podcastAudio.pause();
                        await musicAudio.play();
                        soundBtn.textContent = '⏸ Pause music';
                    } else {
                        musicAudio.pause();
                        soundBtn.textContent = '▶ Listen to music';
                    }
                } else if (sfxAudio) {
                    sfxAudio.currentTime = 0;
                    await sfxAudio.play();
                }
            } catch (e) {
                console.warn('Audio playback failed:', e);
            }
        });
    }

    // Dopamine brain glow interaction with burst effect
    const brainBtn = document.getElementById('btn-brain-glow');
    const brainImg = document.getElementById('dopamine-illustration');
    
    function createBurstEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create multiple intense ripple layers for dramatic effect
        const rippleLayers = [
            {
                size: 300,
                duration: 800,
                delay: 0,
                gradient: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 215, 0, 0.9) 20%, rgba(255, 69, 0, 0.7) 40%, rgba(139, 92, 246, 0.5) 60%, transparent 100%)',
                blur: '0px'
            },
            {
                size: 400,
                duration: 1000,
                delay: 100,
                gradient: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(0, 255, 255, 0.6) 30%, rgba(255, 0, 255, 0.4) 60%, transparent 100%)',
                blur: '2px'
            },
            {
                size: 500,
                duration: 1200,
                delay: 200,
                gradient: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(139, 92, 246, 0.4) 40%, rgba(6, 182, 212, 0.2) 70%, transparent 100%)',
                blur: '4px'
            }
        ];
        
        // Create each ripple layer
        rippleLayers.forEach((layer, index) => {
            const burst = document.createElement('div');
            burst.style.position = 'fixed';
            burst.style.left = centerX + 'px';
            burst.style.top = centerY + 'px';
            burst.style.width = '0px';
            burst.style.height = '0px';
            burst.style.borderRadius = '50%';
            burst.style.background = layer.gradient;
            burst.style.transform = 'translate(-50%, -50%)';
            burst.style.zIndex = '9999';
            burst.style.pointerEvents = 'none';
            burst.style.transition = `all ${layer.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            burst.style.filter = `blur(${layer.blur})`;
            burst.style.boxShadow = '0 0 50px rgba(255, 255, 255, 0.8), 0 0 100px rgba(255, 215, 0, 0.6), 0 0 150px rgba(255, 69, 0, 0.4)';
            
            document.body.appendChild(burst);
            
            // Animate each layer with staggered timing
            setTimeout(() => {
                burst.style.width = layer.size + 'px';
                burst.style.height = layer.size + 'px';
                burst.style.opacity = '0';
                burst.style.transform = 'translate(-50%, -50%) scale(1.2)';
            }, layer.delay + 10);
            
            // Remove after animation
            setTimeout(() => {
                if (burst.parentNode) {
                    burst.remove();
                }
            }, layer.duration + layer.delay + 100);
        });
        
        // Add intense flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.left = '0';
        flash.style.top = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.background = 'radial-gradient(circle at ' + centerX + 'px ' + centerY + 'px, rgba(255, 255, 255, 0.3) 0%, transparent 50%)';
        flash.style.zIndex = '9998';
        flash.style.pointerEvents = 'none';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.1s ease-out';
        
        document.body.appendChild(flash);
        
        // Flash effect
        setTimeout(() => {
            flash.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            flash.style.opacity = '0';
        }, 50);
        
        setTimeout(() => {
            if (flash.parentNode) {
                flash.remove();
            }
        }, 200);
        
        // Add screen shake effect
        document.body.style.animation = 'brainShake 0.3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }
    
    if (brainBtn && brainImg) {
        brainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            createBurstEffect(brainImg);
            setDopamine(dopamine + 8);
            award(20); // Award 20 points for brain glow
        });
    }

    // Status tracker logic
    const trackerTierEl = document.getElementById('tracker-tier');
    const trackerPointsEl = document.getElementById('tracker-points');
    const trackerBarFill = document.getElementById('tracker-bar-fill');

    const tiers = [
        { name: 'Wood', color: '#a16207', threshold: 0 },
        { name: 'Bronze', color: '#cd7f32', threshold: 50 },
        { name: 'Silver', color: '#c0c0c0', threshold: 120 },
        { name: 'Gold', color: '#ffd700', threshold: 220 },
        { name: 'Platinum', color: '#e5e4e2', threshold: 350 },
        { name: 'Diamond', color: '#67e8f9', threshold: 520 }
    ];

    // In-memory points so clicks increase during the session
    let sessionPoints = 0;
    function getPoints() {
        return sessionPoints;
    }
    function setPoints(n) {
        sessionPoints = n;
    }
    function currentTier(points) {
        let t = tiers[0];
        for (const tier of tiers) {
            if (points >= tier.threshold) t = tier; else break;
        }
        return t;
    }
    function nextTier(points) {
        for (let i = 0; i < tiers.length; i++) {
            if (points < tiers[i].threshold) return tiers[i];
        }
        return null;
    }
    function progressWithinTier(points) {
        const cur = currentTier(points);
        const nxt = nextTier(points);
        const base = cur.threshold;
        const span = nxt ? (nxt.threshold - base) : 1;
        const p = Math.max(0, Math.min(1, (points - base) / span));
        return { cur, nxt, p };
    }
    function renderTracker(points) {
        const { cur, nxt, p } = progressWithinTier(points);
        if (trackerTierEl) {
            trackerTierEl.textContent = cur.name;
            trackerTierEl.style.color = cur.color;
        }
        if (trackerPointsEl) trackerPointsEl.textContent = `${points} pts`;
        if (trackerBarFill) {
            trackerBarFill.style.width = `${Math.round(p * 100)}%`;
            trackerBarFill.style.background = nxt ? 'linear-gradient(90deg,#8b5cf6,#06b6d4)' : 'linear-gradient(90deg,#22c55e,#84cc16)';
        }
    }
    function award(pointsDelta) {
        const current = getPoints();
        const updated = Math.max(0, current + pointsDelta);
        setPoints(updated);
        renderTracker(updated);
    }
    renderTracker(0);

    // award points on clicks (exclude tracker and modals)
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;
        const tracker = document.getElementById('status-tracker');
        const infoModal = document.getElementById('info-modal');
        const lightboxEl = document.getElementById('lightbox');
        if ((tracker && tracker.contains(target)) || (infoModal && infoModal.contains(target)) || (lightboxEl && lightboxEl.contains(target))) {
            return;
        }
        award(1); // Reduced to 1 point for general clicks
    });

    // Better World modal handling
    const infoModal = document.getElementById('info-modal');
    const infoClose = infoModal ? infoModal.querySelector('.info-close') : null;
    const infoLogo = infoModal ? infoModal.querySelector('#info-logo') : null;
    const infoTitle = infoModal ? infoModal.querySelector('#info-title') : null;
    const infoText = infoModal ? infoModal.querySelector('#info-text') : null;
    const infoLink = infoModal ? infoModal.querySelector('#info-link') : null;

    const exampleContent = {
        better1: {
            title: 'Orange',
            text: 'Orange created resources to help users recognize manipulative designs (dark patterns) and stay safe online.',
            link: 'https://bienvivreledigital.orange.fr/securite/attention-arnaques/orange-arnaque-dark-patterns.html',
            logo: 'assets/img/logo-orange.png'
        },
        better2: {
            title: 'Designers éthiques',
            text: 'This French initiative aims to a better marketing which avoids dark patterns and all types of manipulation.',
            link: 'https://designersethiques.org/designersethiques.org/media/pages/thematiques/design-persuasif/concevoir-sans-dark-patterns/75a53444f2-1700233850/guide-concevoir-sans-dark-patterns.pdf',
            logo: 'assets/img/logo-designers-ethiques.png'
        },
        better3: {
            title: 'Betclic',
            text: 'In France, regulations made Betclic change their marketing model. They’re now obliged to be honest with the consumer concerning the odds of winning a freebet.',
            link: '',
            logo: 'assets/img/logo-betclic.svg.png'
        }
    };

    function openInfoModal(key) {
        if (!infoModal) return;
        const data = exampleContent[key];
        if (!data) return;
        if (infoLogo) infoLogo.style.backgroundImage = `url('${data.logo}')`;
        if (infoTitle) infoTitle.textContent = data.title;
        if (infoText) infoText.textContent = data.text;
        if (infoLink) {
            if (data.link) {
                infoLink.href = data.link;
                infoLink.style.display = 'inline-block';
                infoLink.textContent = 'Read the guide';
            } else {
                infoLink.style.display = 'none';
                infoLink.removeAttribute('href');
            }
        }
        infoModal.classList.add('is-open');
        infoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // Award 100 points for learning more
        award(100);
    }
    function closeInfoModal() {
        if (!infoModal) return;
        infoModal.classList.remove('is-open');
        infoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    infoClose && infoClose.addEventListener('click', closeInfoModal);
    infoModal && infoModal.addEventListener('click', (e) => { if (e.target === infoModal) closeInfoModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeInfoModal(); });

    document.querySelectorAll('.better-card[data-example]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-example');
            openInfoModal(key);
        });
    });
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}