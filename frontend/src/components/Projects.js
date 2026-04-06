import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import './TextAppear.css';
import './Button.css';
import './Projects.css';
import Particle from './Particle';
import CircularIcons from './CircularIcons';
import TermHeader from './TerminalHeader';
import StickyHeader from './StickyHeader';

import python from '../assets/pythonblack.png';
import reacticon from '../assets/reactblack.png';
import java from '../assets/java.png';
import c from '../assets/C.png';
import cpp from '../assets/cpp.png';
import ts from '../assets/ts.png';
import potato from '../assets/potato.png';
import face from '../assets/face.svg';
import autocorrect from '../assets/autocorrect.png';
import whatsupboilerup from '../assets/whatsupboilerup.png';

function wrapText(text, maxCharsPerLine) {
    const wrapSingleParagraph = (paragraph, width) => {
        const words = paragraph.split(/\s+/).filter(Boolean);

        if (words.length === 0) {
            return [''];
        }

        const lines = [];
        let currentLine = '';

        const pushWordChunks = (word) => {
            for (let startIndex = 0; startIndex < word.length; startIndex += width) {
                lines.push(word.slice(startIndex, startIndex + width));
            }
        };

        for (const word of words) {
            if (word.length > width) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = '';
                }
                pushWordChunks(word);
                continue;
            }

            if (!currentLine) {
                currentLine = word;
                continue;
            }

            if (currentLine.length + 1 + word.length <= width) {
                currentLine += ` ${word}`;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    };

    return text
        .split('\n')
        .map(paragraph => {
            if (!paragraph.trim()) {
                return '';
            }

            const bulletMatch = paragraph.match(/^(\s*[-•*]\s+)/);
            const bulletPrefix = bulletMatch ? bulletMatch[1] : '';
            const content = bulletMatch ? paragraph.slice(bulletPrefix.length).trim() : paragraph.trim();
            const availableWidth = Math.max(1, maxCharsPerLine - bulletPrefix.length);
            const wrappedLines = wrapSingleParagraph(content, availableWidth);

            return wrappedLines
                .map((line, index) => (index === 0 ? `${bulletPrefix}${line}` : `${' '.repeat(bulletPrefix.length)}${line}`))
                .join('\n');
        })
        .join('\n');
}

