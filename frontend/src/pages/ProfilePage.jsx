import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../components/MessageModal'; // Ensure this is imported

function ProfilePage({ user, onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        website: ''
    });
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const token = localStorage.getItem('userToken');

    const fetchProfile = useCallback(async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/users/profile', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                setFormData({
                    username: data.data.username,
                    email: data.data.email,
                    bio: data.data.bio || '',
                    website: data.data.website || ''
                });
                onLogin(data.data, token);
            } else {
                setMessage(data.message || 'Failed to fetch profile.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage('Network error. Failed to fetch profile.');
            setIsError(true);
        }
    }, [token, navigate, onLogin]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        setFormData(prevFormData => ({ ...prevFormData, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);

        try {
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || 'Profile updated successfully!');
                setIsError(false);
                onLogin(data.data, token);
            } else {
                setMessage(data.message || 'Failed to update profile.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Network error. Failed to update profile.');
            setIsError(true);
        }
    };

    return (
        <div className="create-page-content">
            {message && (
                <MessageModal
                    message={message}
                    type={isError ? "error" : "success"}
                    onClose={() => setMessage(null)}
                />
            )}
            <h2 className="text-center">My Profile</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                        value={formData.username}
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
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        className="form-textarea"
                        placeholder="Tell us a little about yourself..."
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="website" className="form-label">Website</label>
                    <input
                        type="text"
                        id="website"
                        name="website"
                        className="form-input"
                        placeholder="Your website URL"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-actions" style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)' }}>
                    <button type="submit" className="btn btn-primary">Update Profile</button>
                </div>
            </form>
        </div>
    );
}

export default ProfilePage;