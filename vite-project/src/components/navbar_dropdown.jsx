import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            <div className="topbar_rot"></div>
            <div className="topbar">
                <button 
                    id="hamburger" 
                    className={`hamburger ${isOpen ? 'open' : ''}`} 
                    aria-label="Menü" 
                    aria-expanded={isOpen}
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav 
                    id="dropdown" 
                    className={`dropdown ${isOpen ? 'open' : ''}`} 
                    aria-hidden={!isOpen}
                >
                    <ul>
                        <li>
                            <a href="#" onClick={closeMenu}>
                                Start
                                <div className="grauer-strich"></div>
                            </a>
                        </li>
                        <li>
                            <a href="news.html" onClick={closeMenu}>
                                News
                                <div className="grauer-strich"></div>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={closeMenu}>
                                Tickets
                                <div className="grauer-strich"></div>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div 
                    className={`menu-overlay ${isOpen ? 'open' : ''}`} 
                    onClick={closeMenu}
                ></div>
                <a href="/" className="logo" aria-label="Eintracht Frankfurt">
                    <img src="/pictures/eintracht-wappen.png" alt="Eintracht Frankfurt Wappen" className="club-logo" />
                </a>
                <h1 className="header"><i>EINTRACHT FRANKFURT</i></h1>
            </div>
        </>
    );
};

export default Navbar;