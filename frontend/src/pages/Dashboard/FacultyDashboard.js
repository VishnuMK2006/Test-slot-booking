import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FacultyDashboard = () => {
    const [tests, setTests] = useState([]);

    const fetchTests = async () => {
        try {
            const { data } = await api.get('/tests');
            setTests(data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    useEffect(() => {
        fetchTests();
        // Poll every 5 seconds for realtime updates
        const interval = setInterval(fetchTests, 5000);
        return () => clearInterval(interval);
    }, []);

    // Prepare data for the graph
    const data = tests.map(test => ({
        name: test.title,
        Registered: test.registrationCount || 0,
        Capacity: test.maxStudents
    }));

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Faculty Dashboard</h2>
                <Link to="/create-test" className="btn btn-primary" style={{ textDecoration: 'none' }}>Create New Test</Link>
            </div>

            <div className="card" style={{ marginBottom: '2rem', height: '400px' }}>
                <h3>Registrations Overview</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Registered" fill="#4F46E5" />
                        <Bar dataKey="Capacity" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <h3>My Tests</h3>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {tests.map(test => (
                    <div key={test._id} className="card">
                        <h4>{test.title}</h4>
                        <p>Start: {new Date(test.startTime).toLocaleString()}</p>
                        <p>End: {new Date(test.endTime).toLocaleString()}</p>
                        <p><strong>Registrations: {test.registrationCount || 0} / {test.maxStudents}</strong></p>
                        <p>Max Attempts: {test.maxAttempts}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacultyDashboard;
