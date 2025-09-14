/**
 * User ID System
 * Generates and manages unique user IDs using GUID
 */

class UserIDSystem {
    constructor() {
        this.userId = this.getOrCreateUserId();
        this.initializeSystem();
    }

    /**
     * Generate a GUID (UUID v4)
     */
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Get or create a unique user ID using GUID
     */
    getOrCreateUserId() {
        // Try cookie first
        let userId = this.getCookie('user_id');
        
        // Fallback to localStorage if cookie fails
        if (!userId) {
            try {
                userId = localStorage.getItem('user_id');
            } catch (error) {
                // localStorage failed
            }
        }
        
        if (!userId) {
            userId = this.generateGUID();
            
            // Try to save to both cookie and localStorage
            this.setCookie('user_id', userId, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)); // 1 year
            
            try {
                localStorage.setItem('user_id', userId);
            } catch (error) {
                // localStorage save failed
            }
        }
        return userId;
    }

    /**
     * Get current user ID
     */
    getUserId() {
        return this.userId;
    }

    /**
     * Initialize the system
     */
    initializeSystem() {
        // User ID System initialized
    }

    /**
     * Utility functions for cookie management
     */
    setCookie(name, value, expires) {
        try {
            // Check if we're in a file:// protocol (local files)
            if (location.protocol === 'file:') {
                localStorage.setItem(name, value);
                return;
            }
            
            // Check if cookies are enabled
            if (!navigator.cookieEnabled) {
                localStorage.setItem(name, value);
                return;
            }
            
            // Set cookie with appropriate attributes based on protocol
            let cookieString;
            if (location.protocol === 'https:') {
                cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
            } else {
                cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
            }
            
            document.cookie = cookieString;
            
            // Verify cookie was set
            setTimeout(() => {
                const verification = this.getCookie(name);
                if (verification !== value) {
                    localStorage.setItem(name, value);
                }
            }, 100);
            
        } catch (error) {
            localStorage.setItem(name, value);
        }
    }

    getCookie(name) {
        try {
            // If file protocol, try localStorage first
            if (location.protocol === 'file:') {
                const localValue = localStorage.getItem(name);
                if (localValue) {
                    return localValue;
                }
            }
            
            if (!document.cookie) {
                return null;
            }
            
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    const value = c.substring(nameEQ.length, c.length);
                    return value;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}

// Initialize UserIDSystem when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (!window.UserIDSystem) {
        window.UserIDSystem = new UserIDSystem();
    }
});
