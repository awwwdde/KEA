import {React, useState, useEffect } from 'react';
import CustomCalendar from '../../components/calendar/CustomCalendar';
import Clock from '../../components/clock/Clock';
import BirthsCom from '../../components/bd/BirthCom';
import EvenCom from '../../components/ev/EvenCom';
import './options.scss';

const ComsFull = () => {
    const [people, setPeople] = useState(() => JSON.parse(localStorage.getItem('people')) || []);
    const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events')) || []);

  return (
    <div className="opti">
      <div className="opti-block">
        <Clock/>  
      </div>
      <div className="opti-block">
        <CustomCalendar/>
      </div>
      <div className="opti-block">
        <BirthsCom people={people}/>
      </div>
      <div className="opti-block">
        <EvenCom events={events}/>
      </div>
    </div>
  );
};

export default ComsFull;