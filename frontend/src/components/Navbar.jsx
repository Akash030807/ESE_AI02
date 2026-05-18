import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">AI Analytics</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Employees</Link>
        <Link to="/add-employee" className="nav-link">Add Employee</Link>
        <Link to="/ai-recommendations" className="nav-link">AI Recommendations</Link>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
