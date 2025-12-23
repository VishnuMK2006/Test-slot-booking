import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const StudentDashboard = () => {
    const [availableTests, setAvailableTests] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [myAttempts, setMyAttempts] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const testsRes = await api.get('/tests');
                setAvailableTests(testsRes.data);

                const regsRes = await api.get('/exam/registrations');
                setMyRegistrations(regsRes.data);

                const attemptsRes = await api.get('/exam/attempts');
                setMyAttempts(attemptsRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const handleRegister = async (testId) => {
        try {
            await api.post(`/exam/register/${testId}`);
            alert('Registered successfully!');
            // Refresh
            const regsRes = await api.get('/exam/registrations');
            setMyRegistrations(regsRes.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    const isRegistered = (testId) => {
        return myRegistrations.some(reg => reg.test._id === testId);
    };

    const handleStartTest = (testId) => {
        navigate(`/exam/${testId}`);
    };

    const now = new Date();

    // Categorization Logic
    const upcomingTests = availableTests.filter(test => new Date(test.startTime) > now);
    
    // Attempted: Actually completed attempts
    const attemptedTests = myAttempts.filter(att => att.status === 'completed').map(att => att.test);
    
    // Unattempted: 
    // 1. Not registered AND expired
    // 2. Registered AND expired AND not attempted
    // Basically: Expired AND Not Completed
    const unattemptedTests = availableTests.filter(test => {
        const isExpired = new Date(test.endTime) < now;
        const hasAttempted = myAttempts.some(att => att.test._id === test._id && att.status === 'completed');
        return isExpired && !hasAttempted;
    });

    const getTestStatus = (test) => {
        const attempt = myAttempts.find(att => att.test._id === test._id);
        const registered = isRegistered(test._id);
        const startTime = new Date(test.startTime);
        const endTime = new Date(test.endTime);

        if (attempt && attempt.status === 'completed') return 'COMPLETED';
        if (now > endTime) return 'EXPIRED';
        if (registered) {
            if (now < startTime) return 'UPCOMING_REGISTERED';
            return 'READY_TO_START';
        }
        if (now < startTime) return 'UPCOMING_UNREGISTERED';
        return 'OPEN_FOR_REGISTRATION';
    };

    const renderTestCard = (test) => {
        const status = getTestStatus(test);
        const attempt = myAttempts.find(att => att.test._id === test._id);

        let buttonContent = null;
        let cardStyle = {};

        switch (status) {
            case 'COMPLETED':
                buttonContent = <button className="btn" disabled style={{ background: 'green', color: 'white', width: '100%', cursor: 'default' }}>Completed (Score: {attempt?.score})</button>;
                cardStyle = { borderLeft: '5px solid green' };
                break;
            case 'EXPIRED':
                buttonContent = <button className="btn" disabled style={{ background: '#ccc', width: '100%', cursor: 'not-allowed' }}>Missed / Expired</button>;
                cardStyle = { borderLeft: '5px solid gray' };
                break;
            case 'UPCOMING_REGISTERED':
                buttonContent = <button className="btn" disabled style={{ background: '#FFC107', color: 'black', width: '100%', cursor: 'default' }}>Registered (Starts Soon)</button>;
                cardStyle = { borderLeft: '5px solid #FFC107' };
                break;
            case 'READY_TO_START':
                buttonContent = <button className="btn btn-primary" onClick={() => handleStartTest(test._id)} style={{ width: '100%' }}>Start Test</button>;
                cardStyle = { borderLeft: '5px solid #4F46E5' };
                break;
            case 'UPCOMING_UNREGISTERED':
                 buttonContent = <button className="btn btn-primary" onClick={() => handleRegister(test._id)} style={{ width: '100%' }}>Register</button>;
                 break;
            case 'OPEN_FOR_REGISTRATION':
                 buttonContent = <button className="btn btn-primary" onClick={() => handleRegister(test._id)} style={{ width: '100%' }}>Register</button>;
                 break;
            default:
                break;
        }

        return (
            <div key={test._id} className="card" style={cardStyle}>
                <h4>{test.title}</h4>
                <p>Window: {new Date(test.startTime).toLocaleString()} - {new Date(test.endTime).toLocaleString()}</p>
                <p>Seats: {test.maxStudents}</p>
                {buttonContent}
            </div>
        );
    };

    return (
        <div className="container">
            <h2>Student Dashboard</h2>
            
            <div style={{ display: 'flex', gap: '1rem', margin: '2rem 0', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                {['all', 'upcoming', 'unattempted', 'attempted'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            borderBottom: activeTab === tab ? '2px solid blue' : 'none', 
                            cursor: 'pointer',
                            fontWeight: activeTab === tab ? 'bold' : 'normal',
                            fontSize: '1rem',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab} Assessments
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {activeTab === 'all' && availableTests.map(test => renderTestCard(test))}
                
                {activeTab === 'upcoming' && upcomingTests.map(test => renderTestCard(test))}

                {activeTab === 'unattempted' && unattemptedTests.map(test => renderTestCard(test))}

                {activeTab === 'attempted' && attemptedTests.map(test => renderTestCard(test))}
            </div>
            
            {(activeTab === 'upcoming' && upcomingTests.length === 0) && <p>No upcoming assessments.</p>}
            {(activeTab === 'unattempted' && unattemptedTests.length === 0) && <p>No unattempted assessments.</p>}
            {(activeTab === 'attempted' && attemptedTests.length === 0) && <p>No completed attempts.</p>}

        </div>
    );
};

export default StudentDashboard;
