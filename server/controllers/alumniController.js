const { alumni, users, events } = require('../config/db');

let nextAlumniId = 3;

exports.getAllAlumni = (req, res) => {
  res.json(alumni);
};

exports.createAlumni = (req, res) => {
  const { name, company, jobTitle, graduationYear, location } = req.body;
  if (!name || !company || !jobTitle) {
    return res.status(400).json({ message: 'Name, company, and job title are required' });
  }

  const newAlumnus = {
    id: nextAlumniId++,
    name: name.trim(),
    company: company.trim(),
    jobTitle: jobTitle.trim(),
    graduationYear: Number(graduationYear) || 2024,
    location: location || 'Pune'
  };

  alumni.push(newAlumnus);
  res.status(201).json(newAlumnus);
};

exports.getAdminStats = (req, res) => {
  const totalRegistrations = events.reduce((acc, ev) => acc + ev.registeredUsers.length, 0);
  res.json({
    totalUsers: users.length,
    totalEvents: events.length,
    totalRegistrations: totalRegistrations
  });
};