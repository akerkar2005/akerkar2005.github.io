import React, { useEffect, useState, useRef } from 'react';
import './CircularIcons.css'; // Import the CSS file

const CircleAnimation = ({ numIcons = 5, size = 200, iconSize = 40, images, centerIcon, disableAnimations }) => {
  const radius = size / 2;
  const center = radius;

  const [positions, setPositions] = useState([]);
  const [angle, setAngle] = useState(0);
  const [centerAngle, setCenterAngle] = useState(0);

  const angleIntervalRef = useRef();
  const centerAngleIntervalRef = useRef();

  // Animate surrounding icons
  useEffect(() => {
    if (angleIntervalRef.current) {
      clearInterval(angleIntervalRef.current);
      angleIntervalRef.current = null;
    }
    if (disableAnimations) {
      setAngle(0);
      return;
    }
    angleIntervalRef.current = setInterval(() => {
      setAngle(prevAngle => (prevAngle + 0.25) % 360); // Normal speed when enabled
    }, 20);
    return () => {
      if (angleIntervalRef.current) {
        clearInterval(angleIntervalRef.current);
        angleIntervalRef.current = null;
      }
    };
  }, [disableAnimations]);

  // Animate center icon
  useEffect(() => {
    if (centerAngleIntervalRef.current) {
      clearInterval(centerAngleIntervalRef.current);
      centerAngleIntervalRef.current = null;
    }
    if (disableAnimations) {
      setCenterAngle(0);
      return;
    }
    centerAngleIntervalRef.current = setInterval(() => {
      setCenterAngle(prevAngle => (prevAngle - 0.25) % 360); // Normal speed when enabled
    }, 20);
    return () => {
      if (centerAngleIntervalRef.current) {
        clearInterval(centerAngleIntervalRef.current);
        centerAngleIntervalRef.current = null;
      }
    };
  }, [disableAnimations]);

  useEffect(() => {
    if (disableAnimations) {
      // When animations are disabled, show icons at their default positions
      const newPositions = [];
      for (let i = 0; i < numIcons; i++) {
        const angleDeg = (i * 360) / numIcons;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = radius * Math.cos(angleRad) + center - iconSize / 2;
        const y = radius * Math.sin(angleRad) + center - iconSize / 2;
        newPositions.push({ x, y });
      }
      setPositions(newPositions);
      return;
    }
    const updatePositions = () => {
      const newPositions = [];
      for (let i = 0; i < numIcons; i++) {
        const angleDeg = (i * 360) / numIcons + angle;
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = radius * Math.cos(angleRad) + center - iconSize / 2;
        const y = radius * Math.sin(angleRad) + center - iconSize / 2;

        newPositions.push({ x, y });
      }
      setPositions(newPositions);
    };

    updatePositions();
  }, [angle, numIcons, size, radius, center, iconSize, disableAnimations]);

  return (
    <div
      className="circle-container"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Center Icon rotating counterclockwise */}
      <div
        className="center-icon"
        style={{
          width: Math.max(size - 10, iconSize),
          height: Math.max(size - 10, iconSize),
          transform: `translate(-50%, -50%) rotate(${disableAnimations ? 0 : centerAngle}deg)`,
        }}
      >
        {centerIcon && <img src={centerIcon} alt="center-icon" />}
      </div>

      {/* Rotating Icons with Hover Animation */}
      {positions.map((position, index) => (
        <div
          key={index}
          className="rotating-icon"
          style={{
            width: iconSize,
            height: iconSize,
            left: position.x,
            top: position.y,
            // Stop rotation if disabled
            transition: disableAnimations ? 'none' : undefined,
          }}
        >
          <img src={images[index]} alt={`icon-${index}`} />
        </div>
      ))}
    </div>
  );
};

export default CircleAnimation;