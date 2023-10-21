import React, { useState } from 'react';
import { CirclePicker } from 'react-color';

// Import the curtain.1.png image
import curtain1 from '../img/products/curtain.1.png';

const TShirt = () => {
  const [color, setColor] = useState('#FF0000'); // Default color

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <div className="text-center">
      <div
        style={{
          width: '200px',
          height: '300px',
          margin: '20px',
          borderRadius: '50%', // Make the div circular
          position: 'relative', // Add position relative for absolute positioning of the image
        }}
      >
        {/* Overlay with curtain1 image */}
        <img
          src={curtain1}
          alt="Curtain"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Ensure the image covers the div
            position: 'absolute', // Absolute positioning to overlay the image
            top: 0,
            left: 0,
            filter: `hue-rotate(${(color.slice(1, 3) / 255) * 360}deg)`, // Adjust hue based on color
          }}
        />
      </div>
      <div className="relative mt-4">
        <CirclePicker
          color={color}
          onChange={handleColorChange}
          colors={[
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            // Add more colors here
          ]}
        />
      </div>
    </div>
  );
};

export default TShirt;
