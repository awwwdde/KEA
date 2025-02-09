import { React, useState, useEffect } from 'react';
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

    // Логика календаря
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const startDay = (firstDay.getDay() + 6) % 7;
        
        for(let i = startDay; i > 0; i--) {
            days.push(new Date(year, month - 1, prevMonthLastDay - i + 1));
        }
        
        for(let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        
        while(days.length % 7 !== 0) {
            days.push(new Date(year, month + 1, days.length - lastDay.getDate() + 1));
        }
        
        return days;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
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

    const getClosestEvent = () => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const futureEvents = events
            .map(event => ({...event, date: new Date(event.date)}))
            .filter(event => event.date >= today)
            .sort((a, b) => a.date - b.date);
        
        return futureEvents[0] || null;
    };

    const filteredEvents = events.filter(event => 
        `${event.title}${event.person}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const showPagination = filteredEvents.length > itemsPerPage;

    return (
        <div className="main">
            <div className="main-bento">
                {/* Блок 1 - Часы и дата */}
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

                {/* Блок 2 - Форма добавления */}
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
                            {editingEvent ? '✎ Обновить' : '＋ Добавить'}
                        </button>
                    </form>
                </div>

                {/* Блок 3 - Ближайшее событие */}
                <div className="main-bento__box main-bento__box--small">
                    {getClosestEvent() ? (
                        <div className="next-event">
                            <div className="event-type">
                                {getClosestEvent().type === 'birthday' ? '🎂 День рождения' : '📅 Событие'}
                            </div>
                            <div className="event-name">
                                {getClosestEvent().type === 'birthday' 
                                    ? getClosestEvent().person 
                                    : getClosestEvent().title}
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

                {/* Блок 4 - Календарь */}
                <div className="main-bento__box main-bento__box--small">
                    <div className="calendar">
                        <div className="calendar-header">
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                                ←
                            </button>
                            <h3>
                                {currentDate.toLocaleDateString('ru-RU', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                })}
                            </h3>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                                →
                            </button>
                        </div>
                        <div className="calendar-grid">
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                <div key={day} className="calendar-day-header">{day}</div>
                            ))}
                            {getDaysInMonth().map((date, index) => {
                                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                const isToday = date.toDateString() === new Date().toDateString();
                                const hasEvent = events.some(event => 
                                    new Date(event.date).toDateString() === date.toDateString()
                                );
                                return (
                                    <div 
                                        key={index}
                                        className={`calendar-day 
                                            ${isToday ? 'today' : ''} 
                                            ${hasEvent ? 'has-event' : ''} 
                                            ${!isCurrentMonth ? 'not-current-month' : ''}`}
                                    >
                                        {date.getDate()}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Блок 5 - Список событий */}
                <div className="main-bento__box main-bento__box--large">
                    <div className="events-list">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="🔍 Поиск событий..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <h3>Все события ({filteredEvents.length})</h3>
                        <div className="events-container">
                            {currentEvents.map(event => (
                                <div key={event.id} className="event-card">
                                    <div className="event-icon">
                                        {event.type === 'birthday' ? '🎂' : '📅'}
                                    </div>
                                    <div className="event-details">
                                        <h4>{event.type === 'birthday' ? event.person : event.title}</h4>
                                        <p>{new Date(event.date).toLocaleDateString('ru-RU')}</p>
                                    </div>
                                    <div className="event-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEditEvent(event)}
                                            title="Редактировать"
                                        >✎</button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteEvent(event.id)}
                                            title="Удалить"
                                        >🗑</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showPagination && (
                            <div className="pagination">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                    disabled={currentPage === 1}
                                >←</button>
                                <span>{currentPage} из {totalPages}</span>
                                <button 
                                    onClick={() => setCurrentPage(p => p + 1)} 
                                    disabled={currentPage >= totalPages}
                                >→</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;