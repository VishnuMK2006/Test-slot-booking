import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '1.5rem', fontWeight: 'bold' }}>
                ExamSys
            </Link>
            <div>
                {user ? (
                    <>
                        {user.role === 'faculty' && (
                            <Link to="/create-test" className="nav-link">Create Test</Link>
                        )}
                        <span className="nav-link" style={{ cursor: 'default' }}>Hello, {user.name}</span>
                        <button onClick={handleLogout} className="btn btn-primary" style={{ marginLeft: '1rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
