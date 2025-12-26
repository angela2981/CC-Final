import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Class Lecture',
    time: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.time) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/events`, formData);
      setFormData({ title: '', type: 'Class', time: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Student Scheduler</h1>
      </header>
      
      <main className="main">
        <form onSubmit={handleSubmit} className="event-form">
          <input
            type="text"
            name="title"
            placeholder="Enter subject (e.g., CS-101)"
            value={formData.title}
            onChange={handleChange}
            required
          />
          
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Class Lecture">Class Lecture</option>
            <option value="Exam">Exam</option>
            <option value="Quiz">Quiz</option>
            <option value="Recitation">Recitation</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Assignment">Assignment</option>
            <option value="Study Time">Study Time</option>
          </select>
          
          <input
            type="datetime-local"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Event'}
          </button>
        </form>

        <div className="events-list">
          <h2>Schedule ({events.length} events)</h2>
          {events.length === 0 ? (
            <p className="empty-state">No events scheduled yet. Add your first event above!</p>
          ) : (
            events.map((event) => (
              <div key={event.eventId} className={`event-card ${event.type.toLowerCase().replace(' ', '')}`}>
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span className="event-type">{event.type}</span>
                </div>
                <p className="event-time">{new Date(event.time).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
