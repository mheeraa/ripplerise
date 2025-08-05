import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageModal from "../components/MessageModal";

function CreatePage() {
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "", location: "", organizer: ""
  });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // NEW: Get the token from localStorage
  const token = localStorage.getItem("userToken");
  
  // A helper function to get the headers, including Authorization if a token exists
  const getHeaders = (contentType = 'application/json') => {
    return {
      'Content-Type': contentType,
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    // Make sure a user is logged in before trying to create an event
    if (!token) {
        setMessage("You must be logged in to create an event.");
        setIsError(true);
        return;
    }

    try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: getHeaders(), // NEW: Use the getHeaders function
          body: JSON.stringify(form)
        });

        const data = await res.json();
        
        if (res.ok) {
          setMessage(data.message || "Event created successfully!");
          setIsError(false);
          setForm({ title: "", description: "", date: "", time: "", location: "", organizer: "" });
        } else {
          setMessage(data.message || "Failed to create event.");
          setIsError(true);
        }
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("Error creating event. Please check your connection.");
      setIsError(true);
    }
  };

  const handleCancel = () => {
    setForm({ title: "", description: "", date: "", time: "", location: "", organizer: "" });
    navigate("/");
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
      <h2 className="text-center">Add a New Event</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" id="title" name="title" className="form-input" placeholder="Title" required value={form.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea id="description" name="description" className="form-textarea" placeholder="Description" required value={form.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="date" className="form-label">Date</label>
          <input type="date" id="date" name="date" className="form-input" required value={form.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="time" className="form-label">Time</label>
          <input type="time" id="time" name="time" className="form-input" required value={form.time} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="location" className="form-label">Location</label>
          <input type="text" id="location" name="location" className="form-input" placeholder="Location" required value={form.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="organizer" className="form-label">Organizer</label>
          <input type="text" id="organizer" name="organizer" className="form-input" placeholder="Organizer (optional)" value={form.organizer} onChange={handleChange} />
        </div>
        <div className="form-actions" style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)' }}>
          <button type="submit" className="btn btn-primary">Create Event</button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;