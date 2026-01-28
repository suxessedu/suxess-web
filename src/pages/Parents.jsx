import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { FaShieldAlt, FaPhoneAlt, FaIdCard, FaEnvelope } from "react-icons/fa";

function ParentDetailPanel({ parent, onClose }) {
  if (!parent) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 pointer-events-auto transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Off-canvas Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl pointer-events-auto flex flex-col transform transition-transform duration-300 translate-x-0 animate-slide-in-right">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">{parent.name}'s Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                   {(parent.name || "U").charAt(0)}
                </span>
                <div>
                   <h3 className="font-bold text-gray-900">{parent.name}</h3>
                   <p className="text-sm text-gray-600">{parent.isPremium ? "Premium Parent" : "Standard Parent"}</p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
              <FaEnvelope className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Email</p>
                <p className="text-gray-600">{parent.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
              <FaPhoneAlt className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Phone</p>
                <p className="text-gray-600">{parent.phone || "N/A"}</p>
              </div>
            </div>

             <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
              <FaIdCard className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-900">NIN</p>
                <p className="text-gray-600">{parent.nin || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
               <FaShieldAlt className="text-gray-400 mt-1" />
               <div>
                  <p className="text-sm font-semibold text-gray-900">Verification Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      parent.verificationStatus === "Verified" ? "bg-green-100 text-green-700" : 
                      parent.verificationStatus === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-gray-100 text-gray-600"
                  }`}>
                      {parent.verificationStatus}
                  </span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50">
           <button 
             onClick={onClose}
             className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
}

function Parents() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewParent, setViewParent] = useState(null);
  const [detailedParent, setDetailedParent] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get("/admin/parents")
      .then((res) => {
        setParents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (viewParent) {
      api.get(`/admin/parents/${viewParent.id}`).then((res) => {
        setDetailedParent(res.data);
      });
    } else {
      setDetailedParent(null);
    }
  }, [viewParent]);

  const handleVerify = async (userId) => {
    if (window.confirm("Are you sure you want to approve this user's verification?")) {
      await api.post(`/admin/users/${userId}/verify`);
      fetchData();
    }
  };

  const handleUpgrade = async (userId) => {
    if (window.confirm("Are you sure you want to upgrade this parent to Premium?")) {
      await api.post(`/admin/users/${userId}/upgrade-premium`);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Parents</h1>
        <span className="bg-primary/10 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
          {parents.length} Registered
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Premium Status</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parents.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{p.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{p.email}</p>
                      <p className="text-xs text-gray-500">{p.phone || "No phone"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {p.isPremium ? (
                         <div className="flex items-center gap-2 text-primary font-medium text-sm">
                             <FaShieldAlt /> Premium
                         </div>
                      ) : (
                         <span className="text-gray-400 text-sm">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.verificationStatus === "Verified"
                            ? "bg-green-100 text-green-800"
                            : p.verificationStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       {p.verificationStatus === "Pending" && (
                        <button
                          onClick={() => handleVerify(p.id)}
                          className="text-xs font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {!p.isPremium && (
                        <button
                          onClick={() => handleUpgrade(p.id)}
                           className="text-xs font-medium bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                        >
                          Upgrade
                        </button>
                      )}
                      <button
                        onClick={() => setViewParent(p)}
                        className="text-xs font-medium bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {detailedParent && (
        <ParentDetailPanel
          parent={detailedParent}
          onClose={() => setViewParent(null)}
        />
      )}
    </div>
  );
}

export default Parents;
