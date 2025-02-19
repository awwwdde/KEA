import React, { useState, useEffect } from 'react';
import { FaBirthdayCake, FaCalendarAlt, FaEdit, FaTrash, FaArrowLeft, FaArrowRight, FaHome } from 'react-icons/fa';
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
        person: "",
        isYearly: false
    });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editingEvent, setEditingEvent] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;

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
            const date = new Date(newEvent.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            const updatedEvent = {
                ...newEvent,
                date: formattedDate,
                id: editingEvent?.id || Date.now()
            };

            const newEvents = editingEvent 
                ? events.map(ev => ev.id === editingEvent.id ? updatedEvent : ev)
                : [...events, updatedEvent];

            setEvents(newEvents);
            setNewEvent({ type: "event", title: "", date: "", person: "", isYearly: false });
            setEditingEvent(null);
        }
    };

    const handleDeleteEvent = (id) => {
        setEvents(events.filter(event => event.id !== id));
    };

    const handleEditEvent = (event) => {
        const date = new Date(event.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setNewEvent({...event, date: formattedDate});
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

    const getEventsForDate = (date) => {
        if (!date) return [];
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        return events.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            
            if (event.isYearly) {
                const currentYear = targetDate.getFullYear();
                const yearlyDate = new Date(currentYear, eventDate.getMonth(), eventDate.getDate());
                yearlyDate.setHours(0, 0, 0, 0);
                return yearlyDate.getTime() === targetDate.getTime();
            }
            
            return eventDate.getTime() === targetDate.getTime();
        });
    };

const getUpcomingEvents = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return events
            .filter(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);
                
                if (event.isYearly) {
                    const currentYear = today.getFullYear();
                    const nextOccurrence = new Date(currentYear, eventDate.getMonth(), eventDate.getDate());
                    nextOccurrence.setHours(0, 0, 0, 0);
                    return nextOccurrence >= today;
                }
                
                return eventDate >= today;
            })
            .sort((a, b) => {
                const aDate = new Date(a.isYearly 
                    ? new Date(today.getFullYear(), new Date(a.date).getMonth(), new Date(a.date).getDate())
                    : a.date);
                
                const bDate = new Date(b.isYearly 
                    ? new Date(today.getFullYear(), new Date(b.date).getMonth(), new Date(b.date).getDate())
                    : b.date);
                
                return aDate - bDate;
            })
            .slice(0, 1); 
    };

    const handleDayClick = (date) => {
        if (!date) return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        setSelectedDate(date.getTime() === today.getTime() ? null : new Date(date));
    };

    const getDisplayEvents = () => {
        if (selectedDate) {
            return {
                today: getEventsForDate(selectedDate),
                upcoming: []
            };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayEvents = getEventsForDate(today);
        const upcomingEvents = getUpcomingEvents()
            .filter(e => !todayEvents.some(te => te.id === e.id))
            .slice(0, 3);

        return {
            today: todayEvents,
            upcoming: upcomingEvents
        };
    };

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.person?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const currentEvents = filteredEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const EventCard = ({ event, showActions }) => {
        const eventDate = new Date(event.date);
        const displayDate = event.isYearly 
            ? new Date(new Date().getFullYear(), eventDate.getMonth(), eventDate.getDate())
            : new Date(event.date);
        
        displayDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isToday = displayDate.getTime() === today.getTime();

        return (
            <div className="event-card">
                <div className="card-header">
                    <span className="event-date">
                        {isToday ? 'Сегодня' : displayDate.toLocaleDateString('ru-RU')}
                        {event.isYearly && ' (ежегодно)'}
                    </span>
                    {event.type === 'birthday' && (
                        <span className="event-badge">🎂 День рождения</span>
                    )}
                </div>
                <div className="card-content">
                    <h4>{event.type === 'birthday' ? event.person : event.title}</h4>
                </div>
                {showActions && (
                    <div className="card-actions">
                        <button className="edit-btn" onClick={() => handleEditEvent(event)}>
                            <FaEdit />
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>
        );
    };

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
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={newEvent.isYearly}
                                onChange={e => setNewEvent({...newEvent, isYearly: e.target.checked})}
                            />
                            <span className="checkmark"></span>
                            Ежегодное событие
                        </label>
                        <button type="submit">
                            {editingEvent ? 'Обновить' : 'Добавить'}
                        </button>
                        {editingEvent && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setNewEvent({ type: "event", title: "", date: "", person: "", isYearly: false });
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
                        <div className="preview-header">
                            <h3>
                                {selectedDate 
                                    ? new Date(selectedDate).toLocaleDateString('ru-RU')
                                    : 'События'}
                            </h3>
                            {selectedDate && (
                                <button 
                                    className="reset-date"
                                    onClick={() => setSelectedDate(null)}
                                >
                                    <FaHome /> Сегодня
                                </button>
                            )}
                        </div>
                        <div className="events-grid">
                            {getDisplayEvents().today.length > 0 && (
                                <div className="events-group">
                                    <h4>{selectedDate ? 'События на выбранную дату' : 'Сегодня'}</h4>
                                    {getDisplayEvents().today.map(event => (
                                        <EventCard 
                                            key={event.id} 
                                            event={event} 
                                            showActions={false} 
                                        />
                                    ))}
                                </div>
                            )}

                            {!selectedDate && getDisplayEvents().upcoming.length > 0 && (
                                <div className="events-group">
                                    <h4>Ближайшие события</h4>
                                    {getDisplayEvents().upcoming.map(event => (
                                        <EventCard 
                                            key={event.id} 
                                            event={event} 
                                            showActions={false} 
                                        />
                                    ))}
                                </div>
                            )}

                            {getDisplayEvents().today.length === 0 && 
                             getDisplayEvents().upcoming.length === 0 && (
                                <p className="no-events">Событий не найдено</p>
                            )}
                        </div>
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
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const isToday = date?.toDateString() === today.toDateString();
                                
                                const hasEvent = events.some(event => {
                                    const eventDate = new Date(event.date);
                                    if (event.isYearly) {
                                        return date?.getDate() === eventDate.getDate() && 
                                               date?.getMonth() === eventDate.getMonth();
                                    }
                                    return date?.toDateString() === new Date(event.date).toDateString();
                                });
                                
                                const isSelected = selectedDate && 
                                    date?.setHours(0, 0, 0, 0) === selectedDate.setHours(0, 0, 0, 0);
                                
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
                        <div className="events-container">
                            {currentEvents.map(event => (
                                <EventCard 
                                    key={event.id} 
                                    event={event} 
                                    showActions={true} 
                                />
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