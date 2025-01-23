import React, { useState } from 'react';
import axios from 'axios';

const ReturnBook = () => {
  const [title, setTitle] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [message, setMessage] = useState('');
  const [availableCount, setAvailableCount] = useState(null); // State for Available Count

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/return-book', {
        title,
        membership_id: membershipId,
      });

      // Update message and available count based on response
      setMessage(response.data.message);
      if (response.data.available_count !== undefined) {
        setAvailableCount(response.data.available_count); // Update the count from server response
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred while returning the book.');
      }
    }
  };

  return (
    <div>
      <h2>Return Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Book Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="membershipId">Membership ID</label>
          <input
            type="text"
            id="membershipId"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Return</button>
      </form>

      {message && <p>{message}</p>}
      {availableCount !== null && (
        <p>Available Count: {availableCount}</p>
      )}
    </div>
  );
};

export default ReturnBook;


