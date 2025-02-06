// src/components/EventCard.js
import React from 'react';

const EventCard = ({ event, deleteEvent, editEvent }) => {
  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>Дата: {event.date}</p>
      {event.description && <p>Описание: {event.description}</p>}
      <div className="actions">
        <button onClick={editEvent}>Редактировать</button>
        <button onClick={deleteEvent}>Удалить</button>
      </div>
    </div>
  );
};

export default EventCard;