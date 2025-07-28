// YouTube Playlist Manager
class YouTubePlaylist {
    constructor() {
        this.videos = [
            {
                id: 'FJlBFhE0J4w',
                title: '1. Japji Sahib',
                url: 'https://www.youtube.com/watch?v=FJlBFhE0J4w'
            },
            {
                id: 'MbC9pGsY2Ag',
                title: '2. Jaap Sahib',
                url: 'https://www.youtube.com/watch?v=MbC9pGsY2Ag'
            },
            {
                id: 'Gks0Q9v1aRI',
                title: '3. Tav Parshad Savaiye',
                url: 'https://www.youtube.com/watch?v=Gks0Q9v1aRI'
            },
            {
                id: 'B1pYt8HaEBY',
                title: '4. Chaupai Sahib',
                url: 'https://www.youtube.com/watch?v=B1pYt8HaEBY'
            },
            {
                id: '67zW9q-_LYQ',
                title: '5. Anand Sahib',
                url: 'https://www.youtube.com/watch?v=67zW9q-_LYQ'
            },
            {
                id: 'RRt5f0eAp4I',
                title: '6. Rehras Sahib',
                url: 'https://www.youtube.com/watch?v=RRt5f0eAp4I'
            },
            {
                id: 'gyA4SukHK-E',
                title: '7. Simran',
                url: 'https://www.youtube.com/watch?v=gyA4SukHK-E'
            }
        ];
        
        this.currentVideoIndex = 0;
        this.player = null;
        this.isPlaying = false;
        this.isAutoPlayEnabled = false;
        
        this.init();
    }

    init() {
        this.setupYouTubeAPI();
        this.setupEventListeners();
        this.renderVideoList();
        this.updateControls();
    }

    setupYouTubeAPI() {
        // YouTube IFrame API will call this function when ready
        window.onYouTubeIframeAPIReady = () => {
            this.createPlayer();
        };

        // Load YouTube IFrame API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            this.createPlayer();
        }
    }

    createPlayer() {
        this.player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: this.videos[0].id,
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'rel': 0,
                'showinfo': 0,
                'modestbranding': 1,
                'fs': 1
            },
            events: {
                'onReady': this.onPlayerReady.bind(this),
                'onStateChange': this.onPlayerStateChange.bind(this),
                'onError': this.onPlayerError.bind(this)
            }
        });
    }

    onPlayerReady(event) {
        console.log('YouTube player ready');
        this.updateVideoList();
    }

    onPlayerStateChange(event) {
        // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
        
        if (event.data === YT.PlayerState.ENDED) {
            this.onVideoEnded();
        } else if (event.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.updateControls();
        } else if (event.data === YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            this.updateControls();
        }
    }

    onPlayerError(event) {
        console.error('YouTube player error:', event.data);
        // Try to load next video on error
        this.nextVideo();
    }

    onVideoEnded() {
        this.markVideoAsCompleted(this.currentVideoIndex);
        
        if (this.currentVideoIndex < this.videos.length - 1) {
            // Auto-play next video if enabled
            if (this.isAutoPlayEnabled) {
                setTimeout(() => {
                    this.nextVideo();
                }, 1000);
            } else {
                this.isPlaying = false;
                this.updateControls();
            }
        } else {
            // Last video ended - stop playback
            this.isPlaying = false;
            this.isAutoPlayEnabled = false;
            this.updateControls();
            this.showCompletionMessage();
        }
    }

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => this.playSequence());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopPlayback());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousVideo());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextVideo());
    }

    playSequence() {
        if (this.currentVideoIndex === this.videos.length - 1 && this.isPlaying) {
            // If we're at the last video and it's playing, restart from beginning
            this.currentVideoIndex = 0;
            this.loadVideo(0);
        }
        
        this.isAutoPlayEnabled = true;
        this.isPlaying = true;
        this.updateControls();
        
        if (this.player && this.player.playVideo) {
            this.player.playVideo();
        }
    }

    stopPlayback() {
        this.isAutoPlayEnabled = false;
        this.isPlaying = false;
        
        if (this.player && this.player.pauseVideo) {
            this.player.pauseVideo();
        }
        
        this.updateControls();
    }

    previousVideo() {
        if (this.currentVideoIndex > 0) {
            this.currentVideoIndex--;
            this.loadVideo(this.currentVideoIndex);
        }
    }

    nextVideo() {
        if (this.currentVideoIndex < this.videos.length - 1) {
            this.currentVideoIndex++;
            this.loadVideo(this.currentVideoIndex);
        }
    }

    loadVideo(index) {
        if (this.player && this.player.loadVideoById) {
            this.currentVideoIndex = index;
            this.player.loadVideoById(this.videos[index].id);
            this.updateVideoList();
            this.updateControls();
        }
    }

    renderVideoList() {
        const videoList = document.getElementById('videoList');
        videoList.innerHTML = '';
        
        this.videos.forEach((video, index) => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.dataset.index = index;
            
            videoItem.innerHTML = `
                <div class="video-number">Video ${index + 1}</div>
                <div class="video-title">${video.title}</div>
            `;
            
            videoItem.addEventListener('click', () => {
                this.loadVideo(index);
            });
            
            videoList.appendChild(videoItem);
        });
    }

    updateVideoList() {
        const videoItems = document.querySelectorAll('.video-item');
        
        videoItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');
            
            if (index === this.currentVideoIndex) {
                item.classList.add('active');
            } else if (index < this.currentVideoIndex) {
                item.classList.add('completed');
            }
        });
    }

    markVideoAsCompleted(index) {
        const videoItems = document.querySelectorAll('.video-item');
        if (videoItems[index]) {
            videoItems[index].classList.add('completed');
        }
    }

    updateControls() {
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Update play button text
        if (this.isPlaying) {
            playBtn.textContent = 'Playing...';
            playBtn.disabled = true;
        } else {
            playBtn.textContent = 'Play';
            playBtn.disabled = false;
        }
        
        // Update navigation buttons
        prevBtn.disabled = this.currentVideoIndex === 0;
        nextBtn.disabled = this.currentVideoIndex === this.videos.length - 1;
        
        // Update stop button
        stopBtn.disabled = !this.isPlaying && !this.isAutoPlayEnabled;
    }

    showCompletionMessage() {
        const playerContainer = document.getElementById('player');
        const completionDiv = document.createElement('div');
        completionDiv.className = 'completion-message';
        completionDiv.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                text-align: center;
                padding: 2rem;
                background: var(--bg-secondary);
                border-radius: 12px;
            ">
                <h2 style="color: var(--accent-color); margin-bottom: 1rem;">Journey Complete! 🎉</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    You've successfully completed all videos in the Path playlist.
                </p>
                <button onclick="location.reload()" style="
                    background: var(--accent-color);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                ">Restart Journey</button>
            </div>
        `;
        
        playerContainer.innerHTML = '';
        playerContainer.appendChild(completionDiv);
    }
}

// Initialize playlist when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new YouTubePlaylist();
});

// Theme management for playlist page
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
}); 