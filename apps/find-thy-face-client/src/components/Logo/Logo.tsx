import React, { useRef } from 'react';
import { Tilt } from 'react-tilt';
import './Logo.css';
import logo from './logo.svg';

export const Logo = () => {
  const tiltRef = useRef(null);

  return (
    <div className="m-4 mt-0">
      <Tilt
        ref={tiltRef}
        className="Tilt rounded-md shadow-md"
        options={{ max: 55 }}
        style={{ height: 150, width: 150 }}
      >
        <div className="Tilt-inner flex p-3">
          <img src={logo} alt="logo" />
          <h1 className="text-white text-2xl font-mono">FindThyFace</h1>
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
