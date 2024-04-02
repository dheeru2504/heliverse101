// src/GenderFilter.js
import React, { useState } from "react";
import axios from "axios";

const GenderFilter = () => {
  const [gender, setGender] = useState("");
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5050/api/user/filter-users`,
        {
          params: {
            gender: gender,
          },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Gender:
          <select value={gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <button type="submit">Filter</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.first_name} {user.last_name} - {user.gender}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenderFilter;
