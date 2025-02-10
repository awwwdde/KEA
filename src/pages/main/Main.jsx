import React, { useState, useEffect } from 'react';
import { FaBirthdayCake, FaCalendarAlt, FaEdit, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './main.scss';

const Main = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem("events");
        return saved ? JSON.parse(saved) : [];
    });
    const [newEvent, setNewEvent] = useState({
        type: "event",
        title: "",
        date: "",
        person: ""
    });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editingEvent, setEditingEvent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const itemsPerPage = 2;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem("events", JSON.stringify(events));
    }, [events]);

    const handleAddEvent = (e) => {
        e.preventDefault();
        if (newEvent.title && newEvent.date) {
            if (editingEvent) {
                setEvents(events.map(ev => ev.id === editingEvent.id ? 
                    {...newEvent, id: editingEvent.id} : ev));
                setEditingEvent(null);
            } else {
                setEvents([...events, {...newEvent, id: Date.now()}]);
            }
            setNewEvent({ type: "event", title: "", date: "", person: "" });
        }
    };

    const handleDeleteEvent = (id) => {
        setEvents(events.filter(event => event.id !== id));
    };

    const handleEditEvent = (event) => {
        setNewEvent(event);
        setEditingEvent(event);
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        const startDay = (firstDay.getDay() + 6) % 7;

        for (let i = 0; i < startDay; i++) days.push(null);
        for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
        while (days.length % 7 !== 0) days.push(null);

        return days;
    };

    const getEventsByDate = (date) => {
        if (!date) return [];
        const targetDate = new Date(date);
        targetDate.setHours(0,0,0,0);
        return events.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0,0,0,0);
            return eventDate.getTime() === targetDate.getTime();
        });
    };

    const getUpcomingEvents = () => {
        const baseDate = selectedDate || new Date();
        baseDate.setHours(0,0,0,0);
        
        return events
            .map(event => ({...event, date: new Date(event.date)}))
            .filter(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0,0,0,0);
                return eventDate >= baseDate;
            })
            .sort((a, b) => a.date - b.date)
            .slice(0, 3);
    };

    const handleDayClick = (date) => {
        if (!date) return;
        
        const today = new Date();
        today.setHours(0,0,0,0);
        date.setHours(0,0,0,0);

        date.getTime() === today.getTime() 
            ? setSelectedDate(null) 
            : setSelectedDate(date);
    };

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.person?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const currentEvents = filteredEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="main">
            <div className="main-bento">
                <div className="main-bento__box main-bento__box--large">
                    <div className="clock">
                        <h2>{currentTime.toLocaleTimeString()}</h2>
                        <p>{currentTime.toLocaleDateString('ru-RU', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                    </div>
                </div>

                <div className="main-bento__box main-bento__box--small">
                    <form onSubmit={handleAddEvent} className="event-form">
                        <select 
                            value={newEvent.type} 
                            onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                        >
                            <option value="event">Событие</option>
                            <option value="birthday">День рождения</option>
                        </select>
                        {newEvent.type === "birthday" && (
                            <input
                                type="text"
                                placeholder="Имя человека"
                                value={newEvent.person}
                                onChange={e => setNewEvent({...newEvent, person: e.target.value})}
                            />
                        )}
                        <input
                            type="text"
                            placeholder="Название"
                            value={newEvent.title}
                            onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                        />
                        <input
                            type="date"
                            value={newEvent.date}
                            onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                        />
                        <button type="submit">
                            {editingEvent ? 'Обновить' : 'Добавить'}
                        </button>
                        {editingEvent && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setNewEvent({ type: "event", title: "", date: "", person: "" });
                                    setEditingEvent(null);
                                }}
                            >
                                Отмена
                            </button>
                        )}
                    </form>
                </div>

                <div className="main-bento__box main-bento__box--small">
                    <div className="events-preview">
                        {!selectedDate && (
                            <>
                                <h3>Сегодня:</h3>
                                {getEventsByDate(new Date()).length > 0 ? (
                                    getEventsByDate(new Date()).map(event => (
                                        <div key={event.id} className="event-preview-item">
                                            {event.type === 'birthday' 
                                                ? <FaBirthdayCake className="event-icon" /> 
                                                : <FaCalendarAlt className="event-icon" />}
                                            <div>
                                                <p>{event.type === 'birthday' ? event.person : event.title}</p>
                                                <small>{new Date(event.date).toLocaleTimeString()}</small>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-events">Событий на сегодня нет</p>
                                )}
                            </>
                        )}
                        
                        <h3>{selectedDate ? 'События на выбранную дату' : 'Ближайшие события'}</h3>
                        {getUpcomingEvents().map(event => (
                            <div key={event.id} className="event-preview-item">
                                {event.type === 'birthday' 
                                    ? <FaBirthdayCake className="event-icon" /> 
                                    : <FaCalendarAlt className="event-icon" />}
                                <div>
                                    <p>{event.type === 'birthday' ? event.person : event.title}</p>
                                    <small>
                                        {new Date(event.date).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </small>
                                </div>
                            </div>
                        ))}
                        
                        {selectedDate && (
                            <button 
                                className="reset-date"
                                onClick={() => setSelectedDate(null)}
                            >
                                Показать текущие события
                            </button>
                        )}
                    </div>
                </div>

                <div className="main-bento__box main-bento__box--small">
                    <div className="calendar">
                        <div className="calendar-header">
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                                <FaArrowLeft />
                            </button>
                            <h3>{currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</h3>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                                <FaArrowRight />
                            </button>
                        </div>
                        <div className="calendar-grid">
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                <div key={day} className="calendar-day-header">{day}</div>
                            ))}
                            {getDaysInMonth().map((date, index) => {
                                const isCurrentMonth = date?.getMonth() === currentDate.getMonth();
                                const isToday = date?.toDateString() === new Date().toDateString();
                                const hasEvent = events.some(event => date && new Date(event.date).toDateString() === date.toDateString());
                                const isSelected = selectedDate && date?.toDateString() === selectedDate.toDateString();
                                
                                return (
                                    <div 
                                        key={index}
                                        className={`calendar-day 
                                            ${isToday ? 'today' : ''} 
                                            ${hasEvent ? 'has-event' : ''} 
                                            ${!isCurrentMonth ? 'not-current-month' : ''}
                                            ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleDayClick(date)}
                                    >
                                        {date ? date.getDate() : ''}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="main-bento__box main-bento__box--large">
                    <div className="events-list">
                        <div className="search-box">
                            <input 
                                type="text" 
                                placeholder="Поиск событий..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <h3>Все события:</h3>
                        <div className="events-container">
                            {currentEvents.map(event => (
                                <div key={event.id} className="event-item">
                                    {event.type === 'birthday' 
                                        ? <FaBirthdayCake className="event-icon" /> 
                                        : <FaCalendarAlt className="event-icon" />}
                                    <div>
                                        <p>{event.type === 'birthday' ? event.person : event.title}</p>
                                        <small>{new Date(event.date).toLocaleDateString()}</small>
                                    </div>
                                    <div className="event-actions">
                                        <FaEdit className="action-icon" onClick={() => handleEditEvent(event)} />
                                        <FaTrash className="action-icon" onClick={() => handleDeleteEvent(event.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1}
                            >
                                <FaArrowLeft />
                            </button>
                            <span>Страница {currentPage}</span>
                            <button 
                                onClick={() => setCurrentPage(p => p + 1)} 
                                disabled={currentPage * itemsPerPage >= filteredEvents.length}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;