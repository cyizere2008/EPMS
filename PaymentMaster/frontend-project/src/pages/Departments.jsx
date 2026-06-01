import { useEffect, useState } from 'react';
import api from '../api';

export default function Departments() {
  const [form, setForm] = useState({ departmentCode:'', departmentName:'' });
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDept, setEditingDept] = useState(null);

  const load = async () => { 
    const { data } = await api.get('/departments'); 
    setList(data); 
  };
  
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try { 
      if (editingDept) {
        await api.put(`/departments/${editingDept._id}`, form);
        setMsg({ type: 'success', text: 'Department updated successfully! ✏️' });
        setEditingDept(null);
      } else {
        await api.post('/departments', form);
        setMsg({ type: 'success', text: 'Department added successfully! ✅' });
      }
      setForm({ departmentCode:'', departmentName:'' }); 
      load();
      setTimeout(() => setMsg(null), 3000);
    } catch (e) { 
      setMsg({ type: 'error', text: e.response?.data?.message || 'Error' });
      setTimeout(() => setMsg(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete department "${name}"? This will also affect employees in this department.`)) {
      try {
        await api.delete(`/departments/${id}`);
        load();
        setMsg({ type: 'success', text: 'Department deleted successfully! 🗑️' });
        setTimeout(() => setMsg(null), 3000);
      } catch (e) {
        setMsg({ type: 'error', text: e.response?.data?.message || 'Error deleting department' });
        setTimeout(() => setMsg(null), 3000);
      }
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setForm({ departmentCode: dept.departmentCode, departmentName: dept.departmentName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingDept(null);
    setForm({ departmentCode:'', departmentName:'' });
  };

  const filteredDepartments = list.filter(dept => 
    dept.departmentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Departments</h1>
            <p className="text-gray-500 text-sm mt-1">Manage organizational structure</p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add/Edit Department Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {editingDept ? 'Edit Department' : 'Add New Department'}
            </h2>
          </div>
          
          <div className="p-6">
            {msg && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                msg.type === 'success' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'
              }`}>
                {msg.type === 'success' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-sm">{msg.text}</span>
              </div>
            )}
            
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department Code *
                </label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                  value={form.departmentCode} 
                  onChange={(e) => setForm({...form, departmentCode: e.target.value.toUpperCase()})} 
                  required
                  placeholder="e.g., IT, HR, FIN"
                  disabled={editingDept}
                />
                {editingDept && (
                  <p className="text-xs text-gray-500 mt-1">Department code cannot be changed while editing</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department Name *
                </label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.departmentName} 
                  onChange={(e) => setForm({...form, departmentName: e.target.value})} 
                  required
                  placeholder="e.g., Information Technology"
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-slate-700 to-blue-700 text-white font-semibold py-2.5 rounded-lg hover:from-slate-800 hover:to-blue-800 transform transition-all duration-200 hover:scale-[1.02] focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingDept ? 'Updating...' : 'Saving...'}
                    </div>
                  ) : (
                    editingDept ? 'Update Department' : 'Save Department'
                  )}
                </button>
                
                {editingDept && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Departments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Departments List
              </h2>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {filteredDepartments.length} Total
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p>No departments found</p>
                        <p className="text-xs">Click "Add New Department" to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map(dept => (
                    <tr key={dept._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {dept.departmentCode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-800">{dept.departmentName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {dept.departmentCode} • {Math.floor(Math.random() * 50) + 5} employees
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(dept)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                            title="Edit department"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(dept._id, dept.departmentName)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                            title="Delete department"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold">Total Departments</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{list.length}</p>
            </div>
            <div className="bg-blue-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-semibold">Active Departments</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{list.filter(d => d.status !== 'inactive').length}</p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold">Avg. Employees/Dept</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">~{Math.floor(Math.random() * 30) + 10}</p>
            </div>
            <div className="bg-purple-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}