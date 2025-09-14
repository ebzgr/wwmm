// Global variables
let currentSection = 0;
let countdownInterval;
let endorsementInterval;
let totalScore = 0;
let currentEndorsement = 0;

// Section order
const sections = [
    'welcome', 'worlds', 'urgency', 'gamification', 
    'social-proof', 'pricing', 'framing', 'advertising', 'thank-you'
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize AOS first for proper animation timing
        initializeAOS();
        
        // Initialize page elements
        initializePage();
        
        // Setup all components
        setupScrollBehavior();
        setupTypingAnimation();
        setupCountdownTimer();
        setupEndorsementSlider();
        setupProgressBar();
        setupParallaxEffects();
        setupFramingRoller();
        setupJoinCrowd();
        
        // Refresh AOS after all elements are loaded
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 100);
        
        // Add window resize handler
        window.addEventListener('resize', function() {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-out',
                once: true,
                offset: 50,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });
        } else {
            console.warn('AOS library not loaded');
        }
    } catch (error) {
        console.error('Error initializing AOS:', error);
    }
}

// Initialize page elements
function initializePage() {
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
}

// Setup scroll behavior
function setupScrollBehavior() {
    window.addEventListener('scroll', function() {
        updateProgressBar();
        
        // Refresh AOS on scroll to ensure animations trigger properly
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
    
    // Magnetic scrolling effect removed
}


// Scroll to specific section
function scrollToSection(index) {
    const targetSection = document.getElementById(sections[index]);
    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll to section by ID (for world titles)
function scrollToSectionById(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll to next section
function scrollToNext() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        scrollToSection(currentSection);
    }
}

// Scroll to top
function scrollToTop() {
    currentSection = 0;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Setup typing animation for welcome section
function setupTypingAnimation() {
    const typingText1 = document.querySelector('.typing-text-1');
    const typingText2 = document.querySelector('.typing-text-2');
    
    if (!typingText1 || !typingText2) return;
    
    // First changing text - faster rate
    const phrases1 = ['mislead', 'persuade', 'teach', 'warn', 'trick', 'aware', 'lure', 'inspire', 'tempt', 'invite', 'push', 'manipulate'];
    let currentPhrase1 = 0;
    let currentChar1 = 0;
    let isDeleting1 = false;
    
    // Second changing text - slower rate
    const phrases2 = ['notice', 'realize', 'learn', 'change', 'understand', 'discover', 'grow', 'evolve', 'adapt', 'transform', 'develop', 'progress'];
    let currentPhrase2 = 0;
    let currentChar2 = 0;
    let isDeleting2 = false;
    
    function typeText1() {
        const current = phrases1[currentPhrase1];
        
        if (isDeleting1) {
            typingText1.textContent = current.substring(0, currentChar1 - 1);
            currentChar1--;
        } else {
            typingText1.textContent = current.substring(0, currentChar1 + 1);
            currentChar1++;
        }
        
        let typeSpeed = isDeleting1 ? 30 : 80; // Faster typing
        
        if (!isDeleting1 && currentChar1 === current.length) {
            typeSpeed = 1500; // Shorter pause at end
            isDeleting1 = true;
        } else if (isDeleting1 && currentChar1 === 0) {
            isDeleting1 = false;
            currentPhrase1 = (currentPhrase1 + 1) % phrases1.length;
            typeSpeed = 300; // Shorter pause before next phrase
        }
        
        setTimeout(typeText1, typeSpeed);
    }
    
    function typeText2() {
        const current = phrases2[currentPhrase2];
        
        if (isDeleting2) {
            typingText2.textContent = current.substring(0, currentChar2 - 1);
            currentChar2--;
        } else {
            typingText2.textContent = current.substring(0, currentChar2 + 1);
            currentChar2++;
        }
        
        let typeSpeed = isDeleting2 ? 50 : 120; // Slower typing
        
        if (!isDeleting2 && currentChar2 === current.length) {
            typeSpeed = 2500; // Longer pause at end
            isDeleting2 = true;
        } else if (isDeleting2 && currentChar2 === 0) {
            isDeleting2 = false;
            currentPhrase2 = (currentPhrase2 + 1) % phrases2.length;
            typeSpeed = 800; // Longer pause before next phrase
        }
        
        setTimeout(typeText2, typeSpeed);
    }
    
    // Start both typing animations with different delays
    setTimeout(typeText1, 2000);
    setTimeout(typeText2, 3500); // Start second text later
}

// Setup countdown timer for urgency section (30 seconds)
function setupCountdownTimer() {
    const countdownElement = document.querySelector('.countdown-timer');
    const urgencyBtn = document.getElementById('urgency-btn');
    const extensionMessage = document.getElementById('extension-message');
    
    if (!countdownElement) {
        console.warn('Countdown element not found');
        return;
    }
    
    if (!urgencyBtn) {
        console.warn('Urgency button not found');
        return;
    }
    
    if (!extensionMessage) {
        console.warn('Extension message element not found');
        return;
    }
    
    let timeLeft = 30; // 30 seconds
    let hasExtended = false;
    let countdownInterval;
    
    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        countdownElement.textContent = displayTime;
        
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            // Timer reached 0
            if (!hasExtended) {
                console.log('Timer reached 0, showing extension message');
                // Hide button for 2 seconds but maintain container height
                urgencyBtn.style.visibility = 'hidden';
                
                setTimeout(() => {
                    // Show extension message
                    extensionMessage.style.display = 'block';
                    hasExtended = true;
                    timeLeft = 30; // Reset to 30 seconds
                    urgencyBtn.style.visibility = 'visible';
                    
                    console.log('Extension message shown, will hide in 5 seconds');
                    
                    // Hide extension message after 5 seconds
                    setTimeout(() => {
                        extensionMessage.style.display = 'none';
                        console.log('Extension message hidden');
                    }, 5000);
                }, 2000);
            } else {
                // Reset timer when it reaches 0 again
                timeLeft = 30;
            }
        }
    }
    
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    
    // Store interval reference for cleanup if needed
    window.countdownInterval = countdownInterval;
}

// Setup testimonial carousel for social proof section
function setupEndorsementSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    if (slides.length === 0) return;
    
    function showNextSlide() {
        // Hide current
        slides[currentEndorsement].classList.remove('active');
        indicators[currentEndorsement].classList.remove('active');
        
        // Show next
        currentEndorsement = (currentEndorsement + 1) % slides.length;
        slides[currentEndorsement].classList.add('active');
        indicators[currentEndorsement].classList.add('active');
    }
    
    // Add click handlers for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            // Clear interval
            clearInterval(endorsementInterval);
            
            // Hide current
            slides[currentEndorsement].classList.remove('active');
            indicators[currentEndorsement].classList.remove('active');
            
            // Show selected
            currentEndorsement = index;
            slides[currentEndorsement].classList.add('active');
            indicators[currentEndorsement].classList.add('active');
            
            // Restart interval
            endorsementInterval = setInterval(showNextSlide, 4000);
        });
    });
    
    // Change slide every 4 seconds
    endorsementInterval = setInterval(showNextSlide, 4000);
}

