import React, { useState, useEffect } from 'react';
import CommunicationModule from '../../services/communicationModule';

export const Communication = () => {
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch available rooms or groups
    const fetchRooms = async () => {
      const availableRooms = await CommunicationModule.getAvailableRooms();
      setRooms(availableRooms);
    };
    fetchRooms();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    CommunicationModule.sendMessage(message, target);
    setMessage('');
  };

  return (
    <div className="communication">
      <h2>Communication</h2>
      <form onSubmit={handleSendMessage}>
        <select value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="all">All Tabs</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </select>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Enter your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
