import { Link } from "react-router-dom";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            {/* ======================================== 
                FOOTER CONTENT
            ======================================== */}
            <div className="footer-content">
                
                {/* ======================================== 
                    SECTION 1: ABOUT
                ======================================== */}
                <div className="footer-section">
                    <h4>About Flipkart Clone</h4>
                    <ul>
                        <li>
                            <Link to="/">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Careers
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Press
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Blog
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* ======================================== 
                    SECTION 2: HELP & SUPPORT
                ======================================== */}
                <div className="footer-section">
                    <h4>Help & Support</h4>
                    <ul>
                        <li>
                            <Link to="/">
                                Customer Service
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Track Orders
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Returns
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* ======================================== 
                    SECTION 3: POLICY
                ======================================== */}
                <div className="footer-section">
                    <h4>Policy</h4>
                    <ul>
                        <li>
                            <Link to="/">
                                Return Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Terms of Use
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Security
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                Sitemap
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* ======================================== 
                    SECTION 4: SOCIAL & CONTACT
                ======================================== */}
                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <ul>
                        <li>
                            <a 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Facebook
                            </a>
                        </li>
                        <li>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </a>
                        </li>
                        <li>
                            <a 
                                href="https://linkedin.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ======================================== 
                FOOTER BOTTOM
            ======================================== */}
            <div className="footer-bottom">
                <div className="footer-copyright">
                    <p>
                        © {currentYear} Flipkart Clone. 
                        All rights reserved.
                    </p>
                </div>

                <div className="footer-info">
                    <p>
                         React & Node.js
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