// Global progress bar function
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
}

// Setup progress bar
function setupProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', updateProgressBar);
}

// Setup parallax effects
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Setup scroll lock for framing section
// Framing Section Roller Functionality
function setupFramingRoller() {
    // Initialize the roller state
    window.framingRollerState = {
        hasRolled: false,
        hasAccess: false
    };
}

function rollForAccess() {
    const rollButton = document.getElementById('roll-button');
    const rollerIcon = document.getElementById('roller-icon');
    const accessResult = document.getElementById('access-result');
    const framingBtn = document.getElementById('framing-btn');
    
    if (!rollButton || window.framingRollerState.hasRolled) return;
    
    // Disable button during roll
    rollButton.disabled = true;
    rollButton.textContent = 'ROLLING...';
    
    // Animate the dice
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        const diceFaces = ['🎲', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        rollerIcon.textContent = diceFaces[Math.floor(Math.random() * diceFaces.length)];
        rollCount++;
        
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            
            // Determine if user wins (80% chance to win)
            const hasWon = Math.random() < 0.8;
            window.framingRollerState.hasRolled = true;
            window.framingRollerState.hasAccess = hasWon;
            
            if (hasWon) {
                // Show success
                rollerIcon.textContent = '👑';
                rollButton.textContent = 'ACCESS GRANTED';
                rollButton.style.background = 'linear-gradient(45deg, #4ade80, #22c55e)';
                accessResult.style.display = 'block';
                framingBtn.disabled = false;
                framingBtn.style.opacity = '1';
                framingBtn.style.cursor = 'pointer';
                
                // Add success animation
                setTimeout(() => {
                    rollButton.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        rollButton.style.transform = 'scale(1)';
                    }, 200);
                }, 100);
            } else {
                // Show failure
                rollerIcon.textContent = '❌';
                rollButton.textContent = 'ACCESS DENIED';
                rollButton.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
                rollButton.disabled = true;
                
                // Show retry option after delay
                setTimeout(() => {
                    rollButton.textContent = 'TRY AGAIN';
                    rollButton.disabled = false;
                    rollButton.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
                    window.framingRollerState.hasRolled = false;
                }, 3000);
            }
        }
    }, 150);
}

