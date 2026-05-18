import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeList from './pages/EmployeeList';
import EmployeeRegistration from './pages/EmployeeRegistration';
import AIRecommendation from './pages/AIRecommendation';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        } />
        <Route path="/add-employee" element={
          <ProtectedRoute>
            <EmployeeRegistration />
          </ProtectedRoute>
        } />
        <Route path="/ai-recommendations" element={
          <ProtectedRoute>
            <AIRecommendation />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
