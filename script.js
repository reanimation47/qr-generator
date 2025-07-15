// QR Generator Application
class QRGenerator {
    constructor() {
        this.initializeElements();
        this.setMobileDefaults();
        this.bindEvents();
        this.currentQRData = null;
        this.currentSize = this.getDefaultSize();
        this.checkLibraries();
    }

    // Detect mobile devices and set appropriate defaults
    setMobileDefaults() {
        this.isMobile = this.detectMobile();
        console.log('Device type:', this.isMobile ? 'Mobile' : 'Desktop');
        
        // Set default size based on device type
        const defaultSize = this.getDefaultSize();
        if (this.sizeSelect) {
            this.sizeSelect.value = defaultSize;
        }
    }

    // Detect if user is on mobile device
    detectMobile() {
        // Multiple detection methods for better accuracy
        const userAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const screenSize = window.innerWidth <= 768;
        const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return userAgent || (screenSize && touchDevice);
    }

    // Get appropriate default size based on device
    getDefaultSize() {
        return this.isMobile ? 256 : 512;
    }

    checkLibraries() {
        // Check if QRious library is loaded
        if (typeof QRious === 'undefined') {
            console.error('QRious library not loaded');
            this.showError('QR Code library failed to load. Please refresh the page.');
            return false;
        }

        // Check if jsPDF library is loaded
        if (typeof window.jspdf === 'undefined') {
            console.warn('jsPDF library not loaded - PDF downloads will be disabled');
            if (this.downloadPdfBtn) {
                this.downloadPdfBtn.disabled = true;
                this.downloadPdfBtn.title = 'PDF library not loaded';
            }
        }

        console.log('Libraries loaded successfully');
        return true;
    }

    initializeElements() {
        // Input elements
        this.qrInput = document.getElementById('qr-input');
        this.generateBtn = document.getElementById('generate-btn');
        this.btnText = this.generateBtn.querySelector('.btn-text');
        this.loadingSpinner = this.generateBtn.querySelector('.loading-spinner');
        
        // Display elements
        this.qrDisplay = document.getElementById('qr-display');
        this.qrCanvas = document.getElementById('qr-canvas');
        this.qrSvg = document.getElementById('qr-svg');
        
        // Download elements
        this.downloadPngBtn = document.getElementById('download-png');
        this.downloadSvgBtn = document.getElementById('download-svg');
        this.downloadPdfBtn = document.getElementById('download-pdf');
        this.sizeSelect = document.getElementById('qr-size');
        this.clearBtn = document.getElementById('clear-btn');
    }

