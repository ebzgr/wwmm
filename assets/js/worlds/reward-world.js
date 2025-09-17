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
    
    // Footer is loaded by footer-loader.js

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
    }

    if (slider) {
        updateSwapImages(slider.value);
        slider.addEventListener('input', (e) => {
            const value = (e.target && e.target.value) || '0';
            updateSwapImages(value);
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
        if (lightboxCap) lightboxCap.textContent = captionText || '';
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

    // Discover toggles: swap illustration -> original image
    function setupDiscover(buttonId, illuId, origId) {
        const btn = document.getElementById(buttonId);
        const illu = document.getElementById(illuId);
        const orig = document.getElementById(origId);
        if (!btn || !illu || !orig) return;
        btn.addEventListener('click', () => {
            illu.classList.add('hidden');
            orig.classList.remove('hidden');
            // open in lightbox as well
            openLightbox(orig.src, orig.alt || '');
        });
    }
    // Updated: if original image is not present, open illustration in lightbox
    function setupDiscoverFallback(buttonId, illuId, origId) {
        const btn = document.getElementById(buttonId);
        const illu = document.getElementById(illuId);
        const orig = document.getElementById(origId);
        if (!btn || !illu) return;
        btn.addEventListener('click', () => {
            const targetImg = orig || illu;
            if (orig) {
                illu.classList.add('hidden');
                orig.classList.remove('hidden');
                // ensure inline display if any default CSS hides it
                orig.style.display = '';
            }
            openLightbox(targetImg.src, targetImg.alt || '');
        });
    }
    setupDiscoverFallback('discover-why', 'why-illustration', 'why-original');
    setupDiscoverFallback('discover-dopamine', 'dopamine-illustration', 'dopamine-original');

    // Media buttons (podcast and sound)
    const podcastBtn = document.getElementById('btn-podcast');
    const soundBtn = document.getElementById('btn-sound');
    const podcastAudio = document.getElementById('podcast-audio');
    const sfxAudio = document.getElementById('sfx-audio');

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
    if (soundBtn && sfxAudio) {
        soundBtn.addEventListener('click', async () => {
            try {
                sfxAudio.currentTime = 0;
                await sfxAudio.play();
            } catch (e) {
                console.warn('SFX playback failed:', e);
            }
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

    function getPoints() {
        // Always start from 0 on refresh
        return 0;
    }
    function setPoints(n) {
        // No persistence per requirement
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
        award(5);
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
            text: 'As to make its users aware, Orange has created a website where they can find tips and information about marketing strategies as dark patterns.',
            link: '',
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