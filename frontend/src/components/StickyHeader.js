import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StickyHeader.css'; // Create a separate CSS file for the header styles
import face from '../assets/face.svg';
import ahhh from '../assets/ahhh.png';
import disableIcon from '../assets/disabled.png';
import enableIcon from '../assets/enabled.gif';

function StickyHeader({ bodyRef, disableAnimations, setDisableAnimations }) {
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef(null); // Ref for the sidebar
    const hamburgerRef = useRef(null); // Ref for the hamburger menu
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Track hamburger menu state

    // Persistent animation state (shared across all pages)
    const [localDisable, setLocalDisable] = useState(() => {
        const cached = localStorage.getItem('disableAnimations');
        return cached === 'true';
    });

    // Always sync localDisable with localStorage on mount
    useEffect(() => {
        const cached = localStorage.getItem('disableAnimations');
        if (cached === 'true' && !localDisable) setLocalDisable(true);
        if (cached !== 'true' && localDisable) setLocalDisable(false);
    }, []);

    // If parent provides setDisableAnimations, use that, else use localDisable
    const effectiveDisable = typeof setDisableAnimations === 'function'
        ? disableAnimations
        : localDisable;

    // Persist animation state to localStorage
    useEffect(() => {
        localStorage.setItem('disableAnimations', effectiveDisable ? 'true' : 'false');
    }, [effectiveDisable]);

    // Add/remove a CSS class to <body> to globally disable animations
    useEffect(() => {
        if (effectiveDisable) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
        return () => {
            document.body.classList.remove('no-animations');
        };
    }, [effectiveDisable]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the hamburger menu and sidebar
            if (
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target) &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                // Uncheck the hamburger menu
                const input = hamburgerRef.current.querySelector('input');
                if (input) {
                    input.checked = false;
                }
            }
        };

        // Add event listener to detect clicks outside
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const smoothScrollTo = (targetElement, targetPosition, duration = 1000) => {
        const startPosition = targetElement.scrollTop; // Get the current scroll position
        const distance = targetPosition - startPosition;
        let startTime = null;
    
        const animation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
    
            // Easing function for smooth animation
            const easeInOutQuad = (t) => {
                return t < 0.5
                    ? 2 * t * t
                    : 1 - Math.pow(-2 * t + 2, 2) / 2;
            };
    
            // Calculate progress
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeInOutQuad(progress);
    
            // Update the scroll position
            targetElement.scrollTop = startPosition + distance * easedProgress;
    
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };
    
        requestAnimationFrame(animation);
    };

    const on182Click = () => {
        if (location.pathname !== '/182') {
            navigate('/182');
        }
        else {
            const targetElement = bodyRef?.current || document.documentElement;
            smoothScrollTo(targetElement, 0);
        }
    };


    // Handle navigation to Projects page
    const onProjectClick = () => {
        if (location.pathname !== '/projects') {
            navigate('/projects');
        }
        else {
            const targetElement = bodyRef?.current || document.documentElement;
            smoothScrollTo(targetElement, 0);
        }
    };

    const onHomeClick = () => {
        if (location.pathname !== '/home') {
            navigate('/home');
        }
        else {
            const targetElement = bodyRef?.current || document.documentElement;
            smoothScrollTo(targetElement, 0);
        }
    };

    // Reset sidebar scroll when the menu is opened
    useEffect(() => {
        if (isMenuOpen && sidebarRef.current) {
            setTimeout(() => {
                sidebarRef.current.scrollTop = 0;
                console.log('Sidebar scroll reset to:', sidebarRef.current.scrollTop);
            }, 0);
        }
    }, [isMenuOpen]);

    return (
        <div className="sticky-header">
            <nav className="nav">
                <button
                    className="hover-btn left-icon"
                    onClick={onHomeClick}
                >
                    <img
                        src= {ahhh}
                        alt="Face"
                        className="background-image"
                    />
                    <img
                        src= {face}
                        alt="Face"
                        className="nav-icon"
                    />
                </button>
                <div className='nav-buttons'>
                    <button
                        className={`hover-btn ${location.pathname === '/home' ? 'active' : ''}`}
                        onClick={onHomeClick}
                    >
                        Home
                    </button>
                    <button
                        className={`hover-btn ${location.pathname === '/projects' ? 'active' : ''}`}
                        onClick={onProjectClick} // Call the skill click handler
                    >
                        Projects
                    </button>
                    <button
                        className={`hover-btn ${location.pathname === '/182' ? 'active' : ''}`}
                        onClick={on182Click}
                    >
                        182
                    </button>
                    <button

                        onClick={() => {
                            if (typeof setDisableAnimations === 'function') {
                                setDisableAnimations(v => {
                                    localStorage.setItem('disableAnimations', !v ? 'true' : 'false');
                                    return !v;
                                });
                            } else {
                                setLocalDisable(v => {
                                    localStorage.setItem('disableAnimations', !v ? 'true' : 'false');
                                    return !v;
                                });
                            }
                        }}
                        style={{
                            marginLeft: 12,
                            display: 'inline-block',
                            background: 'none',
                            border: 'none',
                            paddingLeft: 50,
                            scale: '2',
                            cursor: 'pointer'
                        }}
                    >
                        <img
                            src={effectiveDisable ? disableIcon : enableIcon}
                            alt={effectiveDisable ? 'Enable Animations' : 'Disable Animations'}
                            style={{ width: 32, height: 32 }}
                        />
                    </button>
                </div>
            </nav>
            <nav className="mobile-nav">
                <button
                    className="hover-btn left-icon"
                    onClick={onHomeClick}
                >
                    <img
                        src= {ahhh}
                        alt="Face"
                        className="background-image"
                    />
                    <img
                        src= {face}
                        alt="Face"
                        className="nav-icon"
                    />
                </button>
                <label className="hamburger-menu" ref={hamburgerRef}>
                    <input
                        type="checkbox"
                        onChange={(e) => setIsMenuOpen(e.target.checked)} // Update menu state
                    />
                </label>
                <aside className="sidebar" ref={sidebarRef}>
                    <ul className="nav-button">
                        <button
                            className={`hover-btn ${location.pathname === '/home' ? 'active' : ''}`}
                            onClick={onHomeClick}
                        >
                            Home
                        </button>
                        <button
                            className={`hover-btn ${location.pathname === '/projects' ? 'active' : ''}`}
                            onClick={onProjectClick}
                        >
                            Projects
                        </button>
                        <button
                            className={`hover-btn ${location.pathname === '/182' ? 'active' : ''}`}
                            onClick={on182Click}
                        >
                            182
                        </button>
                        <button
                            className="hover-btn"
                            onClick={() => {
                                if (typeof setDisableAnimations === 'function') {
                                    setDisableAnimations(v => {
                                        localStorage.setItem('disableAnimations', !v ? 'true' : 'false');
                                        return !v;
                                    });
                                } else {
                                    setLocalDisable(v => {
                                        localStorage.setItem('disableAnimations', !v ? 'true' : 'false');
                                        return !v;
                                    });
                                }
                            }}
                            style={{
                                marginLeft: 12,
                                display: 'inline-block',
                                background: 'none',
                                border: 'none',
                                padding: '0',
                                transform: 'translateY(-50px)',
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src={effectiveDisable ? disableIcon : enableIcon}
                                alt={effectiveDisable ? 'Enable Animations' : 'Disable Animations'}
                                style={{ width: 64, height: 64 }}
                            />
                        </button>
                    </ul>
                </aside>
            </nav>
        </div>
    );
}

export default StickyHeader;