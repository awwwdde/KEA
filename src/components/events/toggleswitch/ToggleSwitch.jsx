// src/components/ToggleSwitch.js
import React from 'react';

const ToggleSwitch = ({ isPeople, setIsPeople }) => {
  return (
    <div className="toggle-switch">
      <button onClick={() => setIsPeople(true)} className={isPeople ? 'active' : ''}>
        Люди
      </button>
      <button onClick={() => setIsPeople(false)} className={!isPeople ? 'active' : ''}>
        События
      </button>
    </div>
  );
};

export default ToggleSwitch;