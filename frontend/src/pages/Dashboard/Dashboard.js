import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import FacultyDashboard from './FacultyDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (user.role === 'student') {
        return <StudentDashboard />;
    } else if (user.role === 'faculty') {
        return <FacultyDashboard />;
    } else {
        return <div className="container"><h2>Welcome, {user.role}</h2></div>;
    }
};

export default Dashboard;
