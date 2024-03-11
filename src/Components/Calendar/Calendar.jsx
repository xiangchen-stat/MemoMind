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
      const formattedEvents = data.map(event => ({
        ...event,
        id: event._id, // Ensure this transformation so FullCalendar knows each event's DB _id
      }));
      setEvents(formattedEvents);
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

  const handleEventRemove = async (event) => {
    try {
      const response = await fetch(`http://localhost:3001/api/events/${event.id}?userEmail=${userEmail}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
  
      // Refresh the events from the server or directly update local state
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };
  

  const renderEventContent = (eventInfo) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => handleEventRemove(eventInfo.event)}
          style={{ cursor: 'pointer', border: 'none', background: 'none', color: 'red', marginRight: '5px' }}>
          x
        </button>
        <span>{eventInfo.event.title}</span>
      </div>
    );
  };
    
  
  return (
    <div>
      <input type="text" placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
      <button onClick={handleAddEvent}>Add Event</button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events} // Make sure to pass the updated events array to FullCalendar
        height="90vh"
        // adjust the width of the FullCalendar
        eventContent={renderEventContent}
        eventBackgroundColor="rgb(191, 148, 228)"
        eventBorderColor="transparent"
      />
    </div>
  );
}

export default Calendar;
