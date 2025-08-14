import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [weekAnalysis, setWeekAnalysis] = useState(null);

  const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#8884d8', '#0088FE'];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/user/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/progress/all');
      setAllData(res.data);
      if (res.data.length > 0) {
        const latestMonth = res.data[res.data.length - 1].month;
        setSelectedMonth(latestMonth);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = allData.filter(item => item.month === selectedMonth);

    const weekly = filtered.map(item => ({
      name: `Week ${item.week}`,
      percentage: ((item.completed / item.total) * 100).toFixed(2),
      total: item.total,
      completed: item.completed,
      remaining: item.total - item.completed,
      names: item.names || '',
    }));
    setWeeklyData(weekly);

    if (weekly.length > 1) {
      const percentages = weekly.map(w => parseFloat(w.percentage));
      const totalGrowth = percentages[percentages.length - 1] - percentages[0];

      const avgCompleted = Math.round(
        weekly.reduce((acc, w) => acc + w.completed, 0) / weekly.length
      );

      setWeekAnalysis({
        weeksCount: weekly.length,
        growth: totalGrowth.toFixed(2),
        avgCompleted,
        totalMembers: 10,
      });
    } else {
      setWeekAnalysis(null);
    }

    const monthlyMap = {};
    allData.forEach(item => {
      if (!monthlyMap[item.month]) {
        monthlyMap[item.month] = { completed: 0, total: 0 };
      }
      monthlyMap[item.month].completed += item.completed;
      monthlyMap[item.month].total += item.total;
    });

    const monthly = Object.keys(monthlyMap).map(month => {
      const { completed, total } = monthlyMap[month];
      return {
        name: month,
        value: Math.round((completed / total) * 100),
        completed,
        total,
        remaining: total - completed,
      };
    });
    setMonthlyData(monthly);

    const sortedMonths = Object.keys(monthlyMap).sort((a, b) =>
      new Date(`01 ${a} 2023`) - new Date(`01 ${b} 2023`)
    );
    const currentIndex = sortedMonths.indexOf(selectedMonth);
    if (currentIndex > 0) {
      const curr = monthly.find(m => m.name === selectedMonth);
      const prev = monthly.find(m => m.name === sortedMonths[currentIndex - 1]);
      const diff = curr.value - prev.value;
      setComparison(diff);
    } else {
      setComparison(null);
    }
  }, [allData, selectedMonth]);

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const { total, completed, remaining, names } = payload[0].payload;
      return (
        <div className="bg-white text-black p-3 rounded shadow">
          <p><strong>Total:</strong> {total}</p>
          <p><strong>Completed:</strong> {completed}</p>
          <p><strong>Remaining:</strong> {remaining}</p>
          <p><strong>Names:</strong><br />{names.split(',').map(name => <div key={name}>- {name.trim()}</div>)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const { name, total, completed, remaining } = payload[0].payload;
      return (
        <div className="bg-white text-black p-3 rounded shadow">
          <p><strong>{name}</strong></p>
          <p>Total: {total}</p>
          <p>Completed: {completed}</p>
          <p>Remaining: {remaining}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <nav className="w-full bg-gray-800 px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
        >Logout</button>
      </nav>

      <motion.div
        className="px-6 mt-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <label className="block text-sm font-medium mb-1">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="text-black p-2 rounded bg-white"
        >
          {[...new Set(allData.map(d => d.month))].map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </motion.div>

      <div className="p-6">
        <motion.h2 className="text-2xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          📊 Weekly Progress - {selectedMonth}
        </motion.h2>
        {weeklyData.length === 0 ? (
          <p>No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="percentage" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {weekAnalysis && (
        <motion.div className="mt-4 mx-6 p-4 bg-gray-800 rounded text-center space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-lg font-bold text-blue-300">
            🗓️ {weekAnalysis.weeksCount} Weeks Data Found
          </p>
          <p className={weekAnalysis.growth >= 0 ? "text-green-400" : "text-red-400"}>
            {weekAnalysis.growth >= 0 ? `📈 Weekly Growth: +${weekAnalysis.growth}%` : `📉 Weekly Drop: ${Math.abs(weekAnalysis.growth)}%`}
          </p>
          <p className="text-yellow-300">
            ⚡ Efficiency: {weekAnalysis.avgCompleted}/{weekAnalysis.totalMembers} members active (avg.)
          </p>
        </motion.div>
      )}

      <div className="p-6">
        <motion.h2 className="text-2xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          📈 Monthly Completion
        </motion.h2>

        {monthlyData.length === 0 ? (
          <p>No monthly data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={monthlyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {monthlyData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {comparison !== null && (
          <motion.div className="text-center mt-4 text-lg font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {comparison > 0 ? (
              <span className="text-green-400">📈 Growth: +{comparison}% compared to last month</span>
            ) : (
              <span className="text-red-400">📉 Drop: {Math.abs(comparison)}% compared to last month</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
