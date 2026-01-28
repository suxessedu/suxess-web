import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";

function ActivityLogs() {
  const [logData, setLogData] = useState({
    logs: [],
    total: 0,
    pages: 0,
    current_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage });
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      const response = await api.get(`/admin/logs?${params.toString()}`);
      setLogData(response.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
         
         {/* Filter Card */}
         <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium px-2">Filter:</span>
             <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <span className="text-gray-400">-</span>
            <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
                 className="border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button 
               onClick={applyFilters} 
               className="bg-primary hover:bg-yellow-400 text-gray-900 font-semibold px-4 py-1.5 rounded transition-colors"
            >
               Apply
            </button>
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
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4 w-1/3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logData.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-6 py-4">
                         <span className="font-medium text-gray-900">{log.userName}</span>
                      </td>
                      <td className="px-6 py-4">
                         <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {log.action}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                    </tr>
                  ))}
                   {logData.logs.length === 0 && (
                     <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No activity logs found.</td>
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

export default ActivityLogs;
