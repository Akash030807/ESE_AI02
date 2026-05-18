import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      await axios.post('http://localhost:5000/api/employees', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Employee stored successfully');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving employee');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Add New Employee</h2>
        
        {message && <div style={{ color: 'var(--success-color)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>{message}</div>}
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Skills (Comma separated)</label>
            <input type="text" name="skills" className="form-control" placeholder="e.g. React, Node.js, MongoDB" value={formData.skills} onChange={handleChange} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Performance Score (0-100)</label>
              <input type="number" name="performanceScore" className="form-control" min="0" max="100" value={formData.performanceScore} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" name="experience" className="form-control" min="0" value={formData.experience} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Add Employee</button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
