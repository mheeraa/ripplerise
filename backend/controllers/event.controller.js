import Event from "../models/event.model.js";
import mongoose from "mongoose";

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.log("Error in fetching events", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createEvent = async (req, res) => {
    const { title, description, date, time, location, organizer } = req.body;
    
    const createdBy = req.user._id; 

    if (!title || !description || !date || !time || !location) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    const newEvent = new Event({
        title,
        description,
        date,
        time,
        location,
        organizer,
        user: createdBy
    });

    try {
        await newEvent.save();
        res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
        console.error("Error in creating event:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getEventById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Event Id" });
    }

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.status(200).json({ success: true, data: event });
    } catch (error) {
        console.error("Error in fetching event by ID:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, time, location, organizer } = req.body;
    
    const userId = req.user._id; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Event Id" });
    }

    try {
        const eventToUpdate = await Event.findById(id);

        if (!eventToUpdate) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (!eventToUpdate.user || eventToUpdate.user.toString() !== userId.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized to update this event" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { title, description, date, time, location, organizer },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: updatedEvent });

    } catch (error) {
        console.error("Error in updating event:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Event Id" });
    }

    try {
        const eventToDelete = await Event.findById(id);

        if (!eventToDelete) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (!eventToDelete.user || eventToDelete.user.toString() !== userId.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized to delete this event" });
        }

        await Event.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Event deleted" });

    } catch (error) {
        console.log("Error in deleting event", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const handleRSVP = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Event Id" });
    }
    if (!email) {
        return res.status(400).json({ success: false, message: "Please provide an email" });
    }
    
    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (event.rsvps.includes(email)) {
            return res.status(400).json({ success: false, message: "You have already RSVP'd to this event" });
        }
        
        const updatedEvent = await Event.findByIdAndUpdate(
            id, 
            { $push: { rsvps: email } },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedEvent, message: "RSVP successful" });
    } catch (error) {
        console.error("Error in handling RSVP:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};