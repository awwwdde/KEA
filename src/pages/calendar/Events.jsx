// src/pages/EventsPage.js
import React, { useEffect, useState } from 'react';
import './events.scss';
import SearchBar from '../../components/events/search/SearchBar';
import AddForm from '../../components/events/addform/AddForm';
import CombinedList from '../../components/events/combinedlist/CombinedList';


const EventsPage = () => {
  const [people, setPeople] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('people')) || [];
    return saved.map(person => ({ ...person, id: person.id || Date.now() }));
  });
  
  const [events, setEvents] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('events')) || [];
    return saved.map(event => ({ ...event, id: event.id || Date.now() }));
  });

  const [formType, setFormType] = useState('person');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [info, setInfo] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Ошибки
  const [nameError, setNameError] = useState(false);
  const [birthdayError, setBirthdayError] = useState(false);
  const [eventDateError, setEventDateError] = useState(false);
  const [eventNameError, setEventNameError] = useState(false);
  const [eventDescriptionError, setEventDescriptionError] = useState(false);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
    localStorage.setItem('events', JSON.stringify(events));
  }, [people, events]);

  const resetForm = () => {
    setEditId(null);
    setName('');
    setBirthday('');
    setInfo('');
    setEventDate('');
    setEventName('');
    setEventDescription('');
  };

  const handleAddOrUpdate = () => {
    let valid = true;

    if (formType === 'person') {
      if (!name) {
        setNameError(true);
        valid = false;
      } else setNameError(false);
      
      if (!birthday) {
        setBirthdayError(true);
        valid = false;
      } else setBirthdayError(false);

      if (valid) {
        const newPerson = { id: editId || Date.now(), name, birthday, info };
        
        setPeople(prev => 
          editId 
            ? prev.map(p => p.id === editId ? newPerson : p) 
            : [...prev, newPerson]
        );
        resetForm();
      }
    } 
    else if (formType === 'event') {
      if (!eventDate) {
        setEventDateError(true);
        valid = false;
      } else setEventDateError(false);
      
      if (!eventName) {
        setEventNameError(true);
        valid = false;
      } else setEventNameError(false);
      
      if (!eventDescription) {
        setEventDescriptionError(true);
        valid = false;
      } else setEventDescriptionError(false);

      if (valid) {
        const newEvent = { 
          id: editId || Date.now(), 
          date: eventDate, 
          name: eventName, 
          description: eventDescription 
        };
        
        setEvents(prev => 
          editId 
            ? prev.map(e => e.id === editId ? newEvent : e) 
            : [...prev, newEvent]
        );
        resetForm();
      }
    }
  };

  const deletePerson = (id) => {
    setPeople(prev => {
      const newPeople = prev.filter(p => p.id !== id);
      const totalPages = Math.ceil(newPeople.length / 2);
      if (currentPage >= totalPages && totalPages > 0) setCurrentPage(totalPages - 1);
      return newPeople;
    });
  };

  const deleteEvent = (id) => {
    setEvents(prev => {
      const newEvents = prev.filter(e => e.id !== id);
      const totalPages = Math.ceil(newEvents.length / 2);
      if (currentPage >= totalPages && totalPages > 0) setCurrentPage(totalPages - 1);
      return newEvents;
    });
  };

  const startEditing = (id, type) => {
    const item = type === 'person'
      ? people.find(p => p.id === id)
      : events.find(e => e.id === id);

    if (type === 'person') {
      setName(item.name);
      setBirthday(item.birthday);
      setInfo(item.info || '');
      setFormType('person');
    } else {
      setEventDate(item.date);
      setEventName(item.name);
      setEventDescription(item.description || '');
      setFormType('event');
    }
    setEditId(id);
  };

  return (
    <div className="events">
      <div className="events-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="events-container">
        <AddForm 
          formType={formType}
          setFormType={setFormType}
          name={name}
          setName={setName}
          birthday={birthday}
          setBirthday={setBirthday}
          info={info}
          setInfo={setInfo}
          eventDate={eventDate}
          setEventDate={setEventDate}
          eventName={eventName}
          setEventName={setEventName}
          eventDescription={eventDescription}
          setEventDescription={setEventDescription}
          handleAddOrUpdate={handleAddOrUpdate}
          editIndex={editId !== null}
          nameError={nameError}
          birthdayError={birthdayError}
          eventDateError={eventDateError}
          eventNameError={eventNameError}
          eventDescriptionError={eventDescriptionError}
        />
      </div>
      <div className="events-container">
        <CombinedList 
          people={people} 
          events={events} 
          deletePerson={deletePerson} 
          deleteEvent={deleteEvent} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          startEditing={startEditing}
        />
      </div>
    </div>
  );
};

export default EventsPage;