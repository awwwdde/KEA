import {React, useState, useEffect } from 'react';
import './options.scss';

const Options = () => {
  const [people, setPeople] = useState(() => JSON.parse(localStorage.getItem('people')) || []);

  return (
    <div className="opti">
      <div className="opti-block">
        В РАЗРАБОТКЕ 
      </div>
    </div>
  );
};

export default Options;