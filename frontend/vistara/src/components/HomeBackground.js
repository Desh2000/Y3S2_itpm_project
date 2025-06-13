import React, { useEffect, useState } from 'react';
import './HomeBackground.css';

const HomeBackground = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [particles, setParticles] = useState([]);

  // Generate random particles for background
  useEffect(() => {
    const generateParticles = () => {
      const numParticles = Math.floor(window.innerWidth / 35); // Adjust based on screen size
      const newParticles = [];
      
      for (let i = 0; i < numParticles; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // percent position
          y: Math.random() * 100,
          size: Math.random() * 6 + 2, // particle size between 2-8px
          opacity: Math.random() * 0.5 + 0.2, // opacity between 0.2-0.7
          speed: Math.random() * 20 + 10, // animation speed in seconds
          delay: Math.random() * 5, // animation delay
          blur: Math.random() * 3 // blur effect
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      generateParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate the parallax effect
  const offset = scrollPosition * 0.3; // Adjust multiplier for parallax strength

  return (
    <div className="home-background">
      {/* Gradient overlay */}
      <div className="gradient-overlay"></div>
      
      {/* Animated shapes */}
      <div className="animated-shapes">
        <div className="shape circle-shape" style={{ transform: `translateY(${offset * 0.2}px)` }}></div>
        <div className="shape square-shape" style={{ transform: `translateY(${offset * -0.3}px) rotate(${offset * 0.05}deg)` }}></div>
        <div className="shape triangle-shape" style={{ transform: `translateY(${offset * 0.4}px) rotate(${offset * -0.05}deg)` }}></div>
        <div className="shape rounded-shape" style={{ transform: `translateY(${offset * -0.25}px)` }}></div>
      </div>
      
      {/* Particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: `blur(${particle.blur}px)`,
              animationDuration: `${particle.speed}s`,
              animationDelay: `${particle.delay}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Light waves */}
      <div className="wave-container">
        <div className="wave wave1" style={{ transform: `translateY(${offset * 0.2}px)` }}></div>
        <div className="wave wave2" style={{ transform: `translateY(${offset * 0.15}px)` }}></div>
        <div className="wave wave3" style={{ transform: `translateY(${offset * 0.1}px)` }}></div>
      </div>
    </div>
  );
};

export default HomeBackground; 