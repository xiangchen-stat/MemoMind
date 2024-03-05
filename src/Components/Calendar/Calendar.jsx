import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Corrected capitalization
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/events?userEmail=${userEmail}`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      console.log('Server response:', data);

    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handleAddEvent = async () => {
    const newEvent = {
      title: eventTitle,
      start: eventDate,
      userEmail,
    };
  
    try {
      const response = await fetch(`http://localhost:3001/api/events?userEmail=${userEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

        const responseData = await response.json(); // Store response data in a variable
        console.log('Server response:', responseData);
      
        if (!response.ok) {
          throw new Error('Failed to add event');
        }
        
        // maybe, fetch all events again here to refresh the list
        fetchEvents();
        
        // directly add the new event to local state
        setEvents(prevEvents => [...prevEvents, newEvent]);
      
      setEventTitle('');
      setEventDate('');
    } catch (error) {
      console.error("Error adding event:", error);
    }
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