    bindEvents() {
        // Generate QR code
        this.generateBtn.addEventListener('click', () => this.generateQR());
        this.qrInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateQR();
            }
        });

        // Download events
        this.downloadPngBtn.addEventListener('click', () => this.downloadPNG());
        this.downloadSvgBtn.addEventListener('click', () => this.downloadSVG());
        this.downloadPdfBtn.addEventListener('click', () => this.downloadPDF());
        
        // Size change
        this.sizeSelect.addEventListener('change', () => this.updateSize());
        
        // Clear functionality
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        // Real-time generation (debounced)
        let debounceTimer;
        this.qrInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (this.qrInput.value.trim()) {
                    this.generateQR();
                }
            }, 500);
        });
    }

    async generateQR() {
        const text = this.qrInput.value.trim();
        
        if (!text) {
            this.showError('Please enter some text or URL');
            return;
        }

        // Check if libraries are available before proceeding
        if (typeof QRious === 'undefined') {
            console.error('QRious library not available');
            this.showError('QR Code library not loaded. Please refresh the page.');
            return;
        }

        console.log('Generating QR code for:', text);
        this.showLoading(true);

        try {
            // Store current data
            this.currentQRData = text;
            this.currentSize = parseInt(this.sizeSelect.value);
            console.log('QR size:', this.currentSize);

            // Generate canvas version for PNG download
            console.log('Generating canvas...');
            await this.generateCanvas();
            console.log('Canvas generated successfully');
            
            // Generate SVG version for SVG download
            console.log('Generating SVG...');
            await this.generateSVG();
            console.log('SVG generated successfully');
            
            // Show the QR display section
            this.qrDisplay.style.display = 'block';
            this.qrDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            console.log('QR code generation completed successfully');
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                data: this.currentQRData,
                size: this.currentSize
            });
            this.showError(`Failed to generate QR code: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    async generateCanvas() {
        try {
            console.log('Canvas element:', this.qrCanvas);
            console.log('Data to encode:', this.currentQRData);
            
            // Create QRious instance for canvas
            const qr = new QRious({
                element: this.qrCanvas,
                value: this.currentQRData,
                size: this.currentSize,
                level: 'M',
                background: '#FFFFFF',
                foreground: '#000000'
            });
            
            // Show canvas, hide SVG
            this.qrCanvas.style.display = 'block';
            this.qrSvg.style.display = 'none';
        } catch (error) {
            console.error('Canvas generation error:', error);
            throw new Error(`Canvas generation failed: ${error.message}`);
        }
    }

    async generateSVG() {
        try {
            console.log('Generating SVG for data:', this.currentQRData);
            
            // Create a temporary canvas for SVG generation
            const tempCanvas = document.createElement('canvas');
            const qr = new QRious({
                element: tempCanvas,
                value: this.currentQRData,
                size: this.currentSize,
                level: 'M',
                background: '#FFFFFF',
                foreground: '#000000'
            });
            
            // Convert canvas to SVG
            const svgString = this.canvasToSVG(tempCanvas, this.currentSize);
            
            console.log('SVG generated, length:', svgString.length);
            
            // Store SVG for download
            this.currentSVG = svgString;
        } catch (error) {
            console.error('SVG generation error:', error);
            throw new Error(`SVG generation failed: ${error.message}`);
        }
    }

    canvasToSVG(canvas, size) {
        // Get canvas image data
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Create SVG string
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
        svg += `<rect width="${size}" height="${size}" fill="#FFFFFF"/>`;
        
        // Convert pixels to SVG rectangles
        const pixelSize = 1;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const index = (y * size + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                // If pixel is dark (not white)
                if (r < 128 || g < 128 || b < 128) {
                    svg += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="#000000"/>`;
                }
            }
        }
        
        svg += '</svg>';
        return svg;
    }

    updateSize() {
        this.currentSize = parseInt(this.sizeSelect.value);
        if (this.currentQRData) {
            this.generateQR();
        }
    }

    downloadPNG() {
        if (!this.qrCanvas) {
            this.showError('No QR code to download');
            return;
        }

        try {
            // Create download link
            const link = document.createElement('a');
            link.download = `qr-code-${this.currentSize}x${this.currentSize}.png`;
            link.href = this.qrCanvas.toDataURL('image/png');
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showSuccess('PNG downloaded successfully!');
        } catch (error) {
            console.error('PNG download error:', error);
            this.showError('Failed to download PNG');
        }
    }

    downloadSVG() {
        if (!this.currentSVG) {
            this.showError('No QR code to download');
            return;
        }

        try {
            // Create blob and download link
            const blob = new Blob([this.currentSVG], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.download = `qr-code-${this.currentSize}x${this.currentSize}.svg`;
            link.href = url;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            this.showSuccess('SVG downloaded successfully!');
        } catch (error) {
            console.error('SVG download error:', error);
            this.showError('Failed to download SVG');
        }
    }

    downloadPDF() {
        if (!this.qrCanvas) {
            this.showError('No QR code to download');
            return;
        }

        try {
            // Create new jsPDF instance
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions for centering
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const qrSize = Math.min(pageWidth * 0.6, pageHeight * 0.6); // 60% of page size
            const x = (pageWidth - qrSize) / 2;
            const y = (pageHeight - qrSize) / 2;

            // Add title
            pdf.setFontSize(16);
            pdf.setTextColor(50, 50, 50);
            pdf.text('QR Code', pageWidth / 2, 30, { align: 'center' });

            // Add QR code image
            const imgData = this.qrCanvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

            // Add footer with generation info
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            const date = new Date().toLocaleDateString();
            pdf.text(`Generated on ${date}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
            
            // Add content info if it's a URL
            if (this.isValidURL(this.currentQRData)) {
                pdf.setFontSize(8);
                const maxWidth = pageWidth - 40;
                const splitText = pdf.splitTextToSize(`URL: ${this.currentQRData}`, maxWidth);
                pdf.text(splitText, pageWidth / 2, pageHeight - 30, { align: 'center' });
            }

            // Save the PDF
            pdf.save(`qr-code-${this.currentSize}x${this.currentSize}.pdf`);
            
            this.showSuccess('PDF downloaded successfully!');
        } catch (error) {
            console.error('PDF download error:', error);
            this.showError('Failed to download PDF');
        }
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    clearAll() {
        this.qrInput.value = '';
        this.qrDisplay.style.display = 'none';
        this.currentQRData = null;
        this.currentSVG = null;
        this.qrInput.focus();
    }

    showLoading(show) {
        if (show) {
            this.btnText.style.display = 'none';
            this.loadingSpinner.style.display = 'block';
            this.generateBtn.disabled = true;
        } else {
            this.btnText.style.display = 'block';
            this.loadingSpinner.style.display = 'none';
            this.generateBtn.disabled = false;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: type === 'error' ? '#ef4444' : '#10b981',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        });

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing QR Generator...');
    
    // Check if QRious library is available
    if (typeof QRious === 'undefined') {
        console.error('QRious library not found');
        showLibraryError();
        return;
    }
    
    console.log('QRious library loaded successfully');
    new QRGenerator();
});

// Show error message if libraries fail to load
function showLibraryError() {
    const container = document.querySelector('.container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>Library Loading Error</h3>
            <p>The QR code library failed to load.</p>
            <p>Please ensure all files are properly uploaded to your server.</p>
            <p><strong>Missing files:</strong></p>
            <ul style="text-align: left; display: inline-block;">
                <li>libs/qrcode.min.js</li>
                <li>libs/jspdf.umd.min.js</li>
            </ul>
        `;
        
        const main = container.querySelector('.main');
        if (main) {
            main.insertBefore(errorDiv, main.firstChild);
        }
    }
}

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to clear
    if (e.key === 'Escape') {
        const qrDisplay = document.getElementById('qr-display');
        if (qrDisplay.style.display !== 'none') {
            document.getElementById('clear-btn').click();
        }
    }
    
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('generate-btn').click();
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if we have a service worker file
        // This is optional and can be added later for offline functionality
    });
}
