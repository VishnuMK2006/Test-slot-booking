import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithBarcode } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    
    // Using a ref to prevent double initialization in React Strict Mode (sometimes happens)
    const scannerRef = useRef(null);

    useEffect(() => {
        if (showScanner && !scannerRef.current) {
            const onScanSuccess = async (decodedText, decodedResult) => {
                // Handle the scanned code as you like, for example:
                console.log(`Code matched = ${decodedText}`, decodedResult);
                try {
                     await loginWithBarcode(decodedText);
                     scannerRef.current.clear(); // Stop scanning on success
                     navigate('/');
                } catch (err) {
                    setError(err.response?.data?.message || 'Barcode Login Failed');
                }
            };
            
            const onScanFailure = (error) => {
                // handle scan failure, usually better to ignore and keep scanning.
                // console.warn(`Code scan error = ${error}`);
            };
            
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );
            
            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        return () => {
             if (!showScanner && scannerRef.current) {
                 scannerRef.current.clear().catch(error => {
                     console.error("Failed to clear html5-qrcode scanner. ", error);
                 });
                 scannerRef.current = null;
             }
        };
    }, [showScanner, loginWithBarcode, navigate]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                 scannerRef.current.clear().catch(error => console.error("Failed to clear", error));
            }
        }
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <button 
                        type="button" 
                        className="btn" 
                        onClick={() => setShowScanner(!showScanner)}
                        style={{ background: '#333', color: 'white', width: '100%' }}
                    >
                        {showScanner ? 'Close Scanner' : 'Login with ID Card (Barcode)'}
                    </button>
                </div>

                {showScanner && (
                    <div id="reader" width="300px" style={{ marginBottom: '2rem' }}></div>
                )}

                {!showScanner && (
                    <form onSubmit={handleSubmit}>
                        <div style={{ position: 'relative', textAlign: 'center', margin: '1rem 0', color: '#888' }}>
                            <span>OR</span>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
