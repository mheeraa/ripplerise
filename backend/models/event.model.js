import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    organizer: {
        type: String,
        default: "Anonymous",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rsvps: {
        type: [String],
        default: []
    },
}, {
    timestamps: true // createdAt, updatedAt
});

const Event = mongoose.model('Event', eventSchema)

export default Event;