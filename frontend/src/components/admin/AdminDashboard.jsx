import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/api';

const monthOptions = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    month: '',
    week: '',
    total: '',
    completed: '',
    names: '',
  });

  const [progressList, setProgressList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/progress/add', form);
      alert('Progress added successfully');
      setForm({ month: '', week: '', total: '', completed: '', names: '' });
      fetchProgress(); // refresh list
    } catch (err) {
      alert('Error posting data');
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress/all');
      setProgressList(res.data);
    } catch (err) {
      console.error('Error fetching progress', err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  // Filtered list based on selected month
  const filteredProgress = selectedMonth
    ? progressList.filter((item) => item.month === selectedMonth)
    : progressList;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-gray-800 px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
        >
          Logout
        </button>
      </nav>

      {/* Form Section */}
      <div className="flex flex-col items-center justify-start p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 w-full max-w-xl"
        >
          <h2 className="text-2xl font-bold text-center">📋 Post Progress</h2>

          <input
            type="text"
            placeholder="Month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="text"
            placeholder="Week"
            value={form.week}
            onChange={(e) => setForm({ ...form, week: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="number"
            placeholder="Total Members"
            value={form.total}
            onChange={(e) => setForm({ ...form, total: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="number"
            placeholder="Completed Members"
            value={form.completed}
            onChange={(e) => setForm({ ...form, completed: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <textarea
            placeholder="Completed Member Names"
            value={form.names}
            onChange={(e) => setForm({ ...form, names: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={4}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
          >
            Submit
          </button>
        </form>

        {/* Month Selector */}
        <div className="w-full max-w-xl mt-8">
          <label htmlFor="monthSelector" className="block mb-2 text-lg font-semibold">
            🔍 Filter by Month
          </label>
          <select
            id="monthSelector"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            {monthOptions.map((m, idx) => (
              <option key={idx} value={m}>
                {m === '' ? '-- All Months --' : m}
              </option>
            ))}
          </select>
        </div>

        {/* Filtered Progress Display */}
        <div className="w-full max-w-3xl mt-8">
          <h2 className="text-xl font-semibold mb-4">
            📊 Progress {selectedMonth ? `for ${selectedMonth}` : ''}
          </h2>
          {filteredProgress.length === 0 ? (
            <p>No data available</p>
          ) : (
            <div className="space-y-4">
              {filteredProgress.map((item, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow">
                  <p><strong>📅 Month:</strong> {item.month}</p>
                  <p><strong>🗓️ Week:</strong> {item.week}</p>
                  <p><strong>👥 Total Members:</strong> {item.total}</p>
                  <p><strong>✅ Completed:</strong> {item.completed}</p>
                  <p><strong>📝 Names:</strong> {item.names}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
