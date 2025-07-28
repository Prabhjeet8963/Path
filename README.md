# Path - Curated Flow of Knowledge

A responsive web application featuring a curated playlist of 6 YouTube videos with custom playback behavior and smooth transitions.

## 🎯 Features

- **Sequential Video Playback**: Automatically plays videos in sequence with smooth transitions
- **Custom Controls**: Play, Stop, Previous, and Next buttons for full control
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with persistent preference storage
- **Video Progress Tracking**: Visual indicators for completed, current, and upcoming videos
- **Auto-Stop**: Playback stops after the final video (no looping)
- **Modern UI**: Clean, minimalist design with smooth animations

## 📄 Pages

### Home Page (`index.html`)
- Welcome message with gradient title
- "Start Journey" button to navigate to playlist
- Theme toggle for dark/light mode

### Playlist Page (`playlist.html`)
- Embedded YouTube player with custom controls
- Video playlist sidebar with progress indicators
- Full navigation controls
- Completion message after final video

## ▶️ Video Playlist

The application features 7 carefully curated Sikh prayers in this specific order:

1. **Japji Sahib**: The opening prayer of the Guru Granth Sahib
2. **Jaap Sahib**: A composition by Guru Gobind Singh Ji  
3. **Tav Parshad Savaiye**: Sacred verses from the Guru Granth Sahib
4. **Chaupai Sahib**: A prayer for protection and strength
5. **Anand Sahib**: The prayer of bliss and joy
6. **Ardas**: The Sikh prayer of supplication
7. **Simran**: Meditation and remembrance of the Divine

## 🧭 Controls

- **Play**: Start the sequence from the beginning or current video
- **Stop**: Halt playback at any point
- **Previous**: Navigate to the previous video
- **Next**: Navigate to the next video
- **Video List**: Click any video to jump directly to it

## 💻 Tech Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **YouTube IFrame API**: For video embedding and control
- **Inter Font**: Clean, modern typography

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Path.git
cd Path
```

2. Open `index.html` in your web browser or serve with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

### Deployment

The application is designed to be deployed on GitHub Pages:

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your site will be available at `https://yourusername.github.io/Path`

## 🎨 Design Features

- **Responsive Grid Layout**: Adapts to different screen sizes
- **Smooth Transitions**: CSS animations for video changes and interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Theme Persistence**: Remembers user's theme preference
- **Loading States**: Visual feedback for user interactions

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔧 Customization

### Adding Videos

To modify the video playlist, edit the `videos` array in `playlist.js`:

```javascript
this.videos = [
    {
        id: 'YOUR_VIDEO_ID',
        title: 'Your Video Title',
        url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID'
    },
    // ... more videos
];
```

### Styling

The application uses CSS custom properties for easy theming. Modify the `:root` variables in `styles.css` to change colors and styling.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Path** - Where knowledge flows seamlessly. 🌟 