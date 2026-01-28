import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";

function MatchPanel({ request, onClose, onMatch }) {
  const [suggestedTeachers, setSuggestedTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [mode, setMode] = useState("recommendations"); // 'recommendations' or 'browse'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (request) {
      setLoading(true);
      // Fetch Suggestions
      api
        .get(`/admin/requests/${request.id}/suggest-teachers`)
        .then((res) => {
          setSuggestedTeachers(res.data);
          if (res.data.length > 0 && res.data[0].isShortlisted) {
            setSelectedTeacher(res.data[0].id);
          }
          setLoading(false);
          // Auto-switch to browse if no suggestions
          if (res.data.length === 0) setMode('browse');
        })
        .catch((err) => {
          console.error("Failed to get suggestions", err);
          setLoading(false);
        });
    }
  }, [request]);

  // Fetch all teachers when switching to browse mode
  useEffect(() => {
    if (mode === 'browse' && allTeachers.length === 0) {
      setLoading(true);
      api.get('/admin/teachers')
        .then(res => {
           // Filter only verified and relevant teachers if needed, or just show all
           setAllTeachers(res.data.filter(t => t.verificationStatus === 'Verified' && !t.isSuspended));
           setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch all teachers", err);
          setLoading(false);
        });
    }
  }, [mode]);

  const handleMatch = () => {
    if (!selectedTeacher) {
      alert("Please select a teacher to match.");
      return;
    }
    onMatch(request.id, selectedTeacher);
  };

  const filteredAllTeachers = allTeachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subjects.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose}></div>
      <div className={`fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${request ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 m-0">
            Match Tutor for Request #{request.id}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none">
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          <div className="mb-6">
             <p className="mb-1 text-gray-800"><strong>Student:</strong> {request.studentName} ({request.studentGrade})</p>
             <p className="text-gray-500 text-sm">Subject: {request.subjects}</p>
          </div>

          <div className="flex gap-2.5 mb-5 border-b border-gray-200 pb-2.5">
            <button 
              className={`pb-2 px-1 font-semibold text-sm transition-colors ${mode === 'recommendations' ? 'border-b-2 border-primary text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
              onClick={() => setMode('recommendations')}
            >
              Recommendations
            </button>
            <button 
              className={`pb-2 px-1 font-semibold text-sm transition-colors ${mode === 'browse' ? 'border-b-2 border-primary text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
              onClick={() => setMode('browse')}
            >
              Browse All Tutors
            </button>
          </div>

          {loading ? (
             <div className="text-center p-8 text-gray-500">
               <p>Loading...</p>
             </div>
          ) : mode === 'recommendations' ? (
            <div className="space-y-6">
              {/* Parent's Choice Section */}
              {suggestedTeachers.some(t => t.isShortlisted) && (
                <div className="space-y-3">
                  <h5 className="text-primary text-xs font-bold uppercase tracking-wider">Parent's Choice</h5>
                  <ul className="space-y-3">
                    {suggestedTeachers.filter(t => t.isShortlisted).map(t => (
                      <li
                        key={t.id}
                        onClick={() => setSelectedTeacher(t.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTeacher == t.id 
                            ? "bg-yellow-50 border-primary shadow-[0_0_0_2px_rgba(255,215,0,0.2)]" 
                            : "bg-white border-primary hover:shadow-md"
                        }`}
                      >
                         <div className="flex justify-between items-center">
                            <div>
                              <strong className="text-base text-gray-900 block">{t.name}</strong>
                              <div className="mt-1 text-gray-500 text-sm">{t.subjects}</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center ${selectedTeacher == t.id ? "bg-primary border-primary" : ""}`}>
                                {selectedTeacher == t.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                         </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations Section */}
              <div className="space-y-3">
                <h5 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Suxess AI Recommendations</h5>
                <ul className="space-y-3">
                  {suggestedTeachers.filter(t => !t.isShortlisted).length > 0 ? (
                    suggestedTeachers.filter(t => !t.isShortlisted).map((t) => (
                      <li
                        key={t.id}
                        onClick={() => setSelectedTeacher(t.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all bg-white ${
                            selectedTeacher == t.id 
                            ? "bg-yellow-50 border-primary shadow-[0_0_0_2px_rgba(255,215,0,0.2)]" 
                            : "border-gray-200 hover:border-primary/50 hover:shadow-md"
                        }`}
                      >
                         <div className="flex justify-between items-center">
                            <div>
                               <strong className="text-gray-900 block">{t.name}</strong>
                               <div className="mt-1 text-gray-500 text-sm">Match Score: {t.matchScore}%</div>
                               <div className="text-gray-400 text-xs mt-0.5">{t.subjects}</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center ${selectedTeacher == t.id ? "bg-primary border-primary" : ""}`}>
                                {selectedTeacher == t.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                         </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-3">No direct matches found.</p>
                      <button className="px-3 py-1.5 border border-primary text-primary rounded-md text-sm hover:bg-primary hover:text-white transition-colors" onClick={() => setMode('browse')}>Browse All Tutors</button>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          ) : (
             <div className="flex flex-col h-full">
                <input 
                  type="text" 
                  placeholder="Search by name or subject..." 
                  className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(255,215,0,0.2)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ul className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
                   {filteredAllTeachers.map((t) => (
                      <li
                        key={t.id}
                        onClick={() => setSelectedTeacher(t.id)}
                         className={`border rounded-lg p-3 cursor-pointer transition-all bg-white ${
                            selectedTeacher == t.id 
                            ? "bg-yellow-50 border-primary shadow-[0_0_0_2px_rgba(255,215,0,0.2)]" 
                            : "border-gray-200 hover:border-primary/50 hover:shadow-sm"
                        }`}
                      >
                         <div className="flex justify-between items-center">
                            <div>
                               <strong className="text-gray-900 block text-sm">{t.name}</strong>
                               <div className="text-gray-500 text-xs">{t.subjects}</div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center ${selectedTeacher == t.id ? "bg-primary border-primary" : ""}`}>
                                {selectedTeacher == t.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                         </div>
                      </li>
                   ))}
                   {filteredAllTeachers.length === 0 && (
                     <p className="text-gray-500 text-center py-4">No tutors found matching "{searchQuery}"</p>
                   )}
                </ul>
             </div>
          )}

          <div className="mt-auto pt-6">
            <button
              onClick={handleMatch}
              className="w-full py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!selectedTeacher}
            >
              Confirm Match
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailPanel({ request, onClose }) {
  if (!request) return null;
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
          <h2 className="text-xl font-bold text-gray-800">Request #{request.id}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
           <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
              <h3 className="font-bold text-gray-900 mb-2">Student Information</h3>
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-bold text-lg">
                    {request.studentName.charAt(0)}
                 </div>
                 <div>
                    <div className="font-semibold text-gray-900">{request.studentName}</div>
                    <div className="text-sm text-gray-500">{request.studentGrade}</div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subjects</span>
                  <p className="text-gray-900 font-medium">{request.subjects}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Schedule</span>
                      <p className="text-gray-900 font-medium text-sm">{request.schedule}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                      <p className="text-gray-900 font-medium text-sm">{request.duration}</p>
                  </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</span>
                  <p className="text-gray-900 font-medium">{request.location}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Goals</span>
                  <p className="text-gray-900 font-medium">{request.learningGoals}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Parent</span>
                  <p className="text-gray-900 font-medium">{request.parentName}</p>
                  <p className="text-gray-500 text-sm">{request.parentEmail}</p>
              </div>

              {request.status === "Matched" && (
                 <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Matched Tutor</span>
                    <p className="text-green-900 font-bold">{request.assignedTeacherName}</p>
                 </div>
              )}
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

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchRequest, setMatchRequest] = useState(null);
  const [viewRequest, setViewRequest] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMatchConfirm = async (requestId, teacherId) => {
    try {
      await api.post("/admin/match", { requestId, teacherId });
      setMatchRequest(null);
      fetchData();
      alert("Tutor matched successfully!");
    } catch (error) {
      alert("Failed to match tutor.");
    }
  };

  const handleConfirmPayment = async (requestId) => {
    if (
      window.confirm(
        "Are you sure you have received payment for this request? This will make it available for matching."
      )
    ) {
      try {
        await api.post(`/admin/requests/${requestId}/confirm-payment`);
        fetchData();
      } catch (error) {
        alert("Failed to confirm payment.");
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tutor Requests</h1>
      
        {loading ? (
          <p className="p-5 text-gray-500">Loading requests...</p>
        ) : (
          <div className="space-y-4">
             {requests.map(req => (
               <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-6 relative transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/50">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-lg font-bold m-0 mb-1">{req.parentName}</h3>
                        <div className="text-gray-500 text-sm">Student: {req.studentName} ({req.studentGrade})</div>
                     </div>
                     <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize flex items-center gap-1.5 ${
                        req.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-700"
                            : req.status === "Matched"
                            ? "bg-green-500/10 text-green-700"
                            : req.status === "Confirming Payment"
                            ? "bg-cyan-500/10 text-cyan-700"
                            : "bg-gray-500/10 text-gray-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                     <p className="mb-1 text-[15px]"><strong>Looking for:</strong> {req.subjects}</p>
                  </div>

                  <div className="flex gap-5 text-gray-500 text-sm mb-5">
                     <div className="flex items-center gap-1.5">
                        <i className="bi bi-calendar"></i> {req.schedule}
                     </div>
                     <div className="flex items-center gap-1.5">
                        <i className="bi bi-geo-alt"></i> {req.location}
                     </div>
                     <div className="flex items-center gap-1.5">
                        <i className="bi bi-clock"></i> {req.createdAt}
                     </div>
                  </div>

                  <div className="flex gap-3 border-t border-gray-100 pt-4">
                      {req.status === "Confirming Payment" && (
                        <button
                          onClick={() => handleConfirmPayment(req.id)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-green-500/10 text-green-700 hover:bg-green-500/20 shadow-sm"
                        >
                          Confirm Payment
                        </button>
                      )}
                      {req.status === "Pending" && (
                        <button
                          onClick={() => setMatchRequest(req)}
                          className="px-4 py-2 rounded-lg text-sm font-bold transition-all bg-primary text-secondary hover:bg-primary-hover shadow-sm"
                        >
                          Match Tutor
                        </button>
                      )}
                      
                      {req.status === "Matched" && (
                         <div className="text-green-600 text-sm flex items-center">
                            <i className="bi bi-check-circle-fill mr-2"></i>
                            Matched with {req.assignedTeacherName}
                         </div>
                      )}

                      <button
                        onClick={() => setViewRequest(req)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 ml-auto"
                      >
                        View Details
                      </button>
                  </div>
               </div>
             ))}
          </div>
        )}

      {matchRequest && (
        <MatchPanel
          request={matchRequest}
          onClose={() => setMatchRequest(null)}
          onMatch={handleMatchConfirm}
        />
      )}

      {viewRequest && (
        <DetailPanel
          request={viewRequest}
          onClose={() => setViewRequest(null)}
        />
      )}
    </div>
  );
}

export default Requests;
