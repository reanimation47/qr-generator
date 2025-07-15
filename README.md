# QR Generator

A simple, elegant QR code generator web application built with pure HTML, CSS, and JavaScript. Features a minimal dark pastel design and supports multiple download formats.

## ✨ Features

- **Clean, Minimal Interface** - Dark pastel theme with responsive design
- **Multiple Export Formats** - Download as PNG, SVG, or PDF
- **Real-time Generation** - QR codes generate as you type (debounced)
- **Responsive Design** - Works perfectly on mobile and desktop
- **Keyboard Shortcuts** - Ctrl/Cmd+Enter to generate, Escape to clear
- **Size Options** - Choose from 256x256, 512x512, or 1024x1024 pixels
- **No Dependencies** - Pure client-side code, no server required

## 🚀 Live Demo

Visit the live application: [Your GitHub Pages URL]

## 📱 Screenshots

*Add screenshots here when deployed*

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **JavaScript ES6+** - Modern JavaScript with classes and async/await
- **QRCode.js** - QR code generation library
- **jsPDF** - PDF generation library

## 🎨 Design Features

- **Dark Pastel Color Scheme** - Easy on the eyes
- **Smooth Animations** - Subtle transitions and micro-interactions
- **Mobile-First** - Responsive design that works on all devices
- **Accessibility** - Proper focus states and keyboard navigation
- **Modern Typography** - System font stack for optimal readability

## 📦 Installation & Setup

### Option 1: GitHub Pages (Recommended)

1. Fork this repository
2. Go to your repository settings
3. Scroll down to "Pages" section
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your app will be available at `https://yourusername.github.io/qr-generator`

### Option 2: Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/qr-generator.git
   cd qr-generator
   ```

2. Open `index.html` in your browser or serve with a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser to `http://localhost:8000`

## 🎯 Usage

1. **Enter Content** - Type any text, URL, or data into the input field
2. **Generate** - Click "Generate QR Code" or use Ctrl/Cmd+Enter
3. **Customize** - Choose your preferred size from the dropdown
4. **Download** - Select your format:
   - **PNG** - For web use, social media, quick sharing
   - **SVG** - For print, logos, scalable graphics
   - **PDF** - For documents, professional use
5. **Clear** - Use "Clear & Start Over" or press Escape to reset

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Generate QR code
- `Escape` - Clear and start over
- `Tab` - Navigate between elements

## 🔧 Customization

### Colors
Edit the CSS custom properties in `style.css`:
```css
:root {
    --bg-primary: #1a1a1a;
    --accent-primary: #8b7cf8;
    /* ... other colors */
}
```

### QR Code Options
Modify the QR generation settings in `script.js`:
```javascript
await QRCode.toCanvas(this.qrCanvas, this.currentQRData, {
    width: this.currentSize,
    errorCorrectionLevel: 'M', // L, M, Q, H
    margin: 2,
    // ... other options
});
```

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [QRCode.js](https://github.com/davidshimjs/qrcode) - QR code generation
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- Design inspiration from modern web applications

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/qr-generator/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible including browser version and steps to reproduce

---

**Built with ❤️ using pure HTML, CSS & JavaScript**
