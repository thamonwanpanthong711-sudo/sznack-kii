import React from 'react';
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Debtor, FiscalYear } from '../types';

interface DashboardProps {
  debtors: Debtor[];
}

const Dashboard: React.FC<DashboardProps> = ({ debtors }) => {
  // Calculate Summaries
  const totalDebt = debtors.reduce((acc, d) => acc + d.amount, 0);
  const criticalCount = debtors.filter(d => d.status === 'Critical').length;
  const criticalAmount = debtors.filter(d => d.status === 'Critical').reduce((acc, d) => acc + d.amount, 0);

  // Prepare Data for Charts
  const dataByYear = [FiscalYear.Y2565, FiscalYear.Y2566, FiscalYear.Y2567, FiscalYear.Y2568].map(year => {
    return {
      name: year,
      debt: debtors.filter(d => d.fiscalYear === year).reduce((acc, d) => acc + d.amount, 0)
    };
  });

  const dataByStatus = [
    { name: 'Critical', value: debtors.filter(d => d.status === 'Critical').length, color: '#f43f5e' }, // Rose-500
    { name: 'Warning', value: debtors.filter(d => d.status === 'Warning').length, color: '#fb923c' }, // Orange-400
    { name: 'Normal', value: debtors.filter(d => d.status === 'Normal').length, color: '#34d399' },  // Emerald-400
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Stat Cards */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 lg:col-span-1 group hover:border-pink-300 transition-colors">
        <h3 className="text-pink-400 text-sm font-bold uppercase tracking-wider">หนี้ค้างชำระรวม</h3>
        <p className="text-3xl font-extrabold text-slate-800 mt-2">{totalDebt.toLocaleString()} ฿</p>
        <div className="mt-2 text-xs text-slate-400">จากทั้งหมด {debtors.length} หน่วยงาน</div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 lg:col-span-1 group hover:border-red-200 transition-colors">
        <h3 className="text-red-400 text-sm font-bold uppercase tracking-wider">หนี้วิกฤต (Critical)</h3>
        <p className="text-3xl font-extrabold text-red-500 mt-2">{criticalAmount.toLocaleString()} ฿</p>
        <div className="mt-2 text-xs text-red-300">{criticalCount} หน่วยงานต้องเร่งติดตาม</div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 lg:col-span-1 flex flex-col justify-center">
        <h3 className="text-slate-600 font-bold mb-4 text-sm">ยอดหนี้แยกตามปีงบประมาณ</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataByYear}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fce7f3" />
              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#ec4899'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#fdf2f8'}}
                formatter={(value: number) => value.toLocaleString()} 
                contentStyle={{ borderRadius: '8px', border: '1px solid #fbcfe8' }}
              />
              <Bar dataKey="debt" fill="#f472b6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 lg:col-span-1 flex flex-col justify-center">
        <h3 className="text-slate-600 font-bold mb-4 text-sm">สัดส่วนสถานะลูกหนี้</h3>
        <div className="h-40 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataByStatus}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {dataByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{fontSize: '10px'}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;