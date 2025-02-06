// src/components/PersonCard.js
import React from 'react';

const PersonCard = ({ person, deletePerson, editPerson }) => {
  return (
    <div className="person-card">
      <h3>{person.name}</h3>
      <p>Дата рождения: {person.birthday}</p>
      {person.info && <p>Информация: {person.info}</p>}
      <div className="actions">
        <button onClick={editPerson}>Редактировать</button>
        <button onClick={deletePerson}>Удалить</button>
      </div>
    </div>
  );
};

export default PersonCard;