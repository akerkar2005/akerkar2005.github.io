import React, { useRef } from 'react';
import './Home.css';
import './Button.css';
import img from '../assets/portrait.jpg';
import TermHeader from './TerminalHeader.js';
import StickyHeader from './StickyHeader.js';
import useFontSizeSetter from './fontSizeSetter.js';
import 'font-awesome/css/font-awesome.min.css';


function AlternatingColorTitle({ text }) {
    // Split the text into words
    const words = text.split(' ');
  
    return (
      <h1>
        {words.map((word, index) => {
            // Alternate colors based on the index
            const color = index % 2 === 0 ? 'color1' : 'color2';
            // returns two span elements with alternating colors
            // and the word inside
            return (
                <span key={index} className={color}>
                    {word}{' '}
                </span>
            );
        })}
      </h1>
    );
}

function Home({ disableAnimations, setDisableAnimations }) {
    const bodyRef = useRef(null);
    const title = "Atharva's Website";
    const bodyText = "I am a Purdue student majoring in Computer Science and minoring in Economics and Math.\nPlease feel free to reach out to me if you have any questions or would like to chat.\nYou can also download my resume by clicking the download icon below.";

    useFontSizeSetter();

    return (
        <div className="main-page-wrapper">
            {/* Terminal Header */}
            <TermHeader headerTitle={title} />
            {/* Main Content */}
            <div className="main-content" ref={bodyRef}>
                <StickyHeader
                    bodyRef={bodyRef}
                    setIsComplete={() => {}}
                    disableAnimations={disableAnimations}
                    setDisableAnimations={setDisableAnimations}
                />
                <div className="resume-section">
                    <div className="image-container">
                        <img src={img} alt="Profile" />
                    </div>
                    <div className="content-container">
                        <AlternatingColorTitle text="Atharva Kerkar" />
                        <p>
                            {bodyText}
                        </p>
                        <div className="connect">
                            <a className="linkedin" href="https://www.linkedin.com/in/atharva-kerkar-58b4a5290/" target="_blank" rel="noopener noreferrer">
                                in
                            </a>
                            <a className="icon" href="https://github.com/akerkar2005" target="_blank" rel="noopener noreferrer">
                            </a>
                            <a
                                href={`${process.env.PUBLIC_URL}/Work_Resume.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="resume-download"
                                style={{
                                    padding: 0,
                                    background: 'none',
                                    border: 'none',
                                    boxShadow: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                }}
                            >
                                <i className="fa fa-download" style={{ fontSize: 50, color: '#317bd5ff', verticalAlign: 'middle' }}></i>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Home;