function Projects({ onExpand, disableAnimations, setDisableAnimations }) {
    const bodyRef = useRef(null);
    const textRef = useRef(null);

    // Add particleRef for each Particle
    const particleRefs = useRef([]);

    const [particles, setParticles] = useState([]);
    const [textHeight, setTextHeight] = useState(0);
    const title = "Atharva's Website";
    const projectIconSize = 65;
    const descriptionWidth = 90;
    const projectIconStyle = {
        width: projectIconSize,
        height: projectIconSize,
        display: 'block',
        objectFit: 'contain',
        flexShrink: 0
    };
    
    const [circleSize, setCircleSize] = useState(650); // Default size
    const [iconSize, setIconSize] = useState(120); // Default icon size
    const images = [python, java, cpp, c, ts];

    // Example projects array: [title, date, description, icon, link]
    const projects = [
        [
            "Potato Salad (Stock Scraper)",
            "",
            "• A stock advisor platform that analyzes ~6000 U.S.-listed stocks\n" + 
            "• Lets users filter stocks by sector, industry, and financial metrics (P/E, market cap, etc.)\n" +
            "• Displays tailored stock picks along with key data and sentiment indicators\n" +
            "• Runs locally with a Python backend and a React-based frontend for interactive use\n",
            <img src={potato} alt="potato" style={projectIconStyle} />,
            "https://github.com/akerkar2005/potato-salad/"
        ],
        [
        "Autocorrect & Autocomplete",
        "",
        "• Built a full-stack autocorrect and autocomplete system using React, Express, Python, and C++, delivering real-time suggestions via API calls.\n\n" +
        "• Implemented a high-performance Trie data structure in C++ for prefix-based autocomplete, prioritizing shorter, more relevant completions.\n\n" +
        "• Designed a custom autocorrect pipeline combining Levenshtein Edit Distance with a novel keyboard proximity (Euclidean distance) heuristic to improve typo accuracy.\n\n" +
        "• Optimized performance with C++ bindings (pybind11), caching strategies, and constrained search space, enabling efficient real-time text correction.\n\n",
        <img src={autocorrect} alt="autocorrect" style={projectIconStyle} />,
        "https://github.com/akerkar2005/gui-autocomplete-autocorrect/"
        ],
        [
            "Personal Website",
            "",
            "• Fun website I built with React. You're looking at it right now!",
            <img src={face} alt="React" style={projectIconStyle} />
        ],
        [
            "What's Up? Boiler Up!",
            "",
            "• Webscrapes Purdue event data and displays them on an interactive map of Purdue's campus.",
            <img src={whatsupboilerup} alt="What's Up? Boiler Up!" style={projectIconStyle} />,
            "https://akerkar2005.github.io/whatsupboilerup"
        ]
    ];

    // Function to calculate sizes based on screen dimensions
    const calculateSizes = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Adjust circle size based on the smaller dimension (width or height)
        const newCircleSize = Math.min(screenWidth, screenHeight) * 0.7; // 80% of the smaller dimension
        const newIconSize = newCircleSize / 6.4; // Icons are proportional to the circle size

        setCircleSize(newCircleSize);
        setIconSize(newIconSize);
    };

    // Run the calculation on component mount and window resize
    useEffect(() => {
        calculateSizes(); // Initial calculation
        window.addEventListener('resize', calculateSizes); // Recalculate on resize

        return () => {
        window.removeEventListener('resize', calculateSizes); // Cleanup event listener
        };
    }, []);


    // Update the text height after the component has rendered
    useEffect(() => {
      if (textRef.current) {
        const height = textRef.current.offsetHeight + 500;
        setTextHeight(height); // Store height of the text
      }
    }, []);

    useEffect(() => {
        const numParticles = 20;
        let particlePositions = [];
    
    
        // Generate random left positions between 20 and 80 and staggered delays
        for (let i = 0; i < numParticles; i++) {
          particlePositions.push({
            left: Math.random() * (100), // Random left position between 20 and 80
            delay: i/4, // Staggered delay
          });
        }
        
        setParticles(particlePositions);
    }, [textHeight]); // Re-run the effect whenever the text height changes
    

    useEffect(() => {
        if (disableAnimations) {
            if (onExpand) onExpand();
        } else {
            if (onExpand) onExpand();
        }
    }, [onExpand, disableAnimations]);

    return (
        <div className="main-page-wrapper">
            {/* Terminal Header */}
            <TermHeader headerTitle={title} />
            <div className="contact-content" ref={bodyRef}>
                <StickyHeader
                    bodyRef={bodyRef}
                    setIsComplete={() => {}}
                    disableAnimations={disableAnimations}
                    setDisableAnimations={setDisableAnimations}
                />
                <div className="contact-background">
                    <div className="liquid-text-wrapper">
                        <h1 className="liquid-text" ref={textRef}>
                          Projects
                        </h1>
                    </div>
                    {/* Only render particles if not disabled */}
                    {!disableAnimations && particles.map((particle, index) => (
                      <Particle
                        ref={el => particleRefs.current[index] = el}
                        key={index}
                        left={particle.left}
                        delay={particle.delay}
                        textHeight={textHeight}
                      />
                    ))}
                </div>
                <div className="skill-ui">
                    <CircularIcons
                        numIcons={images.length}
                        size={circleSize}
                        iconSize={iconSize}
                        images={images}
                        centerIcon={reacticon}
                        disableAnimations={disableAnimations}
                    />
                </div>
                    <div className="projects-list projects-list-legacy">
                        {projects.map(([projectTitle, date, description, icon, link]) => (
                            <div className="project-entry" key={projectTitle}>
                                <div className="project-entry-header">
                                    {icon}
                                    <div>
                                        <p className="project-title">{projectTitle}</p>
                                        <p className="project-date">{date}</p>
                                    </div>
                                </div>
                                <p className="project-description">{wrapText(description, descriptionWidth)}</p>
                                {link && (
                                    <p className="project-link">
                                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                                    </p>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Projects;