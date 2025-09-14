/**
 * Page Load Tracking System
 * Tracks world visits when pages load instead of on button clicks
 */

class PageLoadTracker {
    constructor() {
        this.worldMappings = {
            'index.html': {
                world_name: 'main_page',
                world_type: 'homepage',
                display_name: 'Main Page'
            },
            'about.html': {
                world_name: 'about_page',
                world_type: 'about',
                display_name: 'About Page'
            },
            'urgency-world.html': {
                world_name: 'urgency_world',
                world_type: 'urgency_scarcity',
                display_name: 'Urgency World'
            },
            'reward-world.html': {
                world_name: 'gamification_world',
                world_type: 'rewards_gamification',
                display_name: 'Reward World'
            },
            'social-world.html': {
                world_name: 'social_world',
                world_type: 'social_proof_influencer',
                display_name: 'Social World'
            },
            'deal-world.html': {
                world_name: 'deal_world',
                world_type: 'pricing_techniques',
                display_name: 'Deal World'
            },
            'framing-world.html': {
                world_name: 'framing_world',
                world_type: 'framing_anchoring',
                display_name: 'Framing World'
            },
            'persuasion-world.html': {
                world_name: 'persuasion_world',
                world_type: 'advertising_persuasive',
                display_name: 'Persuasion World'
            }
        };
        
        this.initializeTracking();
    }

    /**
     * Initialize page load tracking
     */
    initializeTracking() {
        // Wait for systems to be ready
        const initTracking = () => {
            if (window.EventSystem && window.UserIDSystem && typeof trackUserEvent === 'function') {
                this.trackPageLoad();
            } else {
                setTimeout(initTracking, 100);
            }
        };
        
        initTracking();
    }

    /**
     * Track the current page load
     */
    trackPageLoad() {
        try {
            const currentPage = this.getCurrentPageName();
            const worldInfo = this.worldMappings[currentPage];
            
            if (worldInfo) {
                // Get additional context data based on world type
                const contextData = this.getContextData(worldInfo.world_type);
                
                // Format event data to match other events (like movement_by_map)
                const eventData = {
                    world_name: worldInfo.world_name,
                    world_type: worldInfo.world_type,
                    display_name: worldInfo.display_name,
                    page_url: window.location.href,
                    ...contextData
                };
                
                trackUserEvent('world_visit', eventData);
                
                // Force immediate batch send to ensure event is sent
                if (window.EventSystem) {
                    setTimeout(() => {
                        window.EventSystem.sendEventBatch();
                    }, 100);
                }
            }
        } catch (error) {
            console.error('❌ Error tracking page load:', error);
        }
    }

    /**
     * Get current page name from URL
     */
    getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename || 'index.html';
    }

    /**
     * Get context data based on world type
     */
    getContextData(worldType) {
        const contextData = {};
        
        switch (worldType) {
            case 'urgency_scarcity':
                contextData.seconds_remaining = this.getUrgencyData();
                break;
            case 'rewards_gamification':
                contextData.gamification_data = this.getGamificationData();
                break;
            case 'homepage':
                contextData.main_page_visit = true;
                break;
            case 'about':
                contextData.about_page_visit = true;
                break;
            default:
                // No additional context for other worlds
                break;
        }
        
        return contextData;
    }

    /**
     * Get urgency data (if available)
     */
    getUrgencyData() {
        try {
            const countdownElement = document.querySelector('.countdown-timer');
            if (countdownElement) {
                const timeText = countdownElement.textContent;
                const [minutes, seconds] = timeText.split(':').map(Number);
                return (minutes * 60) + seconds;
            }
        } catch (error) {
            // Could not get urgency data
        }
        return null;
    }

    /**
     * Get gamification data (if available)
     */
    getGamificationData() {
        try {
            const scoreElement = document.getElementById('total-score');
            const statusElement = document.getElementById('player-status');
            
            return {
                total_score: scoreElement ? scoreElement.textContent : '0',
                player_status: statusElement ? statusElement.textContent : 'Select'
            };
        } catch (error) {
            // Could not get gamification data
        }
        return null;
    }
}

// Initialize page load tracking when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.pageLoadTracker = new PageLoadTracker();
});
