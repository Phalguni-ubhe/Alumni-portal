const initialUsers = [
  {
    id: 1,
    name: "Phalguni Ubhe",
    email: "phalguni@mitwpu.edu.in",
    passwordHash: "$2a$10$wT0sZfAilbKxR9sD8B3X4u.x0k5I3rD/xVqYmC7P5F1O2W8kRzO.a", // 'Admin@123'
    role: "Admin"
  },
  {
    id: 2,
    name: "Test Student",
    email: "student@mitwpu.edu.in",
    passwordHash: "$2a$10$wT0sZfAilbKxR9sD8B3X4u.x0k5I3rD/xVqYmC7P5F1O2W8kRzO.a", // 'Student@123'
    role: "Student"
  }
];

const initialEvents = [
  {
    id: 1,
    title: "Resume Building Workshop",
    date: "12/20/2026",
    description: "Learn how to pass ATS scanners and stand out to technical hiring managers.",
    registeredUsers: [2]
  },
  {
    id: 2,
    title: "Tech Career Fair 2026",
    date: "01/15/2027",
    description: "Meet top tech recruiters, founders, and college alumni on campus.",
    registeredUsers: []
  },
  {
    id: 3,
    title: "Alumni Networking Mixer",
    date: "02/10/2027",
    description: "Casual evening networking and panel discussion with recent graduates.",
    registeredUsers: []
  }
];

const initialAlumni = [
  {
    id: 1,
    name: "Alice Alumni",
    graduationYear: 2020,
    company: "Google",
    jobTitle: "Software Engineer",
    location: "Bangalore"
  },
  {
    id: 2,
    name: "Bob Alumni",
    graduationYear: 2018,
    company: "Microsoft",
    jobTitle: "Product Manager",
    location: "Hyderabad"
  }
];

module.exports = {
  users: initialUsers,
  events: initialEvents,
  alumni: initialAlumni
};