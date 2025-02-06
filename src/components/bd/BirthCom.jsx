// src/components/BirthdayList.js
import React from 'react';
import './eventsCom.scss';
const EventsCom = ({ people, events }) => {
    const today = new Date();
    const currentYear = today.getFullYear();
  
    // Функция для получения дней рождения на сегодня
    const getTodayBirthdays = () => {
      return people.filter(person => {
        const birthdayDate = new Date(person.birthday);
        return birthdayDate.getMonth() === today.getMonth() && birthdayDate.getDate() === today.getDate();
      });
    };
  
    // Функция для получения ближайших дней рождения
    const getUpcomingBirthdays = () => {
      const upcomingBirthdays = people.map(person => {
        const birthdayDate = new Date(person.birthday);
        const nextBirthday = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate());
  
        if (nextBirthday < today) {
          nextBirthday.setFullYear(currentYear + 1);
        }
  
        return {
          name: person.name,
          date: nextBirthday,
        };
      });
  
      return upcomingBirthdays.sort((a, b) => a.date - b.date);
    };
  
    const todayBirthdays = getTodayBirthdays();
    const upcomingBirthdays = getUpcomingBirthdays();
  
    return (
      <div className="today-birthdays">
        {todayBirthdays.length > 0 ? (
          <h2>Сегодня день рождения у:</h2>
        ) : (
          <h2>Ближайший день рождения:</h2>
        )}
        {todayBirthdays.length > 0 ? (
          todayBirthdays.map((birthday, index) => (
            <div key={index} className="birthday-item">
              {birthday.name}
            </div>
          ))
        ) : (
          upcomingBirthdays.length > 0 && (
            <div className="birthday-item">
              {upcomingBirthdays[0].name} ({upcomingBirthdays[0].date.toLocaleDateString()})
            </div>
          )
        )}
      </div>
    );
  };

export default EventsCom;