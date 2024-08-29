import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  
  //An array to store the user data fetched from the API.
  const [data, setData] = useState([]);
  
  //An object to store the data of a new user or update to be added.
  const [newData, setNewData] = useState({
    id:'',
    first_name: '',
    last_name: '',
    email: ''
  });

  //An object to store the data of a user being updated.
  /*const [updateData, setUpdateData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: ''
  });*/

  //A variable to store the ID of the user currently being edited.
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get('https://reqres.in/api/users');
      setData(response.data.data);
      console.log(response.data)
      
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // Add new user data
  const postData = async () => {
    try {
      const response = await axios.post('https://reqres.in/api/users', newData);
      setData(prevData => [...prevData, response.data]);
      setNewData({first_name:'',last_name:'',email:''});
      console.log(response.data);
      
    } catch (error) {
      console.error('Error posting data: ', error);
    }
  };

  // Update existing user data
  const updateDataHandler = async () => {
    try {
      const response = await axios.put(`https://reqres.in/api/users/${newData.id}`, newData);
      
      setData(prevData => prevData.map(item => item.id === newData.id ? response.data : item));
      setEditingUserId(null);
      setNewData({first_name:'',last_name:'',email:''});
      
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // Delete user data
  const deleteDataHandler = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  
  // Event handler function
  const handleInputChange = e => {
    setNewData(prevData => ({
      ...prevData,  
      [e.target.name]: e.target.value
    }));
  };

  const handleEditClick = user => {
    setNewData(user);
    setEditingUserId(user.id);
  };

  
  return (
    <>
      <form className="form">
        <label>Enter your First Name:
          <input 
            type="text"
            name="first_name"
            value={newData.first_name}
            onChange={handleInputChange}
          />
        </label>
        <label>Enter your Last Name:
          <input 
            type="text"
            name="last_name"
            value={newData.last_name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Enter your Email:
          <input 
            type="email"
            name="email"
            value={newData.email}
            onChange={handleInputChange}
          />
        </label>
      </form>

      <div className="centered">
        <button onClick={fetchData} className="btn">
          Show Users
        </button>
        <button onClick={postData} className="btn">
          Add User
        </button>
      </div>

      <ul className="user-list">
        {data.map(item => (
          <li key={item.id} className="user-item">
            {editingUserId === item.id ? (
              <div className="edit-form">
                <label>
                  Update First Name:
                  <input 
                    type="text"
                    name="first_name"
                    value={newData.first_name}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Update Last Name:
                  <input 
                    type="text"
                    name="last_name"
                    value={newData.last_name}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Update Email:
                  <input 
                    type="email"
                    name="email"
                    value={newData.email}
                    onChange={handleInputChange}
                  />
                </label>
                <button onClick={updateDataHandler} className="btn">Update</button>
                <button onClick={() => setEditingUserId(null)} className="btn cancel-btn">Cancel</button>
              </div>
            ) : (
              <>
                <p>Name: {item.first_name} {item.last_name}</p>
                <p>Email: {item.email}</p>
                <button onClick={() => handleEditClick(item)} className="btn edit-btn">Edit</button>
                <button onClick={() => deleteDataHandler(item.id)} className="btn delete-btn">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;