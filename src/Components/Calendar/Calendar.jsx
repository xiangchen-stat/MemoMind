import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Corrected capitalization
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');

  const handleAddEvent = () => {
    const newEvent = {
      title: eventTitle,
      start: eventDate, // Changed 'date' to 'start'
      color: 'purple',
    };
    const updatedEvents = [...events, newEvent];
    console.log('Adding event:', newEvent);
    console.log('Updated events array:', updatedEvents);
  
    setEvents(updatedEvents);
    setEventTitle('');
    setEventDate('');
  };

  return (
    <div>
      <input type="text" placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
      <button onClick={handleAddEvent}>Add Event</button>
      <FullCalendar // Corrected capitalization
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events} // Make sure to pass the updated events array to FullCalendar
        height="90vh"
      />
    </div>
  );
}

export default Calendar;
