import { useEffect, useState } from 'react';
import api from '../api';

export default function Reports() {
  const [period, setPeriod] = useState('daily');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const load = async (p) => { 
    setIsLoading(true);
    try {
      const { data } = await api.get(`/reports/${p}`); 
      setData(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => { load(period); }, [period]);

  const exportReport = () => {
    if (!data) return;
    
    const reportData = {
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        employees: data.employees.length,
        departments: data.departments.length,
        salaries: data.salaries.length,
        totalGross: data.totals.gross,
        totalDeduction: data.totals.deduction,
        totalNet: data.totals.net
      },
      employees: data.employees,
      departments: data.departments,
      salaries: data.salaries
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${period}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reports Dashboard
              </h1>
              <p className="text-blue-100 text-sm mt-1">Generate and analyze business reports</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportReport}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export JSON
              </button>
              <button
                onClick={printReport}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Report Period:</span>
            </div>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPeriod(p)}
                  className={`px-6 py-2 rounded-lg capitalize text-sm font-medium transition-all duration-200 ${
                    period === p 
                      ? 'bg-gradient-to-r from-slate-700 to-blue-700 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading report...
              </div>
            )}
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex gap-1 px-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('employees')}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'employees'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Employees ({data.employees.length})
                </button>
                <button
                  onClick={() => setActiveTab('departments')}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'departments'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Departments ({data.departments.length})
                </button>
                <button
                  onClick={() => setActiveTab('salaries')}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'salaries'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Salaries ({data.salaries.length})
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Summary Cards - Counts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard 
                  label="Total Employees" 
                  value={data.employees.length} 
                  icon="👥"
                  color="from-blue-500 to-blue-700"
                  gradient="from-blue-50 to-blue-100"
                  textColor="text-blue-700"
                />
                <StatCard 
                  label="Departments" 
                  value={data.departments.length} 
                  icon="🏢"
                  color="from-emerald-500 to-emerald-700"
                  gradient="from-emerald-50 to-emerald-100"
                  textColor="text-emerald-700"
                />
                <StatCard 
                  label="Salary Records" 
                  value={data.salaries.length} 
                  icon="💰"
                  color="from-purple-500 to-purple-700"
                  gradient="from-purple-50 to-purple-100"
                  textColor="text-purple-700"
                />
              </div>

              {/* Summary Cards - Financial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FinancialCard 
                  label="Total Gross Salary" 
                  value={data.totals.gross} 
                  icon="💰"
                  gradient="from-amber-50 to-yellow-100"
                  textColor="text-amber-700"
                  prefix="$"
                />
                <FinancialCard 
                  label="Total Deductions" 
                  value={data.totals.deduction} 
                  icon="📉"
                  gradient="from-red-50 to-rose-100"
                  textColor="text-red-700"
                  prefix="$"
                />
                <FinancialCard 
                  label="Total Net Pay" 
                  value={data.totals.net} 
                  icon="💵"
                  gradient="from-green-50 to-emerald-100"
                  textColor="text-green-700"
                  prefix="$"
                />
              </div>

              {/* Additional Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Key Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Average Salary per Employee</span>
                      <span className="font-semibold text-gray-800">
                        ${data.salaries.length > 0 ? (data.totals.net / data.salaries.length).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Average Deduction Rate</span>
                      <span className="font-semibold text-gray-800">
                        {data.totals.gross > 0 ? ((data.totals.deduction / data.totals.gross) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Employees per Department</span>
                      <span className="font-semibold text-gray-800">
                        {data.departments.length > 0 ? (data.employees.length / data.departments.length).toFixed(1) : '0'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Report Summary ({period})
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Generated on: {new Date().toLocaleString()}</p>
                    <p>• Reporting period: {period.charAt(0).toUpperCase() + period.slice(1)}</p>
                    <p>• Total records: {data.employees.length + data.departments.length + data.salaries.length}</p>
                    <p className="text-blue-600 mt-2">Data is up to date as of report generation</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'employees' && (
            <DataTable 
              title={`Employee List (${period})`}
              cols={['Employee #', 'Name', 'Position', 'Department']}
              rows={data.employees.map(e => [e.employeeNumber, `${e.firstName} ${e.lastName}`, e.position, e.departmentCode])}
              emptyMessage="No employees found for this period"
            />
          )}

          {activeTab === 'departments' && (
            <DataTable 
              title={`Department List (${period})`}
              cols={['Department Code', 'Department Name']}
              rows={data.departments.map(d => [d.departmentCode, d.departmentName])}
              emptyMessage="No departments found for this period"
            />
          )}

          {activeTab === 'salaries' && (
            <DataTable 
              title={`Salary Records (${period})`}
              cols={['Employee #', 'Gross Salary', 'Deduction', 'Net Salary', 'Month']}
              rows={data.salaries.map(s => [
                s.employeeNumber, 
                `$${parseFloat(s.grossSalary).toLocaleString()}`, 
                `$${parseFloat(s.totalDeduction).toLocaleString()}`, 
                `$${parseFloat(s.netSalary).toLocaleString()}`, 
                s.monthOfPayment
              ])}
              emptyMessage="No salary records found for this period"
            />
          )}
        </>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, gradient, textColor }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value.toLocaleString()}</p>
        </div>
        <div className={`text-4xl opacity-50`}>{icon}</div>
      </div>
    </div>
  );
}

// Financial Card Component
function FinancialCard({ label, value, icon, gradient, textColor, prefix = '$' }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-2 ${textColor}`}>
            {prefix}{parseFloat(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
        </div>
        <div className={`text-3xl opacity-50`}>{icon}</div>
      </div>
    </div>
  );
}

// Data Table Component
function DataTable({ title, cols, rows, emptyMessage }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {cols.map((col, idx) => (
                <th key={idx} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3 text-sm text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">Showing {rows.length} record{rows.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
}