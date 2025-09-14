/**
 * Event Tracking System
 * Tracks user movements and interactions across the website
 */

class EventTracker {
    constructor() {
        this.currentSection = null;
        this.urgencyTimer = null;
        this.gamificationScore = 0;
        this.gamificationStatus = 'Select';
        this.initializeTracking();
    }

    /**
     * Initialize all event tracking
     */
    initializeTracking() {
        this.trackSectionMovements();
        this.trackWorldVisits();
        this.trackMapMovements();
        this.trackGamificationData();
        this.trackUrgencyData();
    }

    /**
     * Track section movements (from one section to another)
     */
    trackSectionMovements() {
        // Track initial page load
        this.currentSection = this.getCurrentSection();
        if (this.currentSection) {
            trackUserEvent('firstpage_section_movement', {
                from_section: 'page_load',
                to_section: this.currentSection,
                movement_type: 'initial_load'
            });
        }

        // Track scroll-based section changes
        let lastScrollTime = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime < 500) return; // Throttle to 500ms
            
            lastScrollTime = now;
            const newSection = this.getCurrentSection();
            
            if (newSection && newSection !== this.currentSection) {
                // Tracking scroll movement
                trackUserEvent('firstpage_section_movement', {
                    from_section: this.currentSection,
                    to_section: newSection,
                    movement_type: 'scroll'
                });
                this.currentSection = newSection;
            }
        });

        // Track navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                const targetSection = link.getAttribute('href').substring(1);
                if (targetSection && targetSection !== this.currentSection) {
                    trackUserEvent('firstpage_section_movement', {
                        from_section: this.currentSection,
                        to_section: targetSection,
                        movement_type: 'navigation_click'
                    });
                    this.currentSection = targetSection;
                }
            }
        });
    }

    /**
     * Track world visits with context-specific data
     * Note: World visit tracking is now handled on page load, not on button clicks
     */
    trackWorldVisits() {
        // This method is kept for compatibility but world visits are now tracked on page load
    }

    /**
     * Track map section movements
     */
    trackMapMovements() {
        // Track clicks on world cards in the map section
        const worldCards = document.querySelectorAll('.world-ad');
        worldCards.forEach(card => {
            card.addEventListener('click', () => {
                const worldTitle = card.querySelector('.world-title');
                const worldName = worldTitle ? worldTitle.textContent.trim() : 'unknown';
                
                trackUserEvent('movement_by_map', {
                    map_section: 'worlds_showcase',
                    selected_world: worldName,
                    world_type: this.getWorldType(worldName)
                });
            });
        });
    }

    /**
     * Track gamification data
     */
    trackGamificationData() {
        // Monitor score changes
        const scoreElement = document.getElementById('total-score');
        const statusElement = document.getElementById('player-status');
        
        if (scoreElement && statusElement) {
            // Update gamification data when score changes
            const observer = new MutationObserver(() => {
                this.gamificationScore = parseInt(scoreElement.textContent) || 0;
                this.gamificationStatus = statusElement.textContent || 'Select';
            });
            
            observer.observe(scoreElement, { childList: true, subtree: true });
            observer.observe(statusElement, { childList: true, subtree: true });
        }
    }

    /**
     * Track urgency data
     */
    trackUrgencyData() {
        // Monitor urgency timer
        const timerElement = document.querySelector('.countdown-timer');
        if (timerElement) {
            const observer = new MutationObserver(() => {
                this.urgencyTimer = timerElement.textContent;
            });
            observer.observe(timerElement, { childList: true, subtree: true });
        }
    }

    /**
     * Get current section based on scroll position
     */
    getCurrentSection() {
        const sections = ['welcome', 'worlds', 'urgency', 'gamification', 'social-proof', 'pricing', 'framing', 'advertising', 'thank-you'];
        
        for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    return sectionId;
                }
            }
        }
        return 'welcome'; // Default to welcome section
    }

    /**
     * Get urgency-specific data
     */
    getUrgencyData() {
        const timerElement = document.querySelector('.countdown-timer');
        const extensionMessage = document.getElementById('extension-message');
        
        return {
            seconds_remaining: timerElement ? timerElement.textContent : 'unknown',
            had_extension: extensionMessage ? extensionMessage.style.display !== 'none' : false,
            urgency_stats: {
                viewing_count: document.querySelector('.stat') ? document.querySelector('.stat').textContent : 'unknown',
                spots_left: document.querySelectorAll('.stat')[1] ? document.querySelectorAll('.stat')[1].textContent : 'unknown'
            }
        };
    }

    /**
     * Get gamification-specific data
     */
    getGamificationData() {
        return {
            total_score: this.gamificationScore,
            player_status: this.gamificationStatus,
            score_display: document.getElementById('total-score') ? document.getElementById('total-score').textContent : '0',
            status_display: document.getElementById('player-status') ? document.getElementById('player-status').textContent : 'Select'
        };
    }

    /**
     * Get world type based on world name
     */
    getWorldType(worldName) {
        const worldTypes = {
            'Urgency World': 'urgency_scarcity',
            'Reward World': 'gamification_rewards',
            'Social World': 'social_proof_influencer',
            'Deal World': 'pricing_techniques',
            'Framing World': 'framing_anchoring',
            'Persuasion World': 'advertising_persuasive'
        };
        return worldTypes[worldName] || 'unknown';
    }

}

// Initialize event tracking when DOM is ready and Event System is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Event System to be ready
    const initEventTracker = () => {
        if (window.EventSystem && typeof trackUserEvent === 'function') {
            window.eventTracker = new EventTracker();
        } else {
            // Retry after a short delay
            setTimeout(initEventTracker, 100);
        }
    };
    
    initEventTracker();
});

