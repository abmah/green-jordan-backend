import {
  createEventService,
  getEventService,
  joinEventService,
  leaveEventService,
  getAllEventsService,
} from '../services/event.service.js';

export const createEventController = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.date) {
      return res.status(400).json({ message: 'Title, description, and date are required.' });
    }

    const event = await createEventService(req.body, req.file?.path); // Check if file exists
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

export const getEventController = async (req, res) => {
  try {
    const event = await getEventService(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

export const joinEventController = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const event = await joinEventService(req.params.id, userId);
    res.status(200).json({ message: 'Joined event successfully', event });
  } catch (error) {
    console.error(error);
    if (error.message === 'Event not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Already joined this event') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error joining event', error: error.message });
  }
};

export const leaveEventController = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const event = await leaveEventService(req.params.id, userId);
    res.status(200).json({ message: 'Left event successfully', event });
  } catch (error) {
    console.error(error);
    if (error.message === 'Event not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Not a participant of this event') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error leaving event', error: error.message });
  }
};

export const getAllEventsController = async (req, res) => {
  try {
    const events = await getAllEventsService();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};