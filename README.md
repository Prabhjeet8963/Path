# Nitnem - Sikh Prayer Playlist

A responsive web application featuring a curated playlist of 7 Sikh prayers with custom playback behavior and smooth transitions.

## Features

- **Sequential Video Playback**: Automatically plays videos in sequence with smooth transitions
- **Custom Controls**: Play, Stop, Previous, and Next buttons for full control
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with persistent preference storage
- **Video Progress Tracking**: Visual indicators for completed, current, and upcoming videos
- **Auto-Stop**: Playback stops after the final video (no looping)
- **Modern UI**: Clean, minimalist design with smooth animations
- **Offline Support**: Works offline after initial visit

## Pages & Structure

### Home Page (`index.html`)
- **Title:** Nitnem  
- **Button:** Arambh/Start → Navigates to Playlist Page  
- **Theme:** Toggle between Light/Dark Mode  

### Playlist Page (`playlist.html`)
- Embedded YouTube player with custom controls  
- Sidebar with 7 Sikh prayers in this order:
  1. Japji Sahib  
  2. Jaap Sahib  
  3. Tav Prashad Savaiye  
  4. Chaupai Sahib  
  5. Anand Sahib  
  6. Rehras Sahib  
  7. Simran  
- Navigation controls
- Completion message after final video

## Controls

- **Play**: Start the sequence from the beginning or current video
- **Stop**: Halt playback at any point
- **Previous**: Navigate to the previous video
- **Next**: Navigate to the next video
- **Video List**: Click any video to jump directly to it

## Tech Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **YouTube IFrame API**: For video embedding and control
- **Inter Font**: Clean, modern typography

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Prabhjeet8963/Path.git
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
4. Your site will be available at `https://prabhjeet8963.github.io/Path`

## Design Features

- **Responsive Grid Layout**: Adapts to different screen sizes
- **Smooth Transitions**: CSS animations for video changes and interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Theme Persistence**: Remembers user's theme preference
- **Loading States**: Visual feedback for user interactions

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

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

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Nitnem** - Sikh Prayer Playlist 