/**
 * System Configuration
 * Configure your Supabase connection for the Event System
 */

// Supabase Configuration
// Get these values from your Supabase project settings
const SUPABASE_CONFIG = {
    url: "https://eoiawlbvieyxfkmgrnxg.supabase.co", // e.g., 'https://your-project.supabase.co'
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaWF3bGJ2aWV5eGZrbWdybnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTUxODMsImV4cCI6MjA3MzQzMTE4M30.YkOtMWn2Hbz7Jcakk0i_K956B5NOe1CRZNpbzCJNyRY", // Your anon/public key
};

// Initialize systems when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize systems (UserIDSystem is already created globally)
    if (!window.UserIDSystem) {
        window.UserIDSystem = new UserIDSystem();
    }
    window.ABTestingSystem = new ABTestingSystem();
    window.EventSystem = new EventSystem();

    // Configure Supabase for systems that need it
    window.ABTestingSystem.configureSupabase(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
    window.EventSystem.configureSupabase(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

    // Start batch processors
    window.EventSystem.startBatchProcessor();
});

// Public API functions

/**
 * Get user ID
 * Usage: const userId = getUserId();
 */
function getUserId() {
    return window.UserIDSystem.getUserId();
}

/**
 * Get variant for an experiment
 * Usage: const variant = getExperimentVariant('button_color_test');
 */
function getExperimentVariant(experimentName) {
    return window.ABTestingSystem.getVariant(experimentName);
}

/**
 * Track an event
 * Usage: trackUserEvent('button_click', { buttonId: 'cta-button', page: 'home' });
 */
function trackUserEvent(eventType, eventData = {}) {
    window.EventSystem.trackEvent(eventType, eventData);
}

/**
 * Get all current A/B test assignments (for debugging)
 */
function getCurrentAssignments() {
    return window.ABTestingSystem.getAllAssignments();
}

/**
 * Get event buffer status (for debugging)
 */
function getEventBufferStatus() {
    return window.EventSystem.getBufferStatus();
}

/**
 * Add a new experiment dynamically
 * Usage: addNewExperiment('my_test', ['option1', 'option2'], 48);
 */
function addNewExperiment(experimentName, variants, durationHours) {
    window.ABTestingSystem.addExperiment(experimentName, variants, durationHours);
}