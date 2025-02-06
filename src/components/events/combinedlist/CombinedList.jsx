// src/components/CombinedList.js
import React, { useState, useEffect } from 'react';
import ToggleSwitch from '../toggleswitch/ToggleSwitch';
import PersonCard from '../personcard/PersonCard'
import EventCard from '../eventcard/EventCard';
import usePagination from '../hooks/usePagination';
import Pagination from '../pagination/Pagination';

const CombinedList = ({ 
  people, 
  events, 
  deletePerson, 
  deleteEvent, 
  currentPage, 
  setCurrentPage,
  startEditing 
}) => {
  const [isPeople, setIsPeople] = useState(true);
  const pageSize = 2;
  const items = isPeople ? people : events;
  const { pageData, pageCount } = usePagination(items, pageSize, currentPage);

  return (
    <div className="combined-list">
      <ToggleSwitch isPeople={isPeople} setIsPeople={setIsPeople} />

      <div className="grid">
        {pageData.map((item) => (
          isPeople ? (
            <PersonCard 
              key={item.id}
              person={item}
              deletePerson={() => deletePerson(item.id)}
              editPerson={() => startEditing(item.id, 'person')}
            />
          ) : (
            <EventCard
              key={item.id}
              event={item}
              deleteEvent={() => deleteEvent(item.id)}
              editEvent={() => startEditing(item.id, 'event')}
            />
          )
        ))}
      </div>

      {pageCount > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pageCount}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default CombinedList;