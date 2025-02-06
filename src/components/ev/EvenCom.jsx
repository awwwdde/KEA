// src/components/TodayEvents.js
import React from 'react';
import './evenCom.scss';
const EvenCom = ({ events }) => {
  const today = new Date();

  // Функция для получения событий на сегодня
  const getTodayEvents = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === today.getFullYear() &&
             eventDate.getMonth() === today.getMonth() &&
             eventDate.getDate() === today.getDate();
    });
  };

  // Функция для получения ближайших событий
  const getUpcomingEvents = () => {
    const upcomingEvents = events.map(event => {
      const eventDate = new Date(event.date);
      return {
        name: event.name,
        date: eventDate,
        description: event.description,
      };
    });

    return upcomingEvents.sort((a, b) => a.date - b.date);
  };

  const todayEvents = getTodayEvents();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="today-events">
      {todayEvents.length > 0 ? (
        <h2>Сегодня события:</h2>
      ) : (
        <h2>Ближайшее событие:</h2>
      )}
      {todayEvents.length > 0 ? (
        todayEvents.map((event, index) => (
          <div key={index} className="event-item">
            {event.name} - {event.description}
          </div>
        ))
      ) : (
        upcomingEvents.length > 0 && (
          <div className="event-item">
            {upcomingEvents[0].name} - {upcomingEvents[0].description} (Дата: {upcomingEvents[0].date.toLocaleDateString()})
          </div>
        )
      )}
    </div>
  );
};

export default EvenCom;