/**
 * Footer Loader
 * Handles loading footer component with fallback for file:// protocol
 */

function loadFooter() {
    // Check if we're in file:// protocol
    if (location.protocol === 'file:') {
        // For file:// protocol, use fallback footer
        const fallbackFooter = `
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Wonderful World of Manipulative Marketing</h3>
                        <p>An educational journey through marketing techniques and consumer psychology.</p>
                    </div>
                    
                    <div class="footer-section">
                        <h4>About</h4>
                        <ul>
                            <li><a href="about.html">About the Project</a></li>
                            <li><a href="index.html">Home</a></li>
                        </ul>
                    </div>
                    
                    
                    <div class="footer-section">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="https://mk4bt.org" target="_blank">Marketing for Betterment</a></li>
                            <li><a href="https://www.essec.edu" target="_blank">ESSEC Business School</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>2025 ESSEC Business School - Comprendre & Changer le Monde. Educational project for awareness and learning.</p>
                </div>
            </footer>

            <style>
            .footer {
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                color: #ffffff;
                padding: 3rem 0 1rem;
                margin-top: 4rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .footer-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
            }

            .footer-section h3 {
                color: #4ecdc4;
                margin-bottom: 1rem;
                font-size: 1.2rem;
            }

            .footer-section h4 {
                color: #ffffff;
                margin-bottom: 1rem;
                font-size: 1rem;
            }

            .footer-section p {
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.6;
                margin-bottom: 1rem;
            }

            .footer-section ul {
                list-style: none;
                padding: 0;
            }

            .footer-section ul li {
                margin-bottom: 0.5rem;
            }

            .footer-section ul li a {
                color: rgba(255, 255, 255, 0.7);
                text-decoration: none;
                transition: color 0.3s ease;
            }

            .footer-section ul li a:hover {
                color: #4ecdc4;
            }

            .footer-bottom {
                max-width: 1200px;
                margin: 2rem auto 0;
                padding: 1rem 20px 0;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                text-align: center;
            }

            .footer-bottom p {
                color: rgba(255, 255, 255, 0.5);
                font-size: 0.9rem;
                margin: 0;
            }

            @media (max-width: 768px) {
                .footer-content {
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                
                .footer {
                    padding: 2rem 0 1rem;
                }
            }
            </style>
        `;
        
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = fallbackFooter;
        }
        return;
    }
    
    // For http/https protocols, try to fetch the footer
    const footerPath = location.pathname.includes('/') && !location.pathname.endsWith('/') 
        ? '../components/footer.html' 
        : 'components/footer.html';
    
    fetch(footerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Footer not found');
            }
            return response.text();
        })
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }
        })
        .catch(error => {
            // Use the same fallback as file:// protocol
            const fallbackFooter = `
                <footer class="footer">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3>Wonderful World of Manipulative Marketing</h3>
                            <p>An educational journey through marketing techniques and consumer psychology.</p>
                        </div>
                        
                        <div class="footer-section">
                            <h4>About</h4>
                            <ul>
                                <li><a href="about.html">About the Project</a></li>
                                <li><a href="index.html">Home</a></li>
                            </ul>
                        </div>
                        
                        
                        <div class="footer-section">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="https://mk4bt.org" target="_blank">Marketing for Betterment</a></li>
                                <li><a href="https://www.essec.edu" target="_blank">ESSEC Business School</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>2025 ESSEC Business School - Comprendre & Changer le Monde. Educational project for awareness and learning.</p>
                    </div>
                </footer>

                <style>
                .footer {
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    color: #ffffff;
                    padding: 3rem 0 1rem;
                    margin-top: 4rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                }

                .footer-section h3 {
                    color: #4ecdc4;
                    margin-bottom: 1rem;
                    font-size: 1.2rem;
                }

                .footer-section h4 {
                    color: #ffffff;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                }

                .footer-section p {
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }

                .footer-section ul {
                    list-style: none;
                    padding: 0;
                }

                .footer-section ul li {
                    margin-bottom: 0.5rem;
                }

                .footer-section ul li a {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .footer-section ul li a:hover {
                    color: #4ecdc4;
                }

                .footer-bottom {
                    max-width: 1200px;
                    margin: 2rem auto 0;
                    padding: 1rem 20px 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                }

                .footer-bottom p {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.9rem;
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    
                    .footer {
                        padding: 2rem 0 1rem;
                    }
                }
                </style>
            `;
            
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = fallbackFooter;
            }
        });
}

// Auto-load footer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadFooter();
});
