import React, { useState } from 'react';
import axios from 'axios';

const BorrowBook = () => {
  const [title, setTitle] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [message, setMessage] = useState('');
  const [availableCount, setAvailableCount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/borrow-book', {
        title,
        membership_id: membershipId,
      });

      setMessage(response.data.message);
      setAvailableCount(response.data.available_count);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred while borrowing the book.');
      }
    }
  };

  return (
    <div>
      <h2>Borrow Book</h2>
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
        <button type="submit">Borrow</button>
      </form>

      {message && <p>{message}</p>}
      {availableCount !== null && <p>Available Count: {availableCount}</p>}
    </div>
  );
};

export default BorrowBook;
