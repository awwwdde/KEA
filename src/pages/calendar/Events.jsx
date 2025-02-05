// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import './events.scss';

const Events = () => {
  const [people, setPeople] = useState(() => JSON.parse(localStorage.getItem('people')) || []);
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events')) || []);
  const [formType, setFormType] = useState('person'); // 'person' or 'event'
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [info, setInfo] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editIndex, setEditIndex] = useState(null); // Индекс редактируемого элемента

  // Состояния для отслеживания ошибок
  const [nameError, setNameError] = useState(false);
  const [birthdayError, setBirthdayError] = useState(false);
  const [eventDateError, setEventDateError] = useState(false);
  const [eventNameError, setEventNameError] = useState(false);
  const [eventDescriptionError, setEventDescriptionError] = useState(false);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
    localStorage.setItem('events', JSON.stringify(events));
  }, [people, events]);

  const handleAddOrUpdate = () => {
    let valid = true;

    if (formType === 'person') {
      if (!name) {
        setNameError(true);
        valid = false;
      } else {
        setNameError(false);
      }
      if (!birthday) {
        setBirthdayError(true);
        valid = false;
      } else {
        setBirthdayError(false);
      }

      if (valid) {
        if (editIndex !== null) {
          const updatedPeople = [...people];
          if (updatedPeople[editIndex]) { // Проверка на существование
            updatedPeople[editIndex] = { name, birthday, info };
            setPeople(updatedPeople);
          }
          setEditIndex(null);
        } else {
          setPeople([...people, { name, birthday, info }]);
        }
        setName('');
        setBirthday('');
        setInfo('');
      }
    } else if (formType === 'event') {
      if (!eventDate) {
        setEventDateError(true);
        valid = false;
      } else {
        setEventDateError(false);
      }
      if (!eventName) {
        setEventNameError(true);
        valid = false;
      } else {
        setEventNameError(false);
      }
      if (!eventDescription) {
        setEventDescriptionError(true);
        valid = false;
      } else {
        setEventDescriptionError(false);
      }

      if (valid) {
        if (editIndex !== null) {
          const updatedEvents = [...events];
          if (updatedEvents[editIndex]) { // Проверка на существование
            updatedEvents[editIndex] = { date: eventDate, name: eventName, description: eventDescription };
            setEvents(updatedEvents);
          }
          setEditIndex(null);
        } else {
          setEvents([...events, { date: eventDate, name: eventName, description: eventDescription }]);
        }
        setEventDate('');
        setEventName('');
        setEventDescription('');
      }
    }
  };

  const deletePerson = (index) => {
    const newPeople = people.filter((_, i) => i !== index);
    setPeople(newPeople);
  };

  const deleteEvent = (index) => {
    const newEvents = events.filter((_, i) => i !== index);
    setEvents(newEvents);
  };

  const editPerson = (index) => {
    const person = people[index];
    if (person) { // Проверка на существование
      setName(person.name);
      setBirthday(person.birthday);
      setInfo(person.info);
      setEditIndex(index);
      setFormType('person');
    }
  };

  const editEvent = (index) => {
    const event = events[index];
    if (event) { // Проверка на существование
      setEventDate(event.date);
      setEventName(event.name);
      setEventDescription(event.description);
      setEditIndex(index);
      setFormType('event');
    }
  };

  return (
    <div className="events">
      <div className="events-container">
        <h1>События</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-section">
          <div className="add-section">
            <select onChange={(e) => setFormType(e.target.value)} value={formType}>
              <option value="person">Добавить человека</option>
              <option value="event">Добавить событие</option>
            </select>

            {formType === 'person' ? (
              <>
                <input
                  type="text"
                  placeholder="ФИО"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value) setNameError(false);
                  }}
                  style={{ borderColor: nameError ? '#dd2d4a' : '#ccc' }}
                />
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                    if (e.target.value) setBirthdayError(false);
                  }}
                  style={{ borderColor: birthdayError ? '#dd2d4a' : '#ccc' }}
                />
                <textarea
                  placeholder="Информация"
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                />
              </>
            ) : (
              <>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => {
                    setEventDate(e.target.value);
                    if (e.target.value) setEventDateError(false);
                  }}
                  style={{ borderColor: eventDateError ? '#dd2d4a' : '#ccc' }}
                />
                <input
                  type="text"
                  placeholder="Название события"
                  value={eventName}
                  onChange={(e) => {
                    setEventName(e.target.value);
                    if (e.target.value) setEventNameError(false);
                  }}
                  style={{ borderColor: eventNameError ? '#dd2d4a' : '#ccc' }}
                />
                <textarea
                  placeholder="Описание события"
                  value={eventDescription}
                  onChange={(e) => {
                    setEventDescription(e.target.value);
                    if (e.target.value) setEventDescriptionError(false);
                  }}
                  style={{ borderColor: eventDescriptionError ? '#dd2d4a' : '#ccc' }}
                />
              </>
            )}

            <div className="action-text" onClick={handleAddOrUpdate}>
              {editIndex !== null ? 'Обновить' : 'Добавить'}
            </div>
          </div>
        </div>

        <div className="content-container">
          <div className="people-section">
            <h2>Люди</h2>
            <div className="scrollable">
              {people.filter(person => person && person.name.includes(searchTerm)).map((person, index) => (
                <div className="person-block" key={index}>
                  <h3>{person.name}</h3>
                  <p>Дата рождения: {person.birthday}</p>
                  <p>Информация: {person.info}</p>
                  <div className="action-text" onClick={() => editPerson(index)}>Редактировать</div>
                  <div className="action-text" onClick={() => deletePerson(index)}>Удалить</div>
                </div>
              ))}
            </div>
          </div>

          <div className="events-section">
            <h2>События</h2>
            <div className="scrollable">
              {events.filter(event => event && event.name.includes(searchTerm)).map((event, index) => (
                <div className="event-block" key={index}>
                  <h3>{event.name}</h3>
                  <p>Дата: {event.date}</p>
                  <p>Описание: {event.description}</p>
                  <div className="action-text" onClick={() => editEvent(index)}>Редактировать</div>
                  <div className="action-text" onClick={() => deleteEvent(index)}>Удалить</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;