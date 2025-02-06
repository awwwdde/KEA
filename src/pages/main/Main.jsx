import {React } from 'react';
import './main.scss';

import EventsPage from '../eventsFull/Events';
import ComsFull from '../comsFull/ComsFull';

const Main = () => {

  return (
    <div className="main">      
      <div className="main-block">
        <ComsFull/>
      </div>
      <div className="main-block">
        <EventsPage/>
      </div>

    </div>
  );
};

export default Main;