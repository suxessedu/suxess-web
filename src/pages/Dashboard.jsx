import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaHourglassHalf,
  FaLink,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatCard({ value, label, icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 ${bg} ${color}`}
      >
        {icon}
      </div>
      <div>
        <span className="block text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
    </div>
  );
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      grid: { drawBorder: false, color: "#f3f4f6" },
      ticks: { stepSize: 5 },
    },
    x: { grid: { display: false } },
  },
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, logsRes, requestsRes, chartRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/activity-logs"),
          api.get("/admin/recent-requests"),
          api.get("/admin/chart-data"),
        ]);

        setStats(statsRes.data);
        setLogs(logsRes.data);
        setRecentRequests(requestsRes.data);
        setChartData({
          labels: chartRes.data.labels,
          datasets: [
            {
              label: "Requests",
              data: chartRes.data.data,
              backgroundColor: "#FFD700",
              borderRadius: 4,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
           Welcome back, Admin
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          value={stats.parents}
          label="Total Parents"
          icon={<FaUserGraduate />}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          value={stats.teachers}
          label="Total Teachers"
          icon={<FaChalkboardTeacher />}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          value={stats.pending}
          label="Pending Requests"
          icon={<FaHourglassHalf />}
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
        <StatCard
          value={stats.matched}
          label="Matched Engagements"
          icon={<FaLink />}
          color="text-cyan-600"
          bg="bg-cyan-50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Requests</h3>
          <div className="h-[320px]">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Recent Requests List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Requests</h3>
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {recentRequests.length > 0 ? (
              recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{req.parentName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{req.subjects}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      req.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No recent requests.</p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {log.userName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.details}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                 <tr>
                   <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                     No recent activity found.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
