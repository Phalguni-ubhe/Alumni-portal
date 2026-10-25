const { events } = require('../config/db');

exports.getAllEvents = (req, res) => {
  res.json(events);
};

exports.registerForEvent = (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const event = events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.registeredUsers.includes(req.user.id)) {
    return res.status(400).json({ message: 'Already registered for this event' });
  }

  event.registeredUsers.push(req.user.id);
  res.json({ message: 'Successfully registered for event', event });
};