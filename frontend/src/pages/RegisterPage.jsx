import { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const { username, email, password, confirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match!');
            setIsError(true);
            return;
        }

        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || 'Registration successful!');
                setIsError(false);
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            } else {
                setMessage(data.message || 'Registration failed.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error during registration:', error);
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
            <h2 className="text-center">Register</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                        placeholder="Enter username"
                        value={username}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-input"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-actions" style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary">Register</button>
                </div>
                <p className="text-center" style={{ marginTop: 'var(--spacing-md)' }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;