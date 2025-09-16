// Pricing World Script
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
    
    // Anchoring demo interactions
    try {
        const anchorCard = document.querySelector('.anchor-card');
        const newPriceBtn = document.getElementById('anchor-new-price');
        const message = document.getElementById('anchor-message');
        if (anchorCard && newPriceBtn && message) {
            const show = () => {
                anchorCard.classList.add('show-message');
                message.setAttribute('aria-hidden', 'false');
                newPriceBtn.setAttribute('aria-expanded', 'true');
            };
            const hide = () => {
                anchorCard.classList.remove('show-message');
                message.setAttribute('aria-hidden', 'true');
                newPriceBtn.setAttribute('aria-expanded', 'false');
            };

            // Hover to reveal
            newPriceBtn.addEventListener('mouseenter', show);
            newPriceBtn.addEventListener('mouseleave', hide);

            // Click toggles and keeps for a few seconds
            newPriceBtn.addEventListener('click', () => {
                if (anchorCard.classList.contains('show-message')) {
                    hide();
                } else {
                    show();
                    setTimeout(hide, 4000);
                }
            });
        }
    } catch (e) {
        // Non-blocking
        console.log('Anchoring demo init skipped:', e);
    }

    // Deal World interactions
    try {
        // Add-on pricing: live total
        const totalEl = document.getElementById('burger-total');
        const extras = document.querySelectorAll('.burger-extra');
        if (totalEl && extras.length) {
            const basePrice = 5.0;
            const updateTotal = () => {
                let total = basePrice;
                extras.forEach((cb) => {
                    if (!cb.disabled && cb.checked) {
                        total += parseFloat(cb.getAttribute('data-price') || '0');
                    }
                });
                totalEl.textContent = `€${total.toFixed(2)}`;
            };
            extras.forEach(cb => cb.addEventListener('change', updateTotal));
            updateTotal();
        }

        // Discounting: countdown + stock
        const timerEl = document.getElementById('bf-timer');
        const leftEl = document.getElementById('bf-left');
        const ctaEl = document.getElementById('bf-cta');
        if (timerEl && leftEl && ctaEl) {
            let seconds = 30;
            let left = 3;
            const tick = () => {
                const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
                const ss = String(seconds % 60).padStart(2, '0');
                timerEl.textContent = `${mm}:${ss}`;
                seconds = seconds > 0 ? seconds - 1 : 0;
            };
            const interval = setInterval(tick, 1000);
            tick();
            ctaEl.addEventListener('click', () => {
                if (left > 0) {
                    left -= 1;
                    leftEl.textContent = String(left);
                }
            });
        }

        // Decoy: selection feedback
        const popTable = document.getElementById('popcorn-table');
        const popChoice = document.getElementById('pop-choice');
        if (popTable && popChoice) {
            popTable.addEventListener('click', (e) => {
                const btn = e.target.closest('button.pop-row');
                if (!btn) return;
                const size = btn.getAttribute('data-size');
                const price = btn.getAttribute('data-price');
                popChoice.textContent = `Selected: ${size} (€${parseFloat(price).toFixed(2)})`;
            });
        }

        // Charm: toggle
        const charmToggle = document.getElementById('charm-toggle');
        const charmOld = document.getElementById('charm-old');
        const charmNew = document.getElementById('charm-new');
        if (charmToggle && charmOld && charmNew) {
            let showingCharm = false;
            const render = () => {
                if (showingCharm) {
                    charmOld.textContent = '€2.00';
                    charmNew.textContent = '€1.99';
                    charmToggle.textContent = 'Switch to €2.00';
                    charmToggle.setAttribute('aria-pressed', 'true');
                } else {
                    charmOld.textContent = '€2.00';
                    charmNew.textContent = '€2.00';
                    charmToggle.textContent = 'Switch to €1.99';
                    charmToggle.setAttribute('aria-pressed', 'false');
                }
            };
            charmToggle.addEventListener('click', () => { showingCharm = !showingCharm; render(); });
            render();
        }

        // Prestige: toggle round vs .99
        const prestigeToggle = document.getElementById('prestige-toggle');
        if (prestigeToggle) {
            let useCharm = false;
            const prices = document.querySelectorAll('.prestige-price');
            const fmt = (n) => n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const render = () => {
                prices.forEach(p => {
                    const round = p.getAttribute('data-round');
                    const charm = p.getAttribute('data-charm');
                    const value = useCharm ? charm : round;
                    if (value) {
                        p.textContent = `€${fmt(value)}`;
                    }
                });
                prestigeToggle.textContent = useCharm ? 'Switch to round' : 'Switch to .99';
            };
            prestigeToggle.addEventListener('click', () => { useCharm = !useCharm; render(); });
            render();
        }

        // Reveal explanation panels on scroll using IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const panel = entry.target;
                    panel.style.display = 'block';
                    panel.setAttribute('aria-hidden', 'false');
                }
            });
        }, { root: null, threshold: 0.25 });

        document.querySelectorAll('.explain-panel').forEach(panel => {
            observer.observe(panel);
        });

        // Also reveal the overview explanation shortly after load for priming
        const overviewExplain = document.getElementById('explain-overview');
        if (overviewExplain) {
            setTimeout(() => {
                overviewExplain.style.display = 'block';
                overviewExplain.setAttribute('aria-hidden', 'false');
            }, 600);
        }
    } catch (e) {
        console.log('Deal World interactive init skipped:', e);
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
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}