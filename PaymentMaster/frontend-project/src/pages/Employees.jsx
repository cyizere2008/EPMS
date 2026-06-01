import { useEffect, useState } from 'react';
import api from '../api';

const empty = { employeeNumber:'', firstName:'', lastName:'', address:'', position:'', telephone:'', gender:'Male', hiredDate:'', departmentCode:'' };

export default function Employees() {
  const [form, setForm] = useState(empty);
  const [list, setList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const load = async () => {
    const [{ data: emp }, { data: dep }] = await Promise.all([api.get('/employees'), api.get('/departments')]);
    setList(emp); 
    setDepartments(dep);
  };
  
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try { 
      await api.post('/employees', form); 
      setForm(empty); 
      setMsg({ type: 'success', text: 'Employee added successfully! ✅' }); 
      load();
      setTimeout(() => setMsg(null), 3000);
    } catch (e) { 
      setMsg({ type: 'error', text: e.response?.data?.message || 'Error adding employee' });
      setTimeout(() => setMsg(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await api.delete(`/employees/${id}`);
        load();
        setMsg({ type: 'success', text: 'Employee deleted successfully! 🗑️' });
        setTimeout(() => setMsg(null), 3000);
      } catch (e) {
        setMsg({ type: 'error', text: 'Error deleting employee' });
        setTimeout(() => setMsg(null), 3000);
      }
    }
  };

  const filteredEmployees = list.filter(emp => 
    emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeNumber?.includes(searchTerm) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Employees</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your workforce efficiently</p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Employee Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add New Employee
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
            
            <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Number *</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.employeeNumber} 
                  onChange={(e)=>setForm({...form, employeeNumber: e.target.value})} 
                  required
                  placeholder="EMP001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.firstName} 
                  onChange={(e)=>setForm({...form, firstName: e.target.value})} 
                  required
                  placeholder="John"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.lastName} 
                  onChange={(e)=>setForm({...form, lastName: e.target.value})} 
                  required
                  placeholder="Doe"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.address} 
                  onChange={(e)=>setForm({...form, address: e.target.value})} 
                  placeholder="123 Main St, City"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.position} 
                  onChange={(e)=>setForm({...form, position: e.target.value})} 
                  placeholder="Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telephone</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.telephone} 
                  onChange={(e)=>setForm({...form, telephone: e.target.value})} 
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  value={form.gender} 
                  onChange={(e)=>setForm({...form, gender: e.target.value})}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hired Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.hiredDate} 
                  onChange={(e)=>setForm({...form, hiredDate: e.target.value})}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  value={form.departmentCode} 
                  onChange={(e)=>setForm({...form, departmentCode: e.target.value})}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(d=>(
                    <option key={d._id} value={d.departmentCode}>
                      {d.departmentCode} - {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="sm:col-span-2 bg-gradient-to-r from-slate-700 to-blue-700 text-white font-semibold py-2.5 rounded-lg hover:from-slate-800 hover:to-blue-800 transform transition-all duration-200 hover:scale-[1.02] focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Save Employee'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Employees List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Employees List
              </h2>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {filteredEmployees.length} Total
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Dept</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>No employees found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{emp.employeeNumber}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-800">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-gray-500 md:hidden">{emp.position}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{emp.position}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{emp.departmentCode}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete employee"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}