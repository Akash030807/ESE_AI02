import { useState, useEffect } from 'react';
import axios from 'axios';

const AIRecommendation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  const generateRecommendation = async () => {
    setLoading(true);
    setError('');
    setRecommendation('');
    try {
      const token = localStorage.getItem('token');
      const payload = selectedEmployee ? { employeeId: selectedEmployee } : {};
      
      const res = await axios.post('http://localhost:5000/api/ai/recommend', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRecommendation(res.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating AI recommendation. Check OpenRouter API key.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to nicely format the Markdown-ish output from AI
  const formatText = (text) => {
    return text.split('\n').map((str, idx) => (
      <p key={idx} style={{ marginBottom: '0.5rem' }}>{str}</p>
    ));
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ background: 'linear-gradient(to right, #a855f7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            ✨ AI Insights & Recommendations
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Get intelligent rankings, promotion suggestions, and feedback based on performance.</p>
        </div>

        <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label>Select Employee (Leave blank for overall rankings)</label>
            <select 
              className="form-control" 
              value={selectedEmployee} 
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">-- All Employees (Rankings & Suggestions) --</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
          </div>
          <button 
            onClick={generateRecommendation} 
            className="btn btn-primary" 
            disabled={loading}
            style={{ height: '45px', minWidth: '150px' }}
          >
            {loading ? 'Analyzing...' : 'Generate ✨'}
          </button>
        </div>

        {error && <div style={{ color: 'var(--danger-color)', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginTop: '1rem' }}>{error}</div>}

        {recommendation && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#a855f7' }}>AI Analysis Result</h3>
            <div style={{ lineHeight: '1.6', color: 'var(--text-primary)' }}>
              {formatText(recommendation)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
