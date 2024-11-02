import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios'; // Import your axios instance
import { useMyContext } from '../../Context'; // Import context to access token
import './Positions.css'; // Import the CSS for styling

const Positions = () => {
  const { token } = useMyContext(); // Get the token from context
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set to 10 for pagination

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admin/positions/', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const addPosition = async () => {
    if (newPosition) {
      try {
        const response = await axiosInstance.post('http://127.0.0.1:8000/api/admin/positions/', {
          title: newPosition,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        setPositions([...positions, response.data]);
        setNewPosition('');
      } catch (error) {
        console.error('Error adding position:', error);
      }
    }
  };

  const startEditing = (position) => {
    setEditingId(position.id);
    setEditingName(position.title);
  };

  const savePosition = async () => {
    if (editingName) {
      try {
        await axiosInstance.patch(`http://127.0.0.1:8000/api/admin/positions/${editingId}/`, {
          title: editingName,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        setPositions(positions.map(pos => 
          pos.id === editingId ? { ...pos, title: editingName } : pos
        ));
        setEditingId(null);
        setEditingName('');
      } catch (error) {
        console.error('Error updating position:', error);
      }
    }
  };

  const deletePosition = async (id) => {
    try {
      await axiosInstance.delete(`http://127.0.0.1:8000/api/admin/positions/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setPositions(positions.filter(pos => pos.id !== id));
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  // Pagination logic
  const indexOfLastPosition = currentPage * itemsPerPage;
  const indexOfFirstPosition = indexOfLastPosition - itemsPerPage;
  const currentPositions = positions.slice(indexOfFirstPosition, indexOfLastPosition);
  const totalPages = Math.ceil(positions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="positions">
      <h1>Positions</h1>
      
      <div className="add-position-form">
        <input
          type="text"
          placeholder="Position Name"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          className="position-input"
        />
        <button onClick={addPosition} className="add-button">Add Position</button>
      </div>

      {editingId && (
        <div className="edit-position-form">
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="position-input"
            placeholder="Edit Position Name"
          />
          <button onClick={savePosition} className="save-button">Save</button>
          <button onClick={() => setEditingId(null)} className="cancel-button">Cancel</button>
        </div>
      )}

      <table className="positions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPositions.length > 0 ? (
            currentPositions.map((position) => (
              <tr key={position.id}>
                <td>{position.id}</td>
                <td>{position.title}</td>
                <td>
                  <button onClick={() => startEditing(position)} className="edit-button">Edit</button>
                  <button onClick={() => deletePosition(position.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">Oops! There are no data.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`} 
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Positions;
