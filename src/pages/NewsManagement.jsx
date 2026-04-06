import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../services/api';
import { FaPaperPlane, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetRole: 'all',
    sendPush: true, 
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/news/');
      setNews(res.data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (error) {
      alert("Failed to delete news.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/news/', formData);
      setShowForm(false);
      setFormData({ title: '', content: '', targetRole: 'all', sendPush: true });
      fetchNews();
      alert("News published successfully!");
    } catch (error) {
        console.error(error);
      alert("Failed to publish news.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">News & Updates</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700 transition-all w-full md:w-auto justify-center"
        >
          {showForm ? 'Cancel' : <><FaPlus /> Create News</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8 animate-slide-down">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Publish New Update</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Important Exam Update"
              />
            </div>

            <div className="h-64 mb-12">
               <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
               <ReactQuill 
                 theme="snow" 
                 value={formData.content} 
                 onChange={content => setFormData({...formData, content})}
                 className="h-48"
               />
            </div>
            
            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <select
                        value={formData.targetRole}
                        onChange={e => setFormData({...formData, targetRole: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                    >
                        <option value="all">All Users</option>
                        <option value="parent">Parents Only</option>
                        <option value="teacher">Teachers Only</option>
                    </select>
                </div>
                
                <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.sendPush}
                            onChange={e => setFormData({...formData, sendPush: e.target.checked})}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-700 font-medium">Send Push Notification</span>
                    </label>
                </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-md flex justify-center items-center gap-2"
            >
              {submitting ? 'Publishing...' : <><FaPaperPlane /> Publish Update</>}
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading updates...</p>
        ) : news.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-500">No updates published yet.</h3>
            <p className="text-sm text-gray-400">Click "Create News" to start broadcasting.</p>
          </div>
        ) : (
          news.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  <div className="text-sm text-gray-500 mt-1 flex gap-3">
                    <span>📅 {item.createdAt}</span>
                    <span>👤 {item.authorName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium capitalize">{item.targetRole}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
              <div 
                className="mt-4 prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NewsManagement;
