import { useEffect, useState } from 'react';
import api from '../api';

const empty = { employeeNumber:'', grossSalary:'', totalDeduction:'', netSalary:'', monthOfPayment:'' };

export default function Salaries() {
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const load = async () => {
    const [{ data: s }, { data: e }] = await Promise.all([api.get('/salaries'), api.get('/employees')]);
    setList(s); 
    setEmployees(e);
  };
  useEffect(() => { load(); }, []);

  // auto-compute net
  useEffect(() => {
    const g = parseFloat(form.grossSalary) || 0;
    const d = parseFloat(form.totalDeduction) || 0;
    setForm((f) => ({ ...f, netSalary: (g - d).toFixed(2) }));
  }, [form.grossSalary, form.totalDeduction]);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editId) { 
        await api.put(`/salaries/${editId}`, form); 
        setMsg({ type: 'success', text: 'Salary updated successfully! ✏️' });
      } else { 
        await api.post('/salaries', form); 
        setMsg({ type: 'success', text: 'Salary added successfully! ✅' });
      }
      setForm(empty); 
      setEditId(null); 
      load();
      setTimeout(() => setMsg(null), 3000);
    } catch (e) { 
      setMsg({ type: 'error', text: e.response?.data?.message || 'Error' });
      setTimeout(() => setMsg(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const edit = (s) => { 
    setEditId(s._id); 
    setForm({ 
      employeeNumber: s.employeeNumber, 
      grossSalary: s.grossSalary, 
      totalDeduction: s.totalDeduction, 
      netSalary: s.netSalary, 
      monthOfPayment: s.monthOfPayment 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id, employee) => { 
    if (confirm(`Delete salary record for ${employee}?`)) { 
      try {
        await api.delete(`/salaries/${id}`); 
        load();
        setMsg({ type: 'success', text: 'Salary record deleted successfully! 🗑️' });
        setTimeout(() => setMsg(null), 3000);
      } catch (e) {
        setMsg({ type: 'error', text: 'Error deleting record' });
        setTimeout(() => setMsg(null), 3000);
      }
    } 
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(empty);
  };

  const getEmployeeName = (empNumber) => {
    const emp = employees.find(e => e.employeeNumber === empNumber);
    return emp ? `${emp.firstName} ${emp.lastName}` : empNumber;
  };

  // Filter logic
  const filteredSalaries = list.filter(salary => {
    const matchesSearch = !searchTerm || 
      salary.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEmployeeName(salary.employeeNumber).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = !filterMonth || salary.monthOfPayment === filterMonth;
    const matchesEmployee = !selectedEmployee || salary.employeeNumber === selectedEmployee;
    return matchesSearch && matchesMonth && matchesEmployee;
  });

  // Calculate totals for stats
  const totalGross = filteredSalaries.reduce((sum, s) => sum + parseFloat(s.grossSalary || 0), 0);
  const totalDeduction = filteredSalaries.reduce((sum, s) => sum + parseFloat(s.totalDeduction || 0), 0);
  const totalNet = filteredSalaries.reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0);

  const uniqueMonths = [...new Set(list.map(s => s.monthOfPayment))].sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Salary Management</h1>
              <p className="text-gray-500 text-sm mt-1">Manage employee payroll and compensation</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-56"
                />
              </div>
            </div>
          </div>
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            >
              <option value="">All Months</option>
              {uniqueMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp.employeeNumber}>
                  {emp.employeeNumber} - {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
            
            {(filterMonth || selectedEmployee || searchTerm) && (
              <button
                onClick={() => { setFilterMonth(''); setSelectedEmployee(''); setSearchTerm(''); }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold">Total Records</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{filteredSalaries.length}</p>
            </div>
            <div className="bg-blue-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-semibold">Total Gross Salary</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">${totalGross.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-semibold">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">${totalDeduction.toLocaleString()}</p>
            </div>
            <div className="bg-red-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold">Total Net Salary</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">${totalNet.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Salary Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {editId ? 'Edit Salary Record' : 'Add New Salary Record'}
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
          
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Employee *</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                value={form.employeeNumber} 
                onChange={(e) => setForm({...form, employeeNumber: e.target.value})} 
                required
              >
                <option value="">-- Select Employee --</option>
                {employees.map(e => (
                  <option key={e._id} value={e.employeeNumber}>
                    {e.employeeNumber} - {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gross Salary *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.grossSalary} 
                  onChange={(e) => setForm({...form, grossSalary: e.target.value})} 
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Deduction *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.totalDeduction} 
                  onChange={(e) => setForm({...form, totalDeduction: e.target.value})} 
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Net Salary (Auto)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input 
                  type="number" 
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  value={form.netSalary} 
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Month of Payment *</label>
              <input 
                type="month" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={form.monthOfPayment} 
                onChange={(e) => setForm({...form, monthOfPayment: e.target.value})} 
                required
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-slate-700 to-blue-700 text-white font-semibold py-2 rounded-lg hover:from-slate-800 hover:to-blue-800 transform transition-all duration-200 hover:scale-[1.02] focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editId ? 'Updating...' : 'Saving...'}
                  </div>
                ) : (
                  editId ? 'Update Record' : 'Save Record'
                )}
              </button>
              
              {editId && (
                <button 
                  type="button" 
                  onClick={cancelEdit} 
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Salary Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Salary Records
            </h2>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {filteredSalaries.length} Records
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gross Salary</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deduction</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Salary</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No salary records found</p>
                      <p className="text-xs">Click "Add New Salary Record" to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSalaries.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-800">{getEmployeeName(s.employeeNumber)}</p>
                        <p className="text-xs text-gray-500 font-mono">{s.employeeNumber}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      ${parseFloat(s.grossSalary).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600">
                      -${parseFloat(s.totalDeduction).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                        ${parseFloat(s.netSalary).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 font-mono">{s.monthOfPayment}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => edit(s)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Edit record"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => del(s._id, getEmployeeName(s.employeeNumber))}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                          title="Delete record"
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
  );
}