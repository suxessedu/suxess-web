import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUserTie,
  FaHistory,
  FaChalkboard,
  FaUserFriends,
  FaCheckCircle,
  FaTimesCircle,
  FaUserShield,
  FaBullhorn,
} from "react-icons/fa";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 992);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard Overview";
      case "/requests":
        return "Tutor Requests";
      case "/teachers":
        return "All Teachers";
      case "/parents":
        return "All Parents";
      case "/lesson-logs":
        return "Lesson Logs";
      case "/logs":
        return "Full Activity Logs";
      default:
        return "Admin Panel";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && window.innerWidth <= 992 && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-200 z-50 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 h-[70px]">
          <img src="/logo.jpeg" alt="Suxess Logo" className="h-9 w-auto" />
          <h1 className="text-xl font-bold text-gray-900 m-0">Suxess</h1>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLink
            to="/"
            end
            onClick={() => window.innerWidth <= 992 && setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${isActive ? "bg-primary text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FaTachometerAlt className="text-lg" /> Dashboard
          </NavLink>
          <NavLink
            to="/requests"
            onClick={() => window.innerWidth <= 992 && setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${isActive ? "bg-primary text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FaFileAlt className="text-lg" /> Tutor Requests
          </NavLink>
          <NavLink
            to="/teachers"
            onClick={() => window.innerWidth <= 992 && setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${isActive ? "bg-primary text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FaUserTie className="text-lg" /> Teachers
          </NavLink>
          <NavLink
            to="/parents"
            onClick={() => window.innerWidth <= 992 && setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${isActive ? "bg-primary text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FaUserFriends className="text-lg" /> Parents
          </NavLink>
          <NavLink
            to="/lesson-logs"
            onClick={() => window.innerWidth <= 992 && setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${isActive ? "bg-primary text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FaChalkboard className="text-lg" /> Lesson Logs
          </NavLink>
          <NavLink
            to="/logs"
            onClick={() => window.innerWidth <= 992 && setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${isActive ? "bg-primary text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FaHistory className="text-lg" /> Activity Logs
          </NavLink>
          <NavLink
            to="/admin-management"
            onClick={() => window.innerWidth <= 992 && setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${isActive ? "bg-primary text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FaUserShield className="text-lg" /> Manage Admins
          </NavLink>
          <NavLink
            to="/broadcasts"
            onClick={() => window.innerWidth <= 992 && setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${isActive ? "bg-primary text-gray-900 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <FaBullhorn className="text-lg" /> Broadcasts
          </NavLink>
        </nav>
        
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-gray-900 text-lg shadow-sm">
                {(user?.fullName || "A").charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
               <button onClick={handleLogout} className="text-xs text-red-600 hover:text-red-800 font-medium">
                 Logout
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-[260px] min-h-screen transition-all duration-300">
        <header className="h-[70px] bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-30 shadow-sm">
          <button 
            className="mr-4 lg:hidden text-gray-500 hover:text-gray-700 text-2xl" 
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h2 className="text-xl font-bold text-gray-800 m-0">{getPageTitle()}</h2>
        </header>
        
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
