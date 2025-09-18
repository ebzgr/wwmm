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

// Music Player for the music section
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('music-audio');
        this.currentTrack = 0;
        this.isPlaying = false;
        this.tracks = [
            {
                title: 'Whispers of Lights',
                artist: 'WWMM Collective',
                audio: 'assets/music/Wispers of lights.mp3',
                artwork: 'assets/music/Wispers of lights.png',
                duration: '3:45'
            },
            {
                title: '2 Be Free',
                artist: 'WWMM Collective',
                audio: 'assets/music/2 be free.mp3',
                artwork: 'assets/music/2 be free.png',
                duration: '3:20'
            },
            {
                title: 'The Gilded Whisper',
                artist: 'WWMM Collective',
                audio: 'assets/music/The Gilded Whisper.mp3',
                artwork: 'assets/music/The Gilded Whisper.png',
                duration: '4:15'
            },
            {
                title: 'Illusion of Victory',
                artist: 'WWMM Collective',
                audio: 'assets/music/Illusion of victory.mp3',
                artwork: 'assets/music/illusion of victory.png',
                duration: '2:30'
            }
        ];
        this.init();
    }

    init() {
        // Get DOM elements
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.progressFill = document.getElementById('music-progress');
        this.timeDisplay = document.getElementById('music-time');
        this.currentTitle = document.getElementById('current-title');
        this.currentArtist = document.getElementById('current-artist');
        this.currentArtwork = document.getElementById('current-artwork');
        this.playOverlay = document.getElementById('play-overlay');

        // Add event listeners
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.playOverlay.addEventListener('click', () => this.togglePlayPause());

        // Progress bar click
        const progressBar = this.progressFill.parentElement;
        progressBar.addEventListener('click', (e) => this.seekTo(e));

        // Audio event listeners
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());

        // Track item clicks
        document.querySelectorAll('.track-item').forEach((item, index) => {
            item.addEventListener('click', () => this.playTrack(index));
        });

        // Initialize with first track
        this.loadTrack(0);
    }

    loadTrack(trackIndex) {
        if (trackIndex < 0 || trackIndex >= this.tracks.length) return;

        this.currentTrack = trackIndex;
        const track = this.tracks[trackIndex];

        // Update audio source
        this.audio.src = track.audio;
        this.audio.load();

        // Update UI
        this.currentTitle.textContent = track.title;
        this.currentArtist.textContent = track.artist;
        this.currentArtwork.src = track.artwork;

        // Update track items
        document.querySelectorAll('.track-item').forEach((item, index) => {
            item.classList.toggle('active', index === trackIndex);
        });

        // Reset progress
        this.progressFill.style.width = '0%';
        this.timeDisplay.textContent = '0:00 / 0:00';
    }

    playTrack(trackIndex) {
        this.loadTrack(trackIndex);
        this.play();
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    previousTrack() {
        const prevIndex = this.currentTrack > 0 ? this.currentTrack - 1 : this.tracks.length - 1;
        this.playTrack(prevIndex);
    }

    nextTrack() {
        const nextIndex = this.currentTrack < this.tracks.length - 1 ? this.currentTrack + 1 : 0;
        this.playTrack(nextIndex);
    }

    seekTo(event) {
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audio.duration;

        this.audio.currentTime = newTime;
    }

    updateProgress() {
        if (this.audio.duration) {
            const percentage = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = `${percentage}%`;

            const currentTime = this.formatTime(this.audio.currentTime);
            const duration = this.formatTime(this.audio.duration);
            this.timeDisplay.textContent = `${currentTime} / ${duration}`;
        }
    }

    updateDuration() {
        const duration = this.formatTime(this.audio.duration);
        this.timeDisplay.textContent = `0:00 / ${duration}`;
    }

    updatePlayButton() {
        const playIcon = this.playPauseBtn.querySelector('.play-icon');
        const overlayIcon = this.playOverlay.querySelector('.play-icon-large');
        
        if (this.isPlaying) {
            this.playPauseBtn.classList.add('playing');
            playIcon.textContent = '⏸';
            overlayIcon.textContent = '⏸';
            this.playOverlay.style.opacity = '0.7';
        } else {
            this.playPauseBtn.classList.remove('playing');
            playIcon.textContent = '▶';
            overlayIcon.textContent = '▶';
            this.playOverlay.style.opacity = '0';
        }
    }

    onPlay() {
        this.isPlaying = true;
        this.updatePlayButton();
    }

    onPause() {
        this.isPlaying = false;
        this.updatePlayButton();
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
    
    // Initialize music player
    new MusicPlayer();
    
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
