import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const DashboardLayout = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset for desktop sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          pageTitle={pageTitle}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-2 text-center">
          <p className="text-xs text-gray-400">
            © 2026 Public Grievance Management System · Government of India · All rights reserved
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
