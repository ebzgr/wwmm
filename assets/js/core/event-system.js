/**
 * Event System
 * Tracks and sends user interaction events to database
 */

class EventSystem {
    constructor() {
        this.userId = null;
        this.sessionId = this.generateSessionId();
        this.eventBuffer = [];
        this.batchSize = 10;
        this.batchDelay = 30000; // 30 seconds
        this.supabaseConfig = {
            url: '',
            key: '',
            enabled: false
        };
        
        this.initializeSystem();
    }

    /**
     * Generate a unique session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Configure Supabase connection
     */
    configureSupabase(url, key) {
        this.supabaseConfig.url = url;
        this.supabaseConfig.key = key;
        this.supabaseConfig.enabled = true;
    }

    /**
     * Track an event (completely non-blocking)
     */
    trackEvent(eventType, eventData = {}) {
        try {
            // Get user ID if not set
            if (!this.userId && window.UserIDSystem) {
                this.userId = window.UserIDSystem.getUserId();
            }
            
            const event = {
                user_id: this.userId,
                session_id: this.sessionId,
                event_type: eventType,
                event_data: eventData,
                device_type: this.getDeviceType(),
                browser: this.getBrowser(),
                user_agent: navigator.userAgent
            };

            // Add to buffer (synchronous, fast)
            this.eventBuffer.push(event);

            // Send batch if buffer is full (asynchronous, non-blocking)
            if (this.eventBuffer.length >= this.batchSize) {
                setTimeout(() => {
                    this.sendEventBatch();
                }, 0);
            }
        } catch (error) {
            console.error('❌ Error tracking event:', error);
            // Fail silently - don't block user experience
        }
    }

    /**
     * Send event batch to database
     */
    async sendEventBatch() {
        if (this.eventBuffer.length === 0 || !this.supabaseConfig.enabled) {
            return;
        }

        const batch = [...this.eventBuffer];
        this.eventBuffer = [];

        try {
            // Send events one by one since Supabase REST API doesn't support batch inserts
            let successCount = 0;
            let failedEvents = [];

            for (const event of batch) {
                try {
                    const response = await fetch(`${this.supabaseConfig.url}/rest/v1/events`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': this.supabaseConfig.key,
                            'Authorization': `Bearer ${this.supabaseConfig.key}`,
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify(event)
                    });

                    if (response.ok) {
                        successCount++;
                    } else {
                        failedEvents.push(event);
                    }
                } catch (error) {
                    failedEvents.push(event);
                }
            }
            
            if (failedEvents.length > 0) {
                // Re-add failed events to buffer
                this.eventBuffer.unshift(...failedEvents);
            }
        } catch (error) {
            // Re-add all events to buffer
            this.eventBuffer.unshift(...batch);
        }
    }

    /**
     * Start batch processor for events
     */
    startBatchProcessor() {
        setInterval(() => {
            if (this.eventBuffer.length > 0) {
                this.sendEventBatch();
            }
        }, this.batchDelay);
    }

    /**
     * Get device type (mobile, tablet, desktop)
     */
    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
        
        if (isTablet) return 'tablet';
        if (isMobile) return 'mobile';
        return 'desktop';
    }

    /**
     * Get browser name
     */
    getBrowser() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
        
        return 'Unknown';
    }

    /**
     * Initialize the system
     */
    initializeSystem() {
        // Don't start batch processor here - it will be started after Supabase is configured
    }

    /**
     * Get current buffer status
     */
    getBufferStatus() {
        return {
            bufferSize: this.eventBuffer.length,
            events: this.eventBuffer
        };
    }
}

// Global instance
window.EventSystem = new EventSystem();
