import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
        role: 'student', // Default
        barcode: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Signup</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Name</label>
                        <input name="name" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input name="email" type="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Mobile</label>
                        <input name="mobile" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input name="password" type="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Role</label>
                        <select name="role" className="form-control" onChange={handleChange} value={formData.role}>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                    </div>
                    {/* Optional Barcode Input */}
                    <div className="input-group">
                        <label className="input-label">Barcode (Optional)</label>
                        <input name="barcode" className="form-control" onChange={handleChange} placeholder="Scan or enter barcode" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Signup
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
