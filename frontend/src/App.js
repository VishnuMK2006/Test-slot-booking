import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateTest from './pages/Test/CreateTest';
import ExamPage from './pages/Test/ExamPage';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exam/:testId" element={<ExamPage />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={['faculty', 'admin']} />}>
            <Route path="/create-test" element={<CreateTest />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
