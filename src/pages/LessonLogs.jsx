import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";

function LessonLogs() {
  const [logData, setLogData] = useState({
    logs: [],
    total: 0,
    pages: 0,
    current_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/lesson-logs?page=${currentPage}`);
      setLogData(response.data);
    } catch (error) {
      console.error("Failed to fetch lesson logs", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getTotalHours = () => {
    return logData.logs.reduce((sum, log) => sum + log.duration, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <h1 className="text-2xl font-bold text-gray-900">Teacher Lesson Logs</h1>
         <div className="bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm">
             <span className="text-gray-500 text-sm">Total Hours (Page):</span>
             <span className="ml-2 font-bold text-gray-900 text-lg">{getTotalHours().toFixed(1)} hrs</span>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
           <div className="flex items-center justify-center h-40">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Teacher</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 w-1/3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logData.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{log.date}</td>
                      <td className="px-6 py-4">
                         <span className="font-semibold text-gray-900 block">{log.teacherName}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{log.duration.toFixed(1)} hrs</td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                             log.status === 'Verified' ? 'bg-green-100 text-green-700' : 
                             'bg-gray-100 text-gray-600'
                         }`}>
                             {log.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={log.notes}>
                          {log.notes}
                      </td>
                    </tr>
                  ))}
                  {logData.logs.length === 0 && (
                     <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No consolidated logs found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50">
                <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                Previous
                </button>
                <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{logData.current_page}</span> of {logData.pages}
                </span>
                <button
                onClick={() => setCurrentPage((p) => Math.min(logData.pages, p + 1))}
                disabled={currentPage === logData.pages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                Next
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LessonLogs;
