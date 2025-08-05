import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) { 
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || 'Login successful!');
                setIsError(false);
                
                onLogin(data.user, data.token); 

                navigate('/'); 
            } else {
                setMessage(data.message || 'Login failed.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('Network error. Please try again.');
            setIsError(true);
        }
    };

    return (
        <div className="create-page-content">
            {message && (
                <div className={`message-modal ${isError ? 'message-error' : 'message-success'}`}>
                    <p>{message}</p>
                </div>
            )}
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="Enter password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-actions" style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
                <p className="text-center" style={{ marginTop: 'var(--spacing-md)' }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;