// Gamification functions
function pushForPoints() {
    try {
        totalScore += 10;
        updateScoreDisplay();
        showBonusModal();
        playCoinSound();
    } catch (error) {
        console.error('Error in pushForPoints:', error);
    }
}

function playCoinSound() {
    try {
        const coinSound = document.getElementById('coin-sound');
        if (coinSound) {
            // Reset audio to beginning and play
            coinSound.currentTime = 0;
            coinSound.play().catch(error => {
                console.log('Audio play failed (user interaction required):', error);
            });
        } else {
            console.warn('Coin sound element not found');
        }
    } catch (error) {
        console.error('Error playing coin sound:', error);
    }
}

function playClappingSound() {
    try {
        const clappingSound = document.getElementById('clapping-sound');
        if (clappingSound) {
            // Reset audio to beginning and play
            clappingSound.currentTime = 0;
            clappingSound.play().catch(error => {
                console.log('Clapping audio play failed (user interaction required):', error);
            });
        } else {
            console.warn('Clapping sound element not found');
        }
    } catch (error) {
        console.error('Error playing clapping sound:', error);
    }
}

function updateScoreDisplay() {
    try {
        const scoreElement = document.getElementById('total-score');
        const statusElement = document.getElementById('player-status');
        const enterButton = document.querySelector('.btn-gamification');
        
        if (scoreElement) {
            scoreElement.textContent = totalScore;
        }
        
        if (statusElement) {
            let newStatus = '';
            let newColor = '#feca57';
            let showConfetti = false;
            
            if (totalScore >= 5000) {
                newStatus = 'Ultimate Ultimate';
                newColor = '#ff00ff';
                showConfetti = true;
            } else if (totalScore >= 1000) {
                newStatus = 'Super Ultimate';
                newColor = '#ff4500';
                showConfetti = true;
            } else if (totalScore >= 500) {
                newStatus = 'Ultimate';
                newColor = '#ffd700';
                showConfetti = true;
            } else if (totalScore >= 200) {
                newStatus = 'Platinum';
                newColor = '#e5e4e2';
                showConfetti = true;
            } else if (totalScore >= 100) {
                newStatus = 'Gold';
                newColor = '#feca57';
                showConfetti = true;
            } else if (totalScore >= 50) {
                newStatus = 'Silver';
                newColor = '#c0c0c0';
                showConfetti = true;
            } else if (totalScore >= 20) {
                newStatus = 'Bronze';
                newColor = '#cd7f32';
                showConfetti = true;
            } else {
                newStatus = 'Select';
                newColor = '#feca57';
            }
            
            // Check if status changed
            if (statusElement.textContent !== newStatus) {
                statusElement.textContent = newStatus;
                statusElement.style.color = newColor;
                
                // Show confetti and play clapping sound for status changes
                if (showConfetti) {
                    showStatusConfetti();
                    playClappingSound();
                }
            }
        }
        
        // Update button color based on status
        if (enterButton) {
            if (totalScore >= 5000) {
                enterButton.style.background = 'linear-gradient(45deg, #ff00ff, #ff69b4)';
            } else if (totalScore >= 1000) {
                enterButton.style.background = 'linear-gradient(45deg, #ff4500, #ff6347)';
            } else if (totalScore >= 500) {
                enterButton.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
            } else if (totalScore >= 200) {
                enterButton.style.background = 'linear-gradient(45deg, #e5e4e2, #f5f5f5)';
            } else if (totalScore >= 100) {
                enterButton.style.background = 'linear-gradient(45deg, #feca57, #ffed4e)';
            } else if (totalScore >= 50) {
                enterButton.style.background = 'linear-gradient(45deg, #c0c0c0, #e5e5e5)';
            } else if (totalScore >= 20) {
                enterButton.style.background = 'linear-gradient(45deg, #cd7f32, #daa520)';
            } else {
                enterButton.style.background = 'linear-gradient(45deg, #9c88ff, #a8a8ff)';
            }
        }
    } catch (error) {
        console.error('Error updating score display:', error);
    }
}

