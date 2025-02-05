import {React, useState, useEffect } from 'react';
import './main.scss';
import CustomCalendar from '../../components/calendar/CustomCalendar';
import Clock from '../../components/clock/Clock';
import EventsCom from '../../components/bd/EventsCom';

const Main = () => {
  const [people, setPeople] = useState(() => JSON.parse(localStorage.getItem('people')) || []);

  return (
    <div className="main">
      <div className="main-block">
        <Clock/>  
      </div>
      <div className="main-block">
        <CustomCalendar/>
      </div>
      <div className="main-block">
        <EventsCom people={people}/>
      </div>
    </div>
  );
};

export default Main;