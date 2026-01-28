import React, { useState, useEffect } from "react";
import api from "../services/api";

function TeacherDetailPanel({ teacher, onClose }) {
  if (!teacher) return null;

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
          <h2 className="text-xl font-bold text-gray-800">{teacher.name}'s Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-lg border-2 border-white shadow-sm">
                   {(teacher.name || "T").charAt(0)}
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 leading-tight">{teacher.name}</h3>
                   <p className="text-sm text-gray-600">{teacher.email}</p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</span>
                <p className="text-gray-900 font-medium">{teacher.phone || "N/A"}</p>
             </div>

             <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">NIN</span>
                <p className="text-gray-900 font-medium">{teacher.nin || "N/A"}</p>
             </div>

             <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subjects</span>
                <p className="text-gray-900 font-medium">{teacher.subjects || "N/A"}</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</span>
                    <p className="text-gray-900 font-medium">{teacher.experience || "N/A"}</p>
                 </div>
                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Qualification</span>
                    <p className="text-gray-900 font-medium">{teacher.qualification || "N/A"}</p>
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

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTeacher, setViewTeacher] = useState(null);

  const fetchData = () => {
    setLoading(true);
    api.get("/admin/teachers").then((res) => {
      setTeachers(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to approve this user's verification?"
      )
    ) {
      await api.post(`/admin/users/${userId}/verify`);
      fetchData();
    }
  };

  const handleToggleSuspend = async (userId, isSuspended) => {
    const action = isSuspended ? "reinstate" : "suspend";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      await api.post(`/admin/users/${userId}/toggle-suspend`);
      fetchData();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Teachers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="p-5 text-gray-500">Loading teachers...</p>
        ) : (
          teachers.map((t) => (
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/50" key={t.id}>
               <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-yellow-500 text-secondary flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm">
                     {t.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                  <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          t.verificationStatus === "Verified"
                            ? "bg-blue-500/10 text-blue-700"
                            : t.verificationStatus === "Pending"
                            ? "bg-yellow-500/10 text-yellow-700"
                            : "bg-gray-500/10 text-gray-700"
                      }`}
                    >
                      {t.verificationStatus}
                  </span>
               </div>
               
               <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 m-0 leading-tight">{t.name}</h3>
                  <div className="text-gray-500 text-sm mt-1">{t.email}</div>
                  <div className="text-gray-400 text-xs">{t.phone || "No phone"}</div>
               </div>

               <div className="flex gap-4 py-4 my-2 border-t border-b border-gray-100">
                  <div className="flex flex-col">
                     <span className="text-base font-bold text-gray-900">{t.assignedCount || 0}</span>
                     <span className="text-[10px] uppercase font-bold text-gray-400">Active Jobs</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-base font-bold text-green-600">{t.completedCount || 0}</span>
                     <span className="text-[10px] uppercase font-bold text-gray-400">Completed</span>
                  </div>
                  <div className="flex flex-col ml-auto text-right">
                     <span className={`text-base font-bold ${t.isProfileComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                        {t.isProfileComplete ? "100%" : "50%"}
                     </span>
                     <span className="text-[10px] uppercase font-bold text-gray-400">Profile</span>
                  </div>
               </div>

               <div className="flex gap-2 mt-auto">
                   {t.verificationStatus === "Pending" && (
                        <button
                          onClick={() => handleVerify(t.id)}
                          className="flex-1 py-2 px-3 bg-primary text-secondary font-bold rounded-lg text-sm hover:brightness-95 transition-all"
                        >
                          Approve
                        </button>
                   )}
                   
                   <button
                        onClick={() => handleToggleSuspend(t.id, t.isSuspended)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            t.isSuspended 
                            ? "bg-green-50 text-green-700 hover:bg-green-100" 
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {t.isSuspended ? "Reinstate" : "Suspend"}
                   </button>
                   
                   <button
                        onClick={() => setViewTeacher(t)}
                        className="flex-1 py-2 px-3 bg-gray-100 text-gray-600 font-medium rounded-lg text-sm hover:bg-gray-200 transition-all"
                      >
                        View
                   </button>
               </div>
            </div>
          ))
        )}
      </div>
      {viewTeacher && (
        <TeacherDetailPanel
          teacher={viewTeacher}
          onClose={() => setViewTeacher(null)}
        />
      )}
    </div>
  );
}

export default Teachers;
