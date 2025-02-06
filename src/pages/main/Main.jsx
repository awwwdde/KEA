import {React, useState, useEffect } from 'react';
import './main.scss';
import CustomCalendar from '../../components/calendar/CustomCalendar';
import Clock from '../../components/clock/Clock';
import BirthsCom from '../../components/bd/BirthCom';
import EvenCom from '../../components/ev/EvenCom';

const Main = () => {
  const [people, setPeople] = useState(() => JSON.parse(localStorage.getItem('people')) || []);
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events')) || []);
  return (
    <div className="main">
      <div className="main-block">
        <Clock/>  
      </div>
      <div className="main-block">
        <CustomCalendar/>
      </div>
      <div className="main-block">
        <BirthsCom people={people}/>
      </div>
      <div className="main-block">
        <EvenCom events={events}/>
      </div>
    </div>
  );
};

export default Main;