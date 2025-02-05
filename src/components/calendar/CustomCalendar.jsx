// src/components/CustomCalendar.js
import React, { useState } from 'react';
import './customCalendar.scss';

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays = Array.from({ length: firstDay }, (_, i) => {
    const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    return lastMonthDate.getDate() - i;
  }).reverse();

  const nextMonthDays = Array.from({ length: 6 - ((daysInMonth + firstDay - 1) % 7) }, (_, i) => i + 1);

  const today = new Date().getDate();
  const isToday = (day) => day === today && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

  return (
    <div className="custom-calendar-container">
      <div className="calendar-header">
        <div className="calendar-title">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </div>
        <div className="calendar-controls">
          <button onClick={() => changeMonth(-1)}>&lt;</button>
          <button onClick={() => changeMonth(1)}>&gt;</button>
        </div>
      </div>
      <div className="calendar">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div className="calendar-weekday" key={day}>{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {previousMonthDays.map((day) => (
            <div className="calendar-day previous" key={day}>{day}</div>
          ))}
          {days.map((day) => (
            <div className={`calendar-day ${isToday(day) ? 'today' : ''}`} key={day}>{day}</div>
          ))}
          {nextMonthDays.map((day) => (
            <div className="calendar-day next" key={day}>{day}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;