/**
 * A/B Testing System
 * Handles variant assignment with expiration (separate from event system)
 */

class ABTestingSystem {
    constructor() {
        this.userId = null;
        this.experiments = {
            "button_color_test": {
                variants: ["red", "blue", "green"],
                duration_hours: 24
            },
            "cta_text_test": {
                variants: ["urgent", "friendly", "professional"],
                duration_hours: 72
            },
            "layout_test": {
                variants: ["original", "centered", "sidebar"],
                duration_hours: 168
            },
            "pricing_display_test": {
                variants: ["original", "highlighted", "minimal"],
                duration_hours: 48
            }
        };
        
        this.initializeSystem();
    }

    /**
     * Get variant for an experiment (main function)
     * Checks cookie first, assigns new variant if expired or not found
     * All operations are non-blocking
     */
    getVariant(experimentName) {
        try {
            // Get user ID if not set
            if (!this.userId && window.UserIDSystem) {
                this.userId = window.UserIDSystem.getUserId();
            }
            
            // Check if experiment exists
            if (!this.experiments[experimentName]) {
                console.warn(`Experiment "${experimentName}" not found`);
                return null;
            }

            // Check cookie for existing assignment
            const cookieData = this.getCookieData();
            const existingAssignment = cookieData.experiments[experimentName];

            // Check if assignment exists and is not expired
            if (existingAssignment && !this.isExpired(existingAssignment.expires_at)) {
                console.log(`Using existing variant for ${experimentName}: ${existingAssignment.variant}`);
                return existingAssignment.variant;
            }

            // Assign new variant (non-blocking)
            const newVariant = this.assignNewVariant(experimentName);
            console.log(`Assigned new variant for ${experimentName}: ${newVariant}`);
            
            return newVariant;
        } catch (error) {
            console.error('Error in getVariant:', error);
            return null; // Fail gracefully
        }
    }

    /**
     * Assign a new variant for an experiment (non-blocking)
     */
    assignNewVariant(experimentName) {
        const experiment = this.experiments[experimentName];
        const variants = experiment.variants;
        
        // Randomly select a variant with equal probability
        const randomIndex = Math.floor(Math.random() * variants.length);
        const variant = variants[randomIndex];
        
        // Calculate expiration time
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + experiment.duration_hours);
        
        // Save to cookie (synchronous, fast)
        this.saveVariantToCookie(experimentName, variant, expiresAt);
        
        return variant;
    }

    /**
     * Check if a timestamp is expired
     */
    isExpired(expiresAt) {
        return new Date() > new Date(expiresAt);
    }

    /**
     * Get cookie data
     */
    getCookieData() {
        const cookieValue = this.getCookie('ab_testing_data');
        if (cookieValue) {
            try {
                return JSON.parse(cookieValue);
            } catch (error) {
                console.error('Error parsing cookie data:', error);
            }
        }
        return { experiments: {} };
    }

    /**
     * Save variant assignment to cookie
     */
    saveVariantToCookie(experimentName, variant, expiresAt) {
        const cookieData = this.getCookieData();
        cookieData.experiments[experimentName] = {
            variant: variant,
            expires_at: expiresAt.toISOString()
        };
        
        // Set cookie with 30 days expiration
        const cookieExpiry = new Date();
        cookieExpiry.setDate(cookieExpiry.getDate() + 30);
        this.setCookie('ab_testing_data', JSON.stringify(cookieData), cookieExpiry);
    }

    /**
     * Get all current assignments from cookie
     */
    getAllAssignments() {
        return this.getCookieData().experiments;
    }

    /**
     * Get experiment configuration
     */
    getExperimentConfig(experimentName) {
        return this.experiments[experimentName];
    }

    /**
     * Add new experiment configuration
     */
    addExperiment(experimentName, variants, durationHours) {
        this.experiments[experimentName] = {
            variants: variants,
            duration_hours: durationHours
        };
        console.log(`Added experiment: ${experimentName}`);
    }

    /**
     * Utility functions for cookie management
     */
    setCookie(name, value, expires) {
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Configure Supabase connection
     */
    configureSupabase(url, key) {
        this.supabaseConfig = {
            url: url,
            key: key,
            enabled: true
        };
    }

    /**
     * Initialize the system
     */
    initializeSystem() {
        // A/B Testing System initialized
    }
}

// Global instance
window.ABTestingSystem = new ABTestingSystem();