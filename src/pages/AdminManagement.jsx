import React, { useState, useEffect } from "react";
import api from "../services/api";
import { FaTrash, FaUserPlus, FaUserShield } from "react-icons/fa";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/list-admins");
      setAdmins(res.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      alert("Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove admin access for ${name}?`)) return;
    
    try {
      await api.delete(`/admin/delete-admin/${id}`);
      fetchAdmins();
      alert("Admin removed successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove admin.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/admin/create-new-admin", formData);
      setShowModal(false);
      setFormData({ fullName: "", email: "", password: "" });
      fetchAdmins();
      alert("New admin created successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create admin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-primary" />
          Admin Management
        </h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-secondary px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:brightness-110 transition-all"
        >
          <FaUserPlus />
          Add New Admin
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? (
                <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">Loading admins...</td>
                </tr>
                ) : admins.length === 0 ? (
                <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">No admins found.</td>
                </tr>
                ) : (
                admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {admin.name.charAt(0)}
                        </div>
                        {admin.name} {admin.isCurrent && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">You</span>}
                    </td>
                    <td className="p-4 text-gray-600">{admin.email}</td>
                    <td className="p-4 text-right">
                        {!admin.isCurrent && (
                            <button 
                            onClick={() => handleDelete(admin.id, admin.name)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove Admin"
                            >
                            <FaTrash />
                            </button>
                        )}
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Add New Admin</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@suxess.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-primary text-secondary font-bold rounded-lg hover:brightness-110 transition-colors shadow-sm disabled:opacity-70"
                >
                  {submitting ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;
