// In Calendar.jsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Calendar.css';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');

  const handleAddEvent = () => {
    const newEvent = {
      title: eventTitle,
      date: eventDate,
    };
    setEvents([...events, newEvent]);
    setEventTitle('');
    setEventDate('');
  };

  return (
    <div className="calendar-container">
      <input type="text" placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
      <button onClick={handleAddEvent}>Add Event</button>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        events={events}
        height={650}
      />
    </div>
  );
}
