import React, { useEffect, useState } from 'react';
import { Debtor, AnalysisResponse } from '../types';
import { analyzeDebtorStrategy } from '../services/geminiService';

interface AnalysisModalProps {
  debtor: Debtor | null;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ debtor, onClose }) => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debtor) {
      setLoading(true);
      analyzeDebtorStrategy(debtor)
        .then(data => {
          setAnalysis(data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setAnalysis(null);
    }
  }, [debtor]);

  if (!debtor) return null;

  return (
    <div className="fixed inset-0 bg-pink-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-white ring-4 ring-pink-100">
        <div className="p-6 border-b border-pink-100 flex justify-between items-center bg-pink-50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-extrabold text-pink-600 flex items-center gap-2">
              <span className="text-2xl">✨</span> AI Analysis: กลยุทธ์ติดตามหนี้
            </h2>
            <p className="text-sm text-pink-400 mt-1 pl-8">{debtor.name} (ค้างชำระปี {debtor.fiscalYear})</p>
          </div>
          <button 
            onClick={onClose}
            className="text-pink-300 hover:text-pink-500 transition-colors bg-white rounded-full p-1 hover:bg-pink-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-400 mb-4"></div>
              <p className="text-pink-400 animate-pulse font-medium">AI กําลังวิเคราะห์ข้อมูลอย่างตั้งใจ...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              
              {/* Summary Strategy */}
              <div className="bg-pink-50 p-5 rounded-2xl border-l-4 border-pink-400 shadow-sm">
                <h3 className="font-bold text-pink-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  กลยุทธ์แนะนำ
                </h3>
                <p className="text-pink-900 leading-relaxed">{analysis.strategy}</p>
              </div>

              {/* Tone of Voice */}
              <div>
                <h3 className="text-xs font-bold text-pink-300 uppercase tracking-wide mb-2 ml-1">รูปแบบการเจรจา (Tone)</h3>
                <div className="flex items-center space-x-2 text-gray-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <span className="text-xl">💬</span>
                   <span className="font-medium text-slate-700">"{analysis.tone}"</span>
                </div>
              </div>

              {/* Action Steps */}
              <div>
                <h3 className="text-xs font-bold text-pink-300 uppercase tracking-wide mb-3 ml-1">ขั้นตอนการปฏิบัติ (Action Plan)</h3>
                <ul className="space-y-3">
                  {analysis.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start bg-white p-3 rounded-xl border border-pink-50 shadow-sm">
                      <span className="flex-shrink-0 bg-pink-100 text-pink-600 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warning */}
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <h3 className="font-bold text-orange-800 mb-1 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  ข้อควรระวัง / ระเบียบที่เกี่ยวข้อง
                </h3>
                <p className="text-sm text-orange-800/80 pl-7">{analysis.legal_warning}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-400 py-8">ไม่สามารถโหลดข้อมูลได้</div>
          )}
        </div>

        <div className="p-4 border-t border-pink-50 bg-pink-50/30 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border-2 border-pink-100 rounded-xl text-pink-500 hover:bg-pink-400 hover:text-white hover:border-pink-400 font-bold transition-all shadow-sm"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;