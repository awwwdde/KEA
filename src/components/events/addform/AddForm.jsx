import React from 'react';
import './addform.scss';

const AddForm = ({
  formType,
  setFormType,
  name,
  setName,
  birthday,
  setBirthday,
  info,
  setInfo,
  eventDate,
  setEventDate,
  eventName,
  setEventName,
  eventDescription,
  setEventDescription,
  handleAddOrUpdate,
  editId,
  nameError,
  birthdayError,
  eventDateError,
  eventNameError,
  eventDescriptionError,
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdate(); }} className='form'>
      <div>
        <button type="button" onClick={() => setFormType('person')}>Добавить человека</button>
        <button type="button" onClick={() => setFormType('event')}>Добавить событие</button>
      </div>
      <div className="form-type">
      {formType === 'person' && (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
          />
          {nameError && <span className="error">Имя обязательно</span>}
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          {birthdayError && <span className="error">Дата рождения обязательна</span>}
          <input
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Информация"
          />
        </>
      )}
      {formType === 'event' && (
        <>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          {eventDateError && <span className="error">Дата события обязательна</span>}
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Название события"
          />
          {eventNameError && <span className="error">Название события обязательно</span>}
          <input
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Описание события"
          />
          {eventDescriptionError && <span className="error">Описание события обязательно</span>}
        </>
      )}
      </div>
      
      <button type="submit">{editId !== null ? 'Обновить' : 'Добавить'}</button>
    </form>
  );
};

export default AddForm;