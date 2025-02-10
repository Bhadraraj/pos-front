import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import '../../styles/dashboard.css'
const WelcomeMessage = () => {
    useEffect(() => {
 
        const letters = document.querySelectorAll('.mg-foods-text span');
        gsap.fromTo(
            letters,
            { x: -100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                repeat: -1, 
                yoyo: true,
            }
        );
    }, []);

    return (
        <div>
            <h3 className="welcome-text">
                {'Welcome to '}
                <span className="mg-foods-text">
                    {'MG FOODS'.split('').map((char, index) => (
                        <span key={index}>{char}</span>
                    ))}
                </span>
            </h3>
        </div>
    );
};

export default WelcomeMessage;
