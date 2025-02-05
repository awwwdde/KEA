import {React, useState, useEffect } from 'react';
import './clock.scss';


const Clock = () => {
    const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="clock">
      <div className="clock-container">
        <h1 >{time.toLocaleTimeString()}</h1>
      </div>
      <div className="clock-container"><p >{formatDate(time)}</p></div>
      
    </div>
  );
};

export default Clock;