import React, { useState } from 'react';
import { FaPaperPlane, FaBullhorn } from 'react-icons/fa';
import api from '../services/api';

function Broadcasts() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'all', // all, parent, teacher
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/notifications/broadcast', formData);
      setSuccess(response.data.message || 'Broadcast sent successfully!');
      setFormData({ title: '', message: '', targetRole: 'all' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send broadcast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <FaBullhorn className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Broadcast Updates</h2>
            <p className="text-sm text-gray-500">Send push notifications to all users or specific groups.</p>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
            <span>✅ {success}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. JAMB Update"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <select
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Users</option>
              <option value="parent">Parents Only</option>
              <option value="teacher">Teachers Only</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? 'Sending...' : <><FaPaperPlane /> Send Broadcast</>}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
        <strong>Note:</strong> This will send a push notification to all users who have the app installed and permissions granted. It will also create an in-app notification.
      </div>
    </div>
  );
}

export default Broadcasts;
