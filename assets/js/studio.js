// Studio Audio Player
class StudioAudioPlayer {
    constructor() {
        this.currentAudio = null;
        this.currentButton = null;
        this.audioElements = {};
        this.progressBars = {};
        this.timeDisplays = {};
        this.init();
    }

    init() {
        // Get all audio elements and their controls
        const audioElements = document.querySelectorAll('audio');
        
        audioElements.forEach(audio => {
            const audioId = audio.id.replace('audio-', '');
            this.audioElements[audioId] = audio;
            
            // Get corresponding controls
            const playBtn = document.querySelector(`[data-audio="${audioId}"]`);
            const progressFill = document.querySelector(`.progress-fill[data-audio="${audioId}"]`);
            const timeDisplay = document.querySelector(`.time-display[data-audio="${audioId}"]`);
            
            this.progressBars[audioId] = progressFill;
            this.timeDisplays[audioId] = timeDisplay;
            
            // Add event listeners
            if (playBtn) {
                playBtn.addEventListener('click', () => this.togglePlay(audioId, playBtn));
            }
            
            if (progressFill) {
                const progressBar = progressFill.parentElement;
                progressBar.addEventListener('click', (e) => this.seekTo(audioId, e));
            }
            
            // Audio event listeners
            audio.addEventListener('loadedmetadata', () => this.updateDuration(audioId));
            audio.addEventListener('timeupdate', () => this.updateProgress(audioId));
            audio.addEventListener('ended', () => this.onAudioEnded(audioId, playBtn));
            audio.addEventListener('error', (e) => this.onAudioError(audioId, e));
        });
    }

    togglePlay(audioId, button) {
        const audio = this.audioElements[audioId];
        
        if (!audio) return;
        
        // If another audio is playing, pause it
        if (this.currentAudio && this.currentAudio !== audio) {
            this.pauseCurrentAudio();
        }
        
        if (audio.paused) {
            audio.play().then(() => {
                this.currentAudio = audio;
                this.currentButton = button;
                this.updateButtonState(button, true);
            }).catch(error => {
                console.error('Error playing audio:', error);
                this.onAudioError(audioId, error);
            });
        } else {
            audio.pause();
            this.updateButtonState(button, false);
            if (this.currentAudio === audio) {
                this.currentAudio = null;
                this.currentButton = null;
            }
        }
    }

    pauseCurrentAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            if (this.currentButton) {
                this.updateButtonState(this.currentButton, false);
            }
        }
    }

    updateButtonState(button, isPlaying) {
        const playIcon = button.querySelector('.play-icon');
        if (isPlaying) {
            button.classList.add('playing');
            playIcon.textContent = '⏸';
        } else {
            button.classList.remove('playing');
            playIcon.textContent = '▶';
        }
    }

    seekTo(audioId, event) {
        const audio = this.audioElements[audioId];
        const progressBar = event.currentTarget;
        
        if (!audio || !progressBar) return;
        
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * audio.duration;
        
        audio.currentTime = newTime;
    }

    updateProgress(audioId) {
        const audio = this.audioElements[audioId];
        const progressFill = this.progressBars[audioId];
        const timeDisplay = this.timeDisplays[audioId];
        
        if (!audio || !progressFill) return;
        
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percentage}%`;
        
        if (timeDisplay) {
            const currentTime = this.formatTime(audio.currentTime);
            const duration = this.formatTime(audio.duration);
            timeDisplay.textContent = `${currentTime} / ${duration}`;
        }
    }

    updateDuration(audioId) {
        const audio = this.audioElements[audioId];
        const timeDisplay = this.timeDisplays[audioId];
        
        if (audio && timeDisplay) {
            const duration = this.formatTime(audio.duration);
            timeDisplay.textContent = `0:00 / ${duration}`;
        }
    }

    onAudioEnded(audioId, button) {
        this.updateButtonState(button, false);
        this.currentAudio = null;
        this.currentButton = null;
        
        // Reset progress
        const progressFill = this.progressBars[audioId];
        if (progressFill) {
            progressFill.style.width = '0%';
        }
    }

    onAudioError(audioId, error) {
        console.error(`Audio error for ${audioId}:`, error);
        
        // Show user-friendly error message
        const timeDisplay = this.timeDisplays[audioId];
        if (timeDisplay) {
            timeDisplay.textContent = 'Error loading audio';
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio player
    new StudioAudioPlayer();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states for audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.addEventListener('loadstart', function() {
            const audioId = this.id.replace('audio-', '');
            const timeDisplay = document.querySelector(`.time-display[data-audio="${audioId}"]`);
            if (timeDisplay) {
                timeDisplay.textContent = 'Loading...';
            }
        });
    });
});
