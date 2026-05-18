import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employeesState, setEmployeesState] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (query = '') => {
    try {
      const token = localStorage.getItem('token');
      const url = query 
        ? `http://localhost:5000/api/employees/search?department=${query}` 
        : 'http://localhost:5000/api/employees';
        
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployeesState(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchEmployees(search);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Employee Directory</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by Department..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '250px' }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading employees...</p>
        ) : employeesState.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Score</th>
                  <th>Experience</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeesState.map(emp => (
                  <tr key={emp._id}>
                    <td style={{ fontWeight: 500 }}>
                      <div style={{ color: 'var(--text-primary)' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                    </td>
                    <td>{emp.department}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: emp.performanceScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: emp.performanceScore >= 80 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                        {emp.performanceScore}/100
                      </span>
                    </td>
                    <td>{emp.experience} yrs</td>
                    <td>
                      {emp.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="badge">{skill}</span>
                      ))}
                      {emp.skills.length > 3 && <span className="badge">+{emp.skills.length - 3}</span>}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(emp._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
