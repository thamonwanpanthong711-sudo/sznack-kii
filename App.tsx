import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_DEBTORS } from './constants';
import { Debtor, FiscalYear } from './types';
import Dashboard from './components/Dashboard';
import AnalysisModal from './components/AnalysisModal';

const App: React.FC = () => {
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Debtor | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });
  
  // Combined Search and Sort Logic
  const filteredDebtors = useMemo(() => {
    let result = [...MOCK_DEBTORS];

    // 1. Filter
    if (searchTerm) {
      result = result.filter(d => 
        d.name.includes(searchTerm) || 
        d.id.includes(searchTerm)
      );
    }

    // 2. Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Special sorting for Status to make it meaningful (Critical > Warning > Normal)
        if (sortConfig.key === 'status') {
          const priority = { 'Critical': 3, 'Warning': 2, 'Normal': 1 };
          const valA = priority[a.status];
          const valB = priority[b.status];
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [searchTerm, sortConfig]);

  // Handle Column Header Click
  const handleSort = (key: keyof Debtor) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Helper to render sort arrow
  const SortIcon = ({ columnKey }: { columnKey: keyof Debtor }) => {
    if (sortConfig.key !== columnKey) return <span className="ml-1 text-pink-200 text-[10px] opacity-50">▲▼</span>;
    return (
      <span className="ml-1 text-pink-500 font-bold text-xs">
        {sortConfig.direction === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  // Prepare data for the Line Chart based on filtered results
  const lineChartData = useMemo(() => {
    // Group amounts by Fiscal Year
    const yearMap = filteredDebtors.reduce((acc, curr) => {
      acc[curr.fiscalYear] = (acc[curr.fiscalYear] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    // Ensure all years are present for the chart line continuity, or just use available
    const years = [FiscalYear.Y2565, FiscalYear.Y2566, FiscalYear.Y2567, FiscalYear.Y2568];
    
    return years.map(year => ({
      name: year,
      amount: yearMap[year] || 0
    }));
  }, [filteredDebtors]);

  // Function to handle export for a single debtor
  const handleExport = (debtor: Debtor) => {
    const content = `
    ==========================================
    🎀 ใบสรุปรายการหนี้ค้างชำระ (GovDebt AI) 🎀
    ==========================================
    ข้อมูล ณ วันที่: ${new Date().toLocaleDateString('th-TH')}
    
    รหัสหน่วยงาน: ${debtor.id}
    ชื่อหน่วยงาน: ${debtor.name}
    ประเภท: ${debtor.type}
    
    ------------------------------------------
    รายละเอียดหนี้
    ------------------------------------------
    ปีงบประมาณ: ${debtor.fiscalYear}
    วันที่แจ้งหนี้: ${debtor.invoiceDate}
    ยอดคงค้าง: ${debtor.amount.toLocaleString()} บาท
    ระยะเวลาค้างชำระ: ${debtor.daysOverdue} วัน
    สถานะ: ${debtor.status}
    
    ------------------------------------------
    ข้อมูลการติดต่อ
    ------------------------------------------
    ผู้ประสานงาน: ${debtor.contactPerson}
    เบอร์โทรศัพท์: ${debtor.phone}
    
    ==========================================
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${debtor.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-pink-50 text-slate-800 font-sarabun">
      {/* Header - Kitty Theme (Pink) */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b-4 border-pink-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-pink-400 p-2 rounded-xl text-white shadow-md transform rotate-3 hover:rotate-0 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-pink-600 leading-none">GovDebt AI <span className="text-pink-400">Analyst</span></h1>
              <span className="text-xs text-pink-400 font-medium">ระบบบริหารหนี้ฉบับน่ารัก</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-pink-500 font-medium bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
             <span>🎀 สวัสดี, เจ้าหน้าที่การเงิน</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dashboard Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-6 bg-pink-400 rounded-full"></span>
              ภาพรวมสถานะหนี้
            </h2>
            <span className="text-xs bg-white text-pink-500 border border-pink-200 px-3 py-1 rounded-full shadow-sm">
              ✨ อัปเดตล่าสุด: วันนี้
            </span>
          </div>
          <Dashboard debtors={MOCK_DEBTORS} />
        </section>

        {/* Debtor List Section with Line Chart */}
        <section className="bg-white rounded-3xl shadow-lg border-2 border-pink-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-6 border-b border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-pink-50 to-white">
            <div>
              <h2 className="text-lg font-bold text-pink-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                รายการลูกหนี้ค้างชำระ
              </h2>
              <p className="text-xs text-pink-400 mt-1">ข้อมูลยอดหนี้และกราฟแนวโน้ม</p>
            </div>
            
            <div className="relative group">
              <input
                type="text"
                placeholder="ค้นหาชื่อหน่วยงาน..."
                className="pl-10 pr-4 py-2.5 border-2 border-pink-100 rounded-2xl text-sm focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 w-full sm:w-64 transition-all bg-white/80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-300 absolute left-3 top-3 group-focus-within:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Added Line Chart Section */}
          <div className="px-6 pt-6 pb-2">
             <div className="bg-pink-50/50 rounded-2xl p-4 border border-pink-100">
                <h3 className="text-sm font-semibold text-pink-700 mb-4 pl-2 border-l-4 border-pink-400">
                  แนวโน้มยอดหนี้ตามปีงบประมาณ (บาท)
                </h3>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fbcfe8" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 12, fill: '#db2777'}} 
                        axisLine={{ stroke: '#fbcfe8' }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{fontSize: 11, fill: '#db2777'}} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '2px solid #fce7f3', 
                          borderRadius: '12px',
                          color: '#ec4899',
                          boxShadow: '0 4px 6px -1px rgba(255, 182, 193, 0.3)'
                        }}
                        itemStyle={{ color: '#db2777' }}
                        formatter={(value: number) => [value.toLocaleString(), 'ยอดหนี้']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#ec4899" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#be185d', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 8, fill: '#db2777' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
          
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-pink-500 text-xs uppercase tracking-wider border-b border-pink-100">
                  <th 
                    className="px-6 py-4 font-bold bg-white cursor-pointer hover:bg-pink-50 transition-colors select-none group/th"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      หน่วยงาน <SortIcon columnKey="name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 font-bold bg-white cursor-pointer hover:bg-pink-50 transition-colors select-none group/th"
                    onClick={() => handleSort('fiscalYear')}
                  >
                    <div className="flex items-center gap-1">
                      ปีงบประมาณ <SortIcon columnKey="fiscalYear" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 font-bold text-right bg-white cursor-pointer hover:bg-pink-50 transition-colors select-none group/th"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      ยอดหนี้ (บาท) <SortIcon columnKey="amount" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 font-bold text-center bg-white cursor-pointer hover:bg-pink-50 transition-colors select-none group/th"
                    onClick={() => handleSort('daysOverdue')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      ระยะเวลา (วัน) <SortIcon columnKey="daysOverdue" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 font-bold text-center bg-white cursor-pointer hover:bg-pink-50 transition-colors select-none group/th"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      สถานะ <SortIcon columnKey="status" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-center bg-white">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 text-sm">
                {filteredDebtors.map((debtor) => (
                  <tr key={debtor.id} className="hover:bg-pink-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700 group-hover:text-pink-700 transition-colors">{debtor.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{debtor.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        debtor.fiscalYear < '2567' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {debtor.fiscalYear}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">
                      {debtor.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${debtor.daysOverdue > 365 ? 'text-rose-500' : 'text-slate-500'}`}>
                        {debtor.daysOverdue}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                        ${debtor.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 
                          debtor.status === 'Warning' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                          'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {debtor.status === 'Critical' ? '⚡ วิกฤต' : debtor.status === 'Warning' ? '⚠️ เฝ้าระวัง' : '✅ ปกติ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleExport(debtor)}
                          title="Export ข้อมูล"
                          className="group flex items-center justify-center text-pink-400 hover:text-white transition-all bg-white hover:bg-pink-400 p-2 rounded-xl border-2 border-pink-100 hover:border-pink-400 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => setSelectedDebtor(debtor)}
                          className="group flex items-center justify-center text-pink-600 hover:text-white transition-all bg-white hover:bg-pink-400 px-4 py-2 rounded-xl border-2 border-pink-100 hover:border-pink-400 shadow-sm hover:shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span className="font-bold text-xs">AI วิเคราะห์</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDebtors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-pink-300">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ไม่พบข้อมูลลูกหนี้
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Analysis Modal */}
      {selectedDebtor && (
        <AnalysisModal 
          debtor={selectedDebtor} 
          onClose={() => setSelectedDebtor(null)} 
        />
      )}
    </div>
  );
};

export default App;