// src/components/PersonCard.js
import React from 'react';
import './personcard.scss';
const PersonCard = ({ person, deletePerson, editPerson }) => {
  return (
    <div className="person">
      <h3>{person.name}</h3>
      <p>{person.birthday}</p>
      {person.info && <p>{person.info}</p>}
      <div className="person-actions">
        <button onClick={editPerson}>Редактировать</button>
        <button onClick={deletePerson}>Удалить</button>
      </div>
    </div>
  );
};

export default PersonCard;