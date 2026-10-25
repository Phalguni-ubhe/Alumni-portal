import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('alumni_token') || '');
  const [view, setView] = useState('home'); // 'home', 'login', 'events', 'alumni', 'admin'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState([]);
  const [alumniList, setAlumniList] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalRegistrations: 0 });

  // Profile Form state
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  useEffect(() => {
    if (token) {
      loadInitialData();
    }
  }, [token]);

  const loadInitialData = async () => {
    try {
      const [evRes, alRes] = await Promise.all([
        axios.get(`${API_BASE}/events`),
        axios.get(`${API_BASE}/alumni`)
      ]);
      setEvents(evRes.data);
      setAlumniList(alRes.data);

      if (user?.role === 'Admin') {
        const statsRes = await axios.get(`${API_BASE}/alumni/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      setToken(res.data.accessToken);
      setUser(res.data.user);
      localStorage.setItem('alumni_token', res.data.accessToken);
      setView('events');
      loadInitialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('alumni_token');
    setView('home');
  };

  const registerEvent = async (id) => {
    try {
      await axios.post(`${API_BASE}/events/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Registered successfully!');
      loadInitialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    }
  };

  const handleAddAlumni = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/alumni`, {
        name: user.name,
        company,
        jobTitle,
        graduationYear
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Career profile updated!');
      setCompany('');
      setJobTitle('');
      setGraduationYear('');
      loadInitialData();
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header matching your screenshot */}
      <header className="topbar">
        <div className="font-bold text-lg cursor-pointer" onClick={() => setView(token ? 'events' : 'home')}>
          College Portal
        </div>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-slate-300">Welcome, {user.name}</span>
              <button onClick={() => setView('events')} className="hover:text-blue-400">Events</button>
              <button onClick={() => setView('alumni')} className="hover:text-blue-400">Alumni</button>
              {user.role === 'Admin' && (
                <button onClick={() => setView('admin')} className="hover:text-blue-400">Admin</button>
              )}
              <button onClick={handleLogout} className="btn-danger">Logout</button>
            </>
          ) : (
            <button onClick={() => setView('login')} className="btn-primary text-xs">Sign In</button>
          )}
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        {/* Landing View */}
        {view === 'home' && (
          <div className="text-center py-24">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">Connect. Engage. Grow.</h1>
            <p className="mt-4 text-slate-500 max-w-lg mx-auto">
              The unified platform for student event registrations, alumni networking, and campus career opportunities.
            </p>
            <button onClick={() => setView('login')} className="mt-8 btn-primary text-base px-8 py-3 rounded-lg shadow-lg">
              Sign In to Dashboard
            </button>
          </div>
        )}

        {/* Login Card */}
        {view === 'login' && (
          <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-center text-slate-800 mb-6">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="name@mitwpu.edu.in"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5">Login</button>
            </form>
          </div>
        )}

        {/* Events View */}
        {view === 'events' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{ev.title}</h3>
                    <span className="text-xs text-red-500 font-medium block mt-1">📅 {ev.date}</span>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ev.description}</p>
                  </div>
                  <button onClick={() => registerEvent(ev.id)} className="mt-4 w-full btn-primary text-xs py-2">
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alumni Profile & Directory */}
        {view === 'alumni' && (
          <div className="space-y-10">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md">
              <h3 className="text-base font-bold text-slate-800 mb-4">Update Career Profile</h3>
              <form onSubmit={handleAddAlumni} className="space-y-3">
                <input
                  type="text"
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs"
                  required
                />
                <input
                  type="number"
                  placeholder="Graduation Year"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs"
                  required
                />
                <button type="submit" className="w-full btn-primary text-xs py-2">Save Profile</button>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Alumni Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumniList.map((al) => (
                  <div key={al.id} className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800">{al.name}</h4>
                    <span className="text-xs text-slate-500">Class of {al.graduationYear}</span>
                    <p className="text-xs text-blue-600 font-medium mt-1">{al.jobTitle} at {al.company}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {view === 'admin' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">System Overview</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Total Users</span>
                <strong className="text-3xl text-blue-600 block mt-2">{stats.totalUsers}</strong>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Total Events</span>
                <strong className="text-3xl text-blue-600 block mt-2">{stats.totalEvents}</strong>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Total Registrations</span>
                <strong className="text-3xl text-blue-600 block mt-2">{stats.totalRegistrations}</strong>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}