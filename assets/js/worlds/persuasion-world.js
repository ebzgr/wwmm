// Advertising World Script
document.addEventListener('DOMContentLoaded', function () {
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

    // Initialize mini-games
    try {
        installImageFallbacks();
        initializeAdGames();
    } catch (e) {
        console.warn('Ad games init failed:', e);
    }
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Replace blocked images with safe fallbacks
function installImageFallbacks() {
    const fallbackMap = {
        // attention -> watches for flash sale vibes (card B)
        'attention|B': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80&auto=format&fit=crop',
        // triggers -> t-shirt rack for scarcity (card B)
        'triggers|B': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80&auto=format&fit=crop'
    };

    document.querySelectorAll('.ad-grid').forEach(grid => {
        const gameId = grid.getAttribute('data-game');
        grid.querySelectorAll('.ad-card').forEach(card => {
            const choice = card.getAttribute('data-choice');
            const img = card.querySelector('img.ad-image');
            if (!img) return;
            img.addEventListener('error', () => {
                const key = `${gameId}|${choice}`;
                const fallback = fallbackMap[key] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop'; // generic product
                if (img.dataset._replaced) return;
                img.dataset._replaced = '1';
                img.src = fallback;
            }, { once: true });
        });
    });
}

// Mini-games logic
function initializeAdGames() {
    const gameConfig = {
        cognitive: {
            correct: 'B',
            messages: {
                correct: 'Correct! "Only €79" avoids anchoring bias. The other primes you with a fake high price.',
                wrong: 'Not quite. The crossed-out high price uses anchoring to make €79 feel cheaper.'
            }
        },
        emotional: {
            correct: 'A',
            messages: {
                correct: 'Nice! Positive joy appeals are generally less manipulative than FOMO pressure.',
                wrong: 'Close, but FOMO ("Don’t be the only one without it") is a classic coercive nudge.'
            }
        },
        subliminal: {
            correct: 'A',
            messages: {
                correct: 'Well spotted. Minimal, explicit messaging is more transparent than suggestive shapes.',
                wrong: 'The suggestive shapes are a subliminal cue. The minimal ad is more transparent.'
            }
        },
        attention: {
            correct: 'B',
            messages: {
                correct: 'Right! The "flash sale vibes" are less aggressive than neon "Limited Time" urgency.',
                wrong: 'The neon "Limited Time" framing ramps urgency. The other is less pushy.'
            }
        },
        triggers: {
            correct: 'A',
            messages: {
                correct: 'Good pick. Social proof can inform without panic; scarcity often induces pressure.',
                wrong: '"Only 3 left today" is scarcity pressure. Social proof is typically less coercive.'
            }
        }
    };

    const grids = document.querySelectorAll('.ad-grid');
    grids.forEach(grid => {
        const gameId = grid.getAttribute('data-game');
        const cards = grid.querySelectorAll('.ad-card');
        const buttons = grid.querySelectorAll('.vote-btn');
        const feedbackEl = ensureFeedbackElement(grid);

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.currentTarget.closest('.ad-card');
                const choice = card.getAttribute('data-choice');
                handleVote(gameId, choice, cards, buttons, feedbackEl, gameConfig);
            });
        });

        // Make the whole card clickable as a choice
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // If buttons are disabled, game has been answered
                if (Array.from(buttons).some(b => b.disabled)) return;
                const choice = card.getAttribute('data-choice');
                handleVote(gameId, choice, cards, buttons, feedbackEl, gameConfig);
            });
        });
    });

    const playAgainButtons = document.querySelectorAll('.play-again-btn');
    playAgainButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            resetGame(btn.getAttribute('data-game'));
        });
    });
}

function handleVote(gameId, choice, cards, buttons, feedbackEl, gameConfig) {
    // Visual selection
    cards.forEach(c => c.classList.remove('selected'));
    const selected = Array.from(cards).find(c => c.getAttribute('data-choice') === choice);
    if (selected) {
        selected.classList.add('selected');
    }

    // Disable buttons until play again
    buttons.forEach(b => b.disabled = true);

    // Determine correctness per game
    const cfg = gameConfig[gameId];
    if (cfg) {
        const isCorrect = choice === cfg.correct;
        // Mark cards
        cards.forEach(c => {
            const cChoice = c.getAttribute('data-choice');
            c.classList.remove('correct', 'incorrect');
            if (cChoice === cfg.correct) {
                c.classList.add('correct');
            } else if (cChoice === choice) {
                c.classList.add('incorrect');
            }
        });

        // Feedback message
        const message = isCorrect ? `🎉 ${cfg.messages.correct}` : `🤔 ${cfg.messages.wrong}`;
        showFeedback(feedbackEl, isCorrect, message);

        // Optional sound cue
        try {
            if (isCorrect) {
                const audio = new Audio('assets/sound/clapping.mp3');
                audio.volume = 0.3;
                audio.play().catch(() => { });
            } else {
                const audio = new Audio('assets/sound/retro-coin.mp3');
                audio.volume = 0.25;
                audio.play().catch(() => { });
            }
        } catch (e) { }
    }

    // Track event
    try {
        const payload = { game_id: gameId, choice: choice };
        trackUserEvent('persuasion_game_choice', payload);
        // Send immediately to keep data
        if (window.EventSystem && typeof window.EventSystem.sendEventBatch === 'function') {
            setTimeout(() => window.EventSystem.sendEventBatch(), 100);
        }
    } catch (e) {
        // ignore
    }
}

function resetGame(gameId) {
    const grid = document.querySelector(`.ad-grid[data-game="${gameId}"]`);
    if (!grid) return;
    const cards = grid.querySelectorAll('.ad-card');
    const buttons = grid.querySelectorAll('.vote-btn');
    cards.forEach(c => c.classList.remove('selected'));
    buttons.forEach(b => b.disabled = false);
    // Clear correctness and feedback
    cards.forEach(c => c.classList.remove('correct', 'incorrect'));
    const feedbackEl = grid.parentElement.querySelector('.game-feedback');
    if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.classList.remove('show', 'ok', 'nope');
    }

    try {
        trackUserEvent('persuasion_game_reset', { game_id: gameId });
    } catch (e) { }
}

function ensureFeedbackElement(gridEl) {
    // Try to find existing feedback element right after grid inside the same section content
    const container = gridEl.parentElement;
    let el = container.querySelector('.game-feedback');
    if (!el) {
        el = document.createElement('div');
        el.className = 'game-feedback';
        container.insertBefore(el, container.querySelector('.game-actions'));
    }
    return el;
}

function showFeedback(el, isCorrect, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove('ok', 'nope');
    el.classList.add(isCorrect ? 'ok' : 'nope', 'show');
}