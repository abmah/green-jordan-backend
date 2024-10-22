import Event from '../models/event.model.js';

export const createEventService = async (eventData, imagePath) => {
  if (!eventData.title || !eventData.description || !eventData.date) {
    throw new Error('Title, description, and date are required.');
  }

  const event = new Event({
    title: eventData.title,
    description: eventData.description,
    image: imagePath || null, // Set to null if no image provided
    date: eventData.date,
    requiredParticipants: eventData.requiredParticipants,
  });

  return await event.save();
};

export const getEventService = async (eventId) => {
  const event = await Event.findById(eventId).populate('participants');
  if (!event) {
    throw new Error('Event not found');
  }
  return event;
};

export const joinEventService = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');

  if (event.participants.includes(userId)) {
    throw new Error('Already joined this event');
  }

  event.participants.push(userId);
  return await event.save();
};

export const leaveEventService = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');

  if (!event.participants.includes(userId)) {
    throw new Error('Not a participant of this event');
  }

  event.participants.pull(userId);
  return await event.save();
};

export const getAllEventsService = async () => {
  return await Event.find().populate('participants');
};