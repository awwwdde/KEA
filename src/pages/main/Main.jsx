import React, { useState, useEffect } from 'react';
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
    const itemsPerPage = 5;

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

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.person?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const currentEvents = filteredEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getClosestEvent = () => {
        const today = new Date();
        today.setHours(0,0,0,0);
        return events
            .map(event => ({...event, date: new Date(event.date)}))
            .filter(event => new Date(event.date) >= today)
            .sort((a, b) => a.date - b.date)[0] || null;
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
                        <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
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
                        <button type="submit">{editingEvent ? 'Обновить' : 'Добавить'}</button>
                        {editingEvent && <button type="button" onClick={() => setEditingEvent(null)}>Отмена</button>}
                    </form>
                </div>

                <div className="main-bento__box main-bento__box--small">
                    {getClosestEvent() ? (
                        <div className="next-event">
                            <div className="event-type">
                                {getClosestEvent().type === 'birthday' ? '🎂 День рождения' : '📅 Событие'}
                            </div>
                            <div className="event-name">
                                {getClosestEvent().type === 'birthday' ? getClosestEvent().person : getClosestEvent().title}
                            </div>
                            <div className="event-date">
                                {new Date(getClosestEvent().date).toLocaleDateString('ru-RU', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                })}
                            </div>
                        </div>
                    ) : <p>Нет предстоящих событий</p>}
                </div>

                <div className="main-bento__box main-bento__box--small">
                    <div className="calendar">
                        <div className="calendar-header">
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>←</button>
                            <h3>{currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</h3>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>→</button>
                        </div>
                        <div className="calendar-grid">
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                <div key={day} className="calendar-day-header">{day}</div>
                            ))}
                            {getDaysInMonth().map((date, index) => {
                                const isCurrentMonth = date?.getMonth() === currentDate.getMonth();
                                const isToday = date?.toDateString() === new Date().toDateString();
                                const hasEvent = events.some(event => date && new Date(event.date).toDateString() === date.toDateString());
                                
                                return (
                                    <div 
                                        key={index}
                                        className={`calendar-day 
                                            ${isToday ? 'today' : ''} 
                                            ${hasEvent ? 'has-event' : ''} 
                                            ${!isCurrentMonth ? 'not-current-month' : ''}`}
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
                        {currentEvents.map(event => (
                            <div key={event.id} className="event-item">
                                <span>{event.type === 'birthday' ? '🎂' : '📅'}</span>
                                <div>
                                    <p>{event.type === 'birthday' ? event.person : event.title}</p>
                                    <small>{new Date(event.date).toLocaleDateString()}</small>
                                </div>
                                <button onClick={() => handleEditEvent(event)}>✏️</button>
                                <button onClick={() => handleDeleteEvent(event.id)}>🗑️</button>
                            </div>
                        ))}
                        <div className="pagination">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1}
                            >Назад</button>
                            <span>Страница {currentPage}</span>
                            <button 
                                onClick={() => setCurrentPage(p => p + 1)} 
                                disabled={currentPage * itemsPerPage >= filteredEvents.length}
                            >Вперед</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;