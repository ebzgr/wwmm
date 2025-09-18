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

            // Allow clicking anywhere on the burger row to toggle the option
            const rows = document.querySelectorAll('.burger-item');
            rows.forEach(row => {
                row.style.cursor = 'pointer';
                row.addEventListener('click', (e) => {
                    // Avoid double toggling when clicking directly the checkbox
                    if ((e.target instanceof HTMLInputElement) && e.target.type === 'checkbox') return;
                    const cb = row.querySelector('input.burger-extra');
                    if (!cb || cb.disabled) return;
                    cb.checked = !cb.checked;
                    cb.dispatchEvent(new Event('change'));
                });
            });
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

        // Decoy: comparison tables (no interaction needed for new design)

        // Charm: toggle pricing
        const charmCheckbox = document.getElementById('charm-checkbox');
        const charmPrice = document.getElementById('charm-price');
        const toggleText = document.querySelector('.toggle-text');
        
        if (charmCheckbox && charmPrice && toggleText) {
            charmCheckbox.addEventListener('change', () => {
                if (charmCheckbox.checked) {
                    charmPrice.textContent = '€1.99';
                    toggleText.textContent = 'Remove Charm';
                } else {
                    charmPrice.textContent = '€2.00';
                    toggleText.textContent = 'Charm the Price';
                }
            });
        }

        // Prestige: interactive phone selection
        const phoneOptions = document.querySelectorAll('.phone-option');
        const phoneSelects = document.querySelectorAll('.phone-select');
        
        phoneSelects.forEach(select => {
            select.addEventListener('click', (e) => {
                e.preventDefault();
                const choice = select.getAttribute('data-choice');
                const phoneOption = select.closest('.phone-option');
                
                // Remove previous selections
                phoneOptions.forEach(option => option.classList.remove('selected'));
                
                // Add selection to clicked option
                phoneOption.classList.add('selected');
                
                // Show educational message
                const modal = document.getElementById('buy-modal');
                const biasEl = document.getElementById('buy-modal-bias');
                const msgEl = document.getElementById('buy-modal-message');
                
                if (modal && biasEl && msgEl) {
                    if (choice === 'high') {
                        biasEl.textContent = 'Prestige Pricing Psychology';
                        msgEl.textContent = 'This is prestige pricing in action! The €1,199 price creates an impression of quality, exclusivity, and premium value. Companies use rounded prices (avoiding .99 endings) to signal sophistication and luxury.\n\nThe psychology: Higher prices trigger our perception that quality comes at a premium. We associate expensive items with better materials, superior craftsmanship, and social status.\n\nSOLUTION:\n• Research the actual product specifications and features\n• Compare with similar products to see if the price reflects real value or just brand positioning';
                    } else {
                        biasEl.textContent = 'Value-Based Pricing Psychology';
                        msgEl.textContent = 'This demonstrates how pricing affects our perception! The €499 price suggests good value and accessibility. Companies use this pricing strategy to appeal to budget-conscious consumers while maintaining quality perception.\n\nThe psychology: Mid-range prices feel like a smart compromise - not too cheap to seem low-quality, but not so expensive as to be unaffordable.\n\nSOLUTION:\n• Focus on the actual features and benefits you need\n• Consider the total cost of ownership, not just the initial price';
                    }
                    modal.style.display = 'block';
                    modal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Reveal explanation panels on scroll using IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const panel = entry.target;
                    panel.style.display = 'block';
                    panel.setAttribute('aria-hidden', 'false');
                }
            });
        }, { root: null, threshold: 0.05 });

        document.querySelectorAll('.explain-panel').forEach(panel => {
            observer.observe(panel);
        });

        // Overview explanation auto-reveal removed
    } catch (e) {
        console.log('Deal World interactive init skipped:', e);
    }

    // Purchase Bias Modal wiring - enhanced overlay
    try {
        const modal = document.getElementById('buy-modal');
        const biasEl = document.getElementById('buy-modal-bias');
        const msgEl = document.getElementById('buy-modal-message');
        const closeBtn = document.getElementById('buy-modal-close');
        const backdrop = document.getElementById('buy-modal-backdrop');

        function openModal(bias, message) {
            if (!modal || !biasEl || !msgEl) return;
            biasEl.textContent = `Bias: ${bias}`;
            msgEl.textContent = message;
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (!modal) return;
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            // Restore body scroll
            document.body.style.overflow = 'auto';
        }

        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const bias = btn.getAttribute('data-bias') || 'Pricing Bias';
                const message = btn.getAttribute('data-message') || 'Cette offre exploite un biais de tarification.';
                openModal(bias, message);
            });
        });

        // Close modal handlers
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.style.display === 'block') {
                closeModal();
            }
        });
    } catch (e) {
        console.log('Buy modal wiring skipped:', e);
    }
    // Footer is loaded by footer-loader.js
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}