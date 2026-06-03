import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getComplaints } from '../../services/complaintService';
import AdminLayout from '../../layouts/AdminLayout';
import ComplaintTable from '../../components/dashboard/ComplaintTable';
import SearchBar from '../../components/dashboard/SearchBar';
import FilterDropdown from '../../components/dashboard/FilterDropdown';
import Pagination from '../../components/dashboard/Pagination';
import useDebounce from '../../hooks/useDebounce';
import { STATUSES, PRIORITIES, DEPARTMENTS } from '../../utils/constants';
import toast from 'react-hot-toast';
import { HiDownload } from 'react-icons/hi';

const ManageComplaints = () => {
  const location = useLocation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  const initialStatus = location.state?.filterStatus || '';
  const [status, setStatus] = useState(initialStatus);
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  async function fetchComplaints() {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch,
        // Map 'Pending' UI filter to 'Submitted' DB status for accurate results
        status: status === 'Pending' ? 'Submitted' : status,
        department,
        priority,
        sort,
        page,
        limit: 10
      };
      
      const res = await getComplaints(params);
      setComplaints(res.data.complaints);
      setTotalPages(res.data.pages);
      setTotalCount(res.data.total);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, department, priority, sort, page]);

  // Handle route state change if navigating to the same page with a different state
  useEffect(() => {
    if (location.state?.filterStatus !== undefined && location.state.filterStatus !== status) {
      setStatus(location.state.filterStatus);
      setPage(1); // Reset page on filter change
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.filterStatus]);

  const handleExport = () => {
    // Simple mock export
    toast.success('Report export started. It will be downloaded shortly.');
  };

  return (
    <AdminLayout pageTitle="Manage Complaints">
      {/* Top Bar: Title & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">All Complaints</h1>
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {totalCount} total records found
          </p>
        </div>
        <button 
          onClick={handleExport}
          className="btn-secondary flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <HiDownload size={18} className="text-gray-500" />
          Export Report
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="flex-1 min-w-[280px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by title, desc or location..." />
          </div>
          
          <div className="flex flex-wrap xl:flex-nowrap gap-4">
            <FilterDropdown 
              label="Status"
              value={status} 
              onChange={setStatus} 
              options={STATUSES} 
            />
            <FilterDropdown 
              label="Department"
              value={department} 
              onChange={setDepartment} 
              options={DEPARTMENTS} 
            />
            <FilterDropdown 
              label="Priority"
              value={priority} 
              onChange={setPriority} 
              options={PRIORITIES} 
            />
            <FilterDropdown 
              label="Sort By"
              value={sort} 
              onChange={setSort} 
              options={[
                { label: 'Latest First', value: 'latest' },
                { label: 'Oldest First', value: 'oldest' },
                { label: 'Highest Priority', value: 'priority' }
              ]} 
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <ComplaintTable 
          complaints={complaints} 
          loading={loading} 
          role="admin" 
        />
      </div>

      {/* Pagination */}
      {!loading && complaints.length > 0 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      )}
    </AdminLayout>
  );
};

export default ManageComplaints;