function showBonusModal() {
    const modal = document.getElementById('bonus-modal');
    if (modal) {
        modal.classList.add('show');
        
        setTimeout(() => {
            modal.classList.remove('show');
        }, 1000);
    }
}

function showStatusConfetti() {
    // Create confetti container
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);
    
    // Create confetti particles
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#9c88ff'];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '-10px';
        particle.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
        
        confettiContainer.appendChild(particle);
    }
    
    // Add confetti animation CSS
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 5000);
}

// Share functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this amazing marketing awareness website!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    
    // Award referral points
    totalScore += 1000;
    updateScoreDisplay();
    showReferralReward();
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Explore the Wonderful World of Manipulative Marketing! #MarketingAwareness');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    
    // Award referral points
    totalScore += 1000;
    updateScoreDisplay();
    showReferralReward();
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Wonderful World of Manipulative Marketing');
    const summary = encodeURIComponent('An educational journey through marketing techniques and consumer psychology.');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
    
    // Award referral points
    totalScore += 1000;
    updateScoreDisplay();
    showReferralReward();
}

function showReferralReward() {
    // Create a temporary reward message
    const rewardMessage = document.createElement('div');
    rewardMessage.innerHTML = '🎉 +1000 Referral Points Earned! 🎉';
    rewardMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #feca57, #ff9ff3);
        color: #000;
        padding: 15px 25px;
        border-radius: 15px;
        font-weight: bold;
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        box-shadow: 0 10px 30px rgba(254, 202, 87, 0.3);
    `;
    
    document.body.appendChild(rewardMessage);
    
    setTimeout(() => {
        rewardMessage.remove();
    }, 3000);
}



// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    updateProgressBar();
}, 16)); // ~60fps

// Magnetic Scrolling Effect - Enhanced Version
// Magnetic scrolling effect removed - function disabled
function setupMagneticScrolling() {
    return; // Function disabled
    let isMagneticActive = false;
    let currentSection = null;
    let scrollVelocity = 0;
    let lastScrollTime = 0;
    let lastScrollTop = 0;
    
    // Get all sections
    const sections = document.querySelectorAll('.section');
    const magneticStrength = 0.8; // Much stronger magnetic effect
    const magneticThreshold = 200; // Larger threshold for more noticeable effect
    const snapThreshold = 150; // Distance to snap to section center
    
    // Disable smooth scrolling temporarily for magnetic effect
    document.documentElement.style.scrollBehavior = 'auto';
    
    function findCurrentSection(scrollTop) {
        let current = null;
        let minDistance = Infinity;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + (sectionHeight / 2);
            const viewportCenter = scrollTop + (window.innerHeight / 2);
            const distance = Math.abs(viewportCenter - sectionCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                current = {
                    element: section,
                    index: index,
                    center: sectionCenter,
                    top: sectionTop,
                    height: sectionHeight,
                    distance: distance
                };
            }
        });
        
        return current;
    }
    
    function applyMagneticResistance(e) {
        if (!currentSection) return;
        
        const scrollTop = window.pageYOffset;
        const viewportCenter = scrollTop + (window.innerHeight / 2);
        const sectionCenter = currentSection.center;
        const distance = viewportCenter - sectionCenter;
        
        // Calculate magnetic resistance based on distance
        const resistance = Math.max(0, 1 - (Math.abs(distance) / magneticThreshold));
        
        if (resistance > 0.1) { // Only apply if close enough to section
            // Reduce scroll speed based on magnetic resistance
            const reducedDelta = e.deltaY * (1 - resistance * magneticStrength);
            
            // Apply the reduced scroll
            window.scrollBy(0, reducedDelta);
            
            // Prevent default scroll
            e.preventDefault();
            
            // Add visual feedback
            currentSection.element.style.transform = `scale(${1 + resistance * 0.02})`;
            currentSection.element.style.filter = `brightness(${1 + resistance * 0.1})`;
            
            return true; // Indicates magnetic effect was applied
        }
        
        return false;
    }
    
    function snapToSection() {
        if (!currentSection) return;
        
        const scrollTop = window.pageYOffset;
        const viewportCenter = scrollTop + (window.innerHeight / 2);
        const sectionCenter = currentSection.center;
        const distance = Math.abs(viewportCenter - sectionCenter);
        
        // Snap to section if close enough
        if (distance < snapThreshold) {
            const targetScroll = sectionCenter - (window.innerHeight / 2);
            
            // Smooth scroll to section center
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
            
            // Add snap effect
            currentSection.element.style.transform = 'scale(1.05)';
            currentSection.element.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                currentSection.element.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // Enhanced wheel event handler
    window.addEventListener('wheel', function(e) {
        const now = Date.now();
        const scrollTop = window.pageYOffset;
        
        // Calculate scroll velocity
        scrollVelocity = (scrollTop - lastScrollTop) / (now - lastScrollTime);
        lastScrollTop = scrollTop;
        lastScrollTime = now;
        
        // Find current section
        currentSection = findCurrentSection(scrollTop);
        
        // Apply magnetic resistance
        const magneticApplied = applyMagneticResistance(e);
        
        if (!magneticApplied) {
            // Reset section styling if not in magnetic zone
            sections.forEach(section => {
                section.style.transform = 'scale(1)';
                section.style.filter = 'brightness(1)';
                section.style.transition = 'transform 0.3s ease, filter 0.3s ease';
            });
        }
        
        // Snap to section after scrolling stops
        clearTimeout(window.magneticSnapTimeout);
        window.magneticSnapTimeout = setTimeout(snapToSection, 200);
        
    }, { passive: false }); // Important: not passive so we can preventDefault
    
    // Handle scroll events for visual feedback
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        currentSection = findCurrentSection(scrollTop);
        
        // Add subtle visual feedback to current section
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + (sectionHeight / 2);
            const viewportCenter = scrollTop + (window.innerHeight / 2);
            const distance = Math.abs(viewportCenter - sectionCenter);
            
            if (distance < magneticThreshold) {
                const intensity = 1 - (distance / magneticThreshold);
                section.style.boxShadow = `0 0 ${20 + intensity * 30}px rgba(255, 255, 255, ${intensity * 0.1})`;
            } else {
                section.style.boxShadow = 'none';
            }
        });
    });
    
    // Handle touch events for mobile
    let touchStartY = 0;
    let touchStartTime = 0;
    
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });
    
    window.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const touchDistance = touchStartY - touchEndY;
        const touchDuration = touchEndTime - touchStartTime;
        
        // Calculate touch velocity
        const touchVelocity = touchDistance / touchDuration;
        
        // Apply magnetic effect based on touch velocity
        if (Math.abs(touchVelocity) > 0.5) { // Fast enough swipe
            setTimeout(() => {
                snapToSection();
            }, 100);
        }
    }, { passive: true });
    
    // Add CSS for magnetic effect
    const style = document.createElement('style');
    style.textContent = `
        .section {
            transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.3s ease;
            will-change: transform, filter, box-shadow;
        }
        
        .section.magnetic-active {
            transform: scale(1.02);
            filter: brightness(1.1);
        }
    `;
    document.head.appendChild(style);
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (endorsementInterval) clearInterval(endorsementInterval);
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Join the Crowd functionality
function setupJoinCrowd() {
    const joinMessage = document.getElementById('join-message');
    const joinText = joinMessage ? joinMessage.querySelector('.join-text') : null;
    
    if (!joinText) {
        console.warn('Join crowd elements not found');
        return;
    }
    
    // List of 30 diverse names from different countries
    const names = [
        // English names
        'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'William', 'Ava', 'Benjamin', 'Isabella', 'Lucas',
        // French names
        'Jean', 'Marie', 'Pierre', 'Sophie', 'Antoine', 'Camille', 'Nicolas', 'Julie', 'Thomas', 'Claire',
        // Other international names
        'Hiroshi', 'Alessandro', 'Ingrid', 'Viktor', 'Anastasia', 'Diego', 'Priya', 'Ahmed', 'Yuki', 'Klaus'
    ];
    
    function showRandomJoin() {
        const randomName = names[Math.floor(Math.random() * names.length)];
        joinText.textContent = `${randomName} just joined the crowd!`;
        
        // Add a subtle animation
        joinMessage.style.transform = 'scale(1.05)';
        setTimeout(() => {
            joinMessage.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Show first message immediately
    showRandomJoin();
    
    // Set up interval to show new messages every 5 seconds (with some randomness)
    setInterval(() => {
        showRandomJoin();
    }, 5000 + Math.random() * 2000); // 5-7 seconds for more natural feel
}
