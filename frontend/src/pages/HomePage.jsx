import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Pencil, MailPlus, Plus } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import MessageModal from "../components/MessageModal";

function HomePage() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [rsvpInputs, setRsvpInputs] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const token = localStorage.getItem("userToken");

  const getHeaders = (contentType = 'application/json') => {
    return {
      'Content-Type': contentType,
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/events");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setEvents(data.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setMessage("Failed to load events. Please try again later.");
        setIsError(true);
      }
    };

    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setLoggedInUserId(user.id);
      } catch (e) {
        console.error("Failed to parse user info from localStorage", e);
      }
    }
    
    fetchEvents();
  }, []);

  const handleDeleteClick = (id) => {
    setEventToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirmModal(false);
    if (!eventToDeleteId) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventToDeleteId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        setEvents(events.filter((event) => event._id !== eventToDeleteId));
        setMessage("Event deleted successfully!");
        setIsError(false);
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to delete event.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage("Error deleting event. Please check your connection.");
      setIsError(true);
    } finally {
      setEventToDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmModal(false);
    setEventToDeleteId(null);
  };

  const handleEditChange = (e) => {
    setEditingEvent({ ...editingEvent, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(editingEvent),
      });
      if (res.ok) {
        const updated = await res.json();
        setEvents(events.map((ev) => (ev._id === editingEvent._id ? updated.data : ev)));
        setEditingEvent(null);
        setMessage("Event updated successfully!");
        setIsError(false);
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to update event.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Something went wrong during update. Please try again.");
      setIsError(true);
    }
  };

  const handleRSVP = async (e, id) => {
    e.preventDefault();
    const email = rsvpInputs[id];
    if (!email) {
      setMessage("Please enter an email for RSVP.");
      setIsError(true);
      return;
    }
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}/rsvp`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const updated = await res.json();
        setEvents(events.map(ev => ev._id === id ? updated.data : ev));
        setRsvpInputs({ ...rsvpInputs, [id]: "" });
        setMessage("RSVP successful!");
        setIsError(false);
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to RSVP.");
        setIsError(true);
      }
    } catch (error) {
      console.error("RSVP error:", error);
      setMessage("Something went wrong during RSVP. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="homepage-content">
      {message && (
        <MessageModal
          message={message}
          type={isError ? "error" : "success"}
          onClose={() => setMessage(null)}
        />
      )}

      <section className="intro-section">
        <h1>Welcome to RippleRise</h1>
        <p>
          RippleRise is a community-driven platform to share and discover events that spark connection, collaboration, and change.
          Whether you're organizing a charity drive, a clean-up campaign, or a wellness workshop, RippleRise helps you ripple your impact.
        </p>
        <Link to="/create" className="intro-cta-button">
          Discover & Create Events <Plus size={20} style={{ marginLeft: "10px" }} />
        </Link>
      </section>

      <h2 className="text-center">Upcoming Community Events</h2>
      {events.length === 0 ? (
        <p className="text-center">No events available yet.</p>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <div className="card" key={event._id}>
              <h3 className="card-title">{event.title}</h3>
              <p className="card-description">{event.description}</p>
              <p className="card-details"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p className="card-details"><strong>Time:</strong> {event.time}</p>
              <p className="card-details"><strong>Location:</strong> {event.location}</p>
              <p className="card-details"><strong>Organizer:</strong> {event.organizer}</p>

              <form onSubmit={(e) => handleRSVP(e, event._id)} className="form">
                <div className="form-input-group">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="RSVP email"
                    required
                    value={rsvpInputs[event._id] || ""}
                    onChange={(e) => setRsvpInputs({ ...rsvpInputs, [event._id]: e.target.value })}
                  />
                  <button type="submit" className="btn-icon rsvp-icon">
                    <MailPlus size={16}/>
                  </button>
                </div>
              </form>

              <div className="card-footer">
                <p className="rsvp-count">{event.rsvps ? event.rsvps.length : 0} people RSVPed</p>
                <div className="action-icons">
                  {loggedInUserId && event.user && event.user.toString() === loggedInUserId && (
                    <>
                      <button className="btn-icon delete-icon" onClick={() => handleDeleteClick(event._id)}>
                        <Trash2 size={16}/>
                      </button>
                      <button className="btn-icon edit-icon" onClick={() => setEditingEvent(event)}>
                        <Pencil size={16}/>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Event</h3>
            <form onSubmit={handleUpdate} className="form">
              <div className="form-group">
                <label htmlFor="edit-title" className="form-label">Title</label>
                <input type="text" id="edit-title" name="title" className="form-input" placeholder="Title" value={editingEvent.title} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="edit-description" className="form-label">Description</label>
                <textarea id="edit-description" name="description" className="form-textarea" placeholder="Description" value={editingEvent.description} onChange={handleEditChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="edit-date" className="form-label">Date</label>
                <input type="date" id="edit-date" name="date" className="form-input" value={editingEvent.date} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="edit-time" className="form-label">Time</label>
                <input type="time" id="edit-time" name="time" className="form-input" value={editingEvent.time} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="edit-location" className="form-label">Location</label>
                <input type="text" id="edit-location" name="location" className="form-input" placeholder="Location" value={editingEvent.location} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="edit-organizer" className="form-label">Organizer</label>
                <input type="text" id="edit-organizer" name="organizer" className="form-input" placeholder="Organizer (optional)" value={editingEvent.organizer} onChange={handleEditChange} />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Update Event</button>
                <button type="button" onClick={() => setEditingEvent(null)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this event?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      <section className="section-content">
        <div className="contact-section">
          <h3>Contact Us</h3>
          <p>Have questions, ideas, or want to collaborate?</p>
          <p>Email us at: <a href="mailto:ripplerise@community.org">ripplerise@community.org</a></p>
          <p className="disclaimer">*This is a demo application. Contact features are for display purposes only.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;