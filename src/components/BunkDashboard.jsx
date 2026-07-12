import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import DailyPdfTemplate from './DailyPdfTemplate';

export default function BunkDashboard() {
  const reportRef = useRef();

  // App States
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState(null); // NEW: Toast notification state

  // Bunk Operations State
  const [bunkName] = useState('Eshwari filling station');
  const [manager, setManager] = useState('Kumuda');
  
  // Readings State
  const [openingReading, setOpeningReading] = useState('');
  const [closingReading, setClosingReading] = useState('');

  // MULTIPLE PUMPMEN STATE
  const [pumpmen, setPumpmen] = useState([
    { name: '', powerPetrol: '', oilPacket: '', cash: '', upi: '', card: '' }
  ]);

  // Overall Collections
  const [cashCollected, setCashCollected] = useState('42350');
  const [upiCollected, setUpiCollected] = useState('28400');
  const [cardCollected, setCardCollected] = useState('15000');
  
  // MULTIPLE EXPENSES STATE
  const [expenseList, setExpenseList] = useState([
    { reason: 'Station Maintenance', amount: '1350' }
  ]);

  // Khata State
  const [khataTransactions, setKhataTransactions] = useState([
    { customer: 'Sri Lakshmi Travels', remarks: 'Diesel Bus Refuel', amount: '7500' },
    { customer: 'Raju Tractor Works', remarks: '50L Commercial', amount: '4850' },
  ]);
  const [newCustomer, setNewCustomer] = useState('');
  const [newRemarks, setNewRemarks] = useState('');
  const [newAmount, setNewAmount] = useState('');

  // Preloader Timer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // NEW: Helper function to show a toast message
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // --- Handlers for Multiple Pumpmen ---
  const handleAddPumpman = () => {
    setPumpmen([...pumpmen, { name: '', powerPetrol: '', oilPacket: '', cash: '', upi: '', card: '' }]);
  };

  const handleRemovePumpman = (index) => {
    setPumpmen(pumpmen.filter((_, i) => i !== index));
    showToast('Operator removed');
  };

  const handlePumpmanChange = (index, field, value) => {
    const updated = [...pumpmen];
    updated[index][field] = value;
    setPumpmen(updated);
  };

  // --- Handlers for Multiple Expenses ---
  const handleAddExpense = () => {
    setExpenseList([...expenseList, { reason: '', amount: '' }]);
  };

  const handleRemoveExpense = (index) => {
    setExpenseList(expenseList.filter((_, i) => i !== index));
  };

  const handleExpenseChange = (index, field, value) => {
    const updated = [...expenseList];
    updated[index][field] = value;
    setExpenseList(updated);
  };

  // --- Handlers for Khata ---
  const handleAddKhata = (e) => {
    e.preventDefault();
    if (!newCustomer || !newAmount) return;
    setKhataTransactions([
      ...khataTransactions,
      { customer: newCustomer, remarks: newRemarks || 'Fuel Credit', amount: newAmount }
    ]);
    setNewCustomer('');
    setNewRemarks('');
    setNewAmount('');
    showToast('Credit log added successfully');
  };

  const handleRemoveKhata = (indexToRemove) => {
    setKhataTransactions(khataTransactions.filter((_, index) => index !== indexToRemove));
    showToast('Khata marked as cleared');
  };

  const downloadPDF = () => {
    showToast('Generating Secure PDF...');
    const element = reportRef.current;
    const options = {
      margin:       15,
      filename:    `Bunk_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  };

  // Calculations
  const grossRevenue = Number(cashCollected) + Number(upiCollected) + Number(cardCollected);
  const totalExpenses = expenseList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const netCashInTill = Number(cashCollected) - totalExpenses;
  const totalKhata = khataTransactions.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // ==========================================
  // CUSTOM CSS FOR ANIMATIONS
  // ==========================================
  const customStyles = `
    @keyframes drop {
      0% { transform: translateY(0px) scaleY(0.5); opacity: 0; }
      10% { opacity: 1; transform: translateY(5px) scaleY(1); }
      80% { transform: translateY(45px) scaleY(1.2); opacity: 1; }
      100% { transform: translateY(55px) scaleY(0.5); opacity: 0; }
    }
    .fuel-drop { animation: drop 1.2s infinite ease-in; }
    .fuel-drop:nth-child(2) { animation-delay: 0.4s; }
    .fuel-drop:nth-child(3) { animation-delay: 0.8s; }
    
    @keyframes ripple {
      0% { width: 0%; opacity: 1; }
      100% { width: 100%; opacity: 0; }
    }
    .tank-ripple { animation: ripple 1.2s infinite ease-out; }

    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up {
      animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .toast-enter {
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-4">
        <style>{customStyles}</style>
        <div className="flex flex-col items-center space-y-12">
          <div className="relative flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-slate-400 drop-shadow-lg z-10 relative" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22v-8c0-1.5.5-3 2-4l4-4h7.5c.8 0 1.5.7 1.5 1.5v3.5l-2.5-1.5v-3H13v3.5c0 1.2-1 2.2-2.2 2.2h-3C6.7 12 6 12.7 6 13.8V22H3z"/>
              <path d="M19 15v7"/><path d="M15 15v7"/><path d="M15 15c0-2.2 1.8-4 4-4h1c1.1 0 2 .9 2 2v7h-7v-5z"/>
            </svg>
            <div className="absolute top-12 flex flex-col items-center w-full h-16">
              <div className="fuel-drop absolute w-2 h-4 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
              <div className="fuel-drop absolute w-2 h-4 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
              <div className="fuel-drop absolute w-2 h-4 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
            </div>
            <div className="mt-16 relative w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
               <div className="tank-ripple absolute left-1/2 -translate-x-1/2 top-0 h-full bg-amber-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-slate-100 uppercase drop-shadow-md">{bunkName}</h1>
            <p className="text-xs text-amber-500/80 font-mono tracking-[0.2em] uppercase">Initializing Secure Ledgers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
      <style>{customStyles}</style>

      {/* NEW: Toast Notification */}
      {toast && (
        <div className="toast-enter fixed bottom-6 right-6 z-50 bg-[#1e293b] border border-amber-500/30 text-white px-5 py-3 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Head */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xl mb-6">
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">{bunkName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Shift Operations Management Console</p>
          </div>
          <div className="flex bg-[#0b1120] p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto shadow-inner relative">
            <button onClick={() => setActiveTab('all')} className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'all' ? 'bg-amber-500 text-slate-900 shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Master Inputs
            </button>
            <button onClick={() => setActiveTab('report')} className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'report' ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Final Report
            </button>
          </div>
        </div>

        {/* TAB 1: MASTER INPUTS */}
        {activeTab === 'all' && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Readings */}
            <div className="bg-[#111827] p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-lg space-y-5 hover:border-slate-700 transition-colors">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
                <span className="text-amber-500">❖</span> Meter Readings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Opening Reading</label>
                  <input type="number" className="w-full bg-[#0b1120] text-slate-200 rounded-lg border border-slate-700/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 p-3 transition-all outline-none hover:bg-[#0f172a]" value={openingReading} onChange={(e)=>setOpeningReading(e.target.value)}/>
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Closing Reading</label>
                  <input type="number" className="w-full bg-[#0b1120] text-slate-200 rounded-lg border border-slate-700/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 p-3 transition-all outline-none hover:bg-[#0f172a]" value={closingReading} onChange={(e)=>setClosingReading(e.target.value)}/>
                </div>
              </div>
            </div>

            {/* MULTIPLE PUMPMEN SECTION */}
            <div className="bg-[#111827] p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-lg space-y-6 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-amber-500">❖</span> Pumpmen Shift Logs
                </h2>
                <button onClick={handleAddPumpman} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-1.5 rounded-md text-xs font-bold transition-all border border-slate-700 hover:scale-105 active:scale-95">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                  Add Operator
                </button>
              </div>

              {pumpmen.map((pm, index) => (
                <div key={index} className="bg-[#0b1120] p-5 rounded-xl border border-slate-800 space-y-5 relative shadow-inner animate-slide-up">
                  {pumpmen.length > 1 && (
                    <button onClick={() => handleRemovePumpman(index)} className="absolute top-4 right-4 text-rose-500/70 hover:text-rose-400 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded transition-colors">
                      ✕ Remove
                    </button>
                  )}
                  
                  <div>
                    <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Operator Name #{index + 1}</label>
                    <input type="text" className="w-full bg-[#111827] text-slate-200 rounded-lg border border-slate-700/50 focus:border-amber-500 p-2.5 outline-none transition-all hover:border-slate-600" value={pm.name} onChange={(e)=>handlePumpmanChange(index, 'name', e.target.value)}/>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Power Petrol Sale</label>
                      <input type="number" placeholder="Ltrs / ₹" className="w-full bg-[#111827] text-slate-200 rounded-lg border border-slate-700/50 focus:border-amber-500 p-2.5 outline-none transition-all hover:border-slate-600" value={pm.powerPetrol} onChange={(e)=>handlePumpmanChange(index, 'powerPetrol', e.target.value)}/>
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Oil Packets Sold</label>
                      <input type="number" placeholder="Qty" className="w-full bg-[#111827] text-slate-200 rounded-lg border border-slate-700/50 focus:border-amber-500 p-2.5 outline-none transition-all hover:border-slate-600" value={pm.oilPacket} onChange={(e)=>handlePumpmanChange(index, 'oilPacket', e.target.value)}/>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs uppercase text-slate-500 font-semibold mb-2.5 mt-2">Individual Collections Breakdown</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="relative group">
                        <span className="absolute left-3 top-2.5 text-slate-500 text-sm group-focus-within:text-amber-500 transition-colors">₹</span>
                        <input type="number" placeholder="Cash" className="w-full bg-[#111827] text-amber-100 rounded-lg border border-slate-700/50 focus:border-amber-500 p-2.5 pl-7 text-sm outline-none transition-all hover:border-slate-600" value={pm.cash} onChange={(e)=>handlePumpmanChange(index, 'cash', e.target.value)}/>
                      </div>
                      <div className="relative group">
                        <span className="absolute left-3 top-2.5 text-slate-500 text-sm group-focus-within:text-blue-500 transition-colors">₹</span>
                        <input type="number" placeholder="UPI" className="w-full bg-[#111827] text-blue-100 rounded-lg border border-slate-700/50 focus:border-blue-500 p-2.5 pl-7 text-sm outline-none transition-all hover:border-slate-600" value={pm.upi} onChange={(e)=>handlePumpmanChange(index, 'upi', e.target.value)}/>
                      </div>
                      <div className="relative group">
                        <span className="absolute left-3 top-2.5 text-slate-500 text-sm group-focus-within:text-purple-500 transition-colors">₹</span>
                        <input type="number" placeholder="Card" className="w-full bg-[#111827] text-purple-100 rounded-lg border border-slate-700/50 focus:border-purple-500 p-2.5 pl-7 text-sm outline-none transition-all hover:border-slate-600" value={pm.card} onChange={(e)=>handlePumpmanChange(index, 'card', e.target.value)}/>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall & Expenses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#111827] p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-lg space-y-5 hover:border-slate-700 transition-colors">
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
                   <span className="text-amber-500">❖</span> Shift Consolidations
                </h2>
                <div>
                  <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Overall Physical Cash</label>
                  <div className="relative group">
                    <span className="absolute left-3 top-3 text-slate-500 group-focus-within:text-amber-500 transition-colors">₹</span>
                    <input type="number" className="w-full bg-[#0b1120] text-amber-200 font-medium rounded-lg border border-slate-700/50 focus:border-amber-500 p-3 pl-8 outline-none transition-all hover:bg-[#0f172a]" value={cashCollected} onChange={(e)=>setCashCollected(e.target.value)}/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Overall UPI / QR Scanner</label>
                  <div className="relative group">
                    <span className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-500 transition-colors">₹</span>
                    <input type="number" className="w-full bg-[#0b1120] text-blue-200 font-medium rounded-lg border border-slate-700/50 focus:border-blue-500 p-3 pl-8 outline-none transition-all hover:bg-[#0f172a]" value={upiCollected} onChange={(e)=>setUpiCollected(e.target.value)}/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Overall Card Swipe</label>
                  <div className="relative group">
                    <span className="absolute left-3 top-3 text-slate-500 group-focus-within:text-purple-500 transition-colors">₹</span>
                    <input type="number" className="w-full bg-[#0b1120] text-purple-200 font-medium rounded-lg border border-slate-700/50 focus:border-purple-500 p-3 pl-8 outline-none transition-all hover:bg-[#0f172a]" value={cardCollected} onChange={(e)=>setCardCollected(e.target.value)}/>
                  </div>
                </div>
              </div>

              {/* EXPENSES SECTION */}
              <div className="bg-[#111827] p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-lg space-y-5 flex flex-col hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-amber-500">❖</span> Expenses & Info
                  </h2>
                  <button onClick={handleAddExpense} className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-md text-xs font-bold transition-all hover:scale-105 active:scale-95">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    Expense
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs uppercase text-slate-500 font-semibold mb-1.5">Duty Supervisor</label>
                  <input type="text" className="w-full bg-[#0b1120] text-slate-200 rounded-lg border border-slate-700/50 focus:border-amber-500 p-3 mb-2 outline-none transition-all hover:bg-[#0f172a]" value={manager} onChange={(e)=>setManager(e.target.value)}/>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {expenseList.map((exp, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-[#0b1120] p-3 rounded-xl border border-slate-800 relative animate-slide-up group">
                      <div className="w-full sm:flex-1">
                        <input type="text" placeholder="Reason (e.g. Tea)" className="w-full bg-transparent text-slate-300 text-sm focus:outline-none p-1 placeholder-slate-600 transition-colors focus:text-white" value={exp.reason} onChange={(e)=>handleExpenseChange(index, 'reason', e.target.value)}/>
                      </div>
                      <div className="w-full sm:w-32 flex items-center bg-[#111827] rounded-md border border-slate-700 px-2 group-hover:border-rose-500/50 transition-colors">
                        <span className="text-rose-400 text-sm font-bold">₹</span>
                        <input type="number" placeholder="0" className="w-full bg-transparent text-rose-400 font-bold p-1.5 focus:outline-none text-right placeholder-rose-900" value={exp.amount} onChange={(e)=>handleExpenseChange(index, 'amount', e.target.value)}/>
                      </div>
                      {expenseList.length > 1 && (
                        <button onClick={() => handleRemoveExpense(index)} className="text-slate-600 hover:text-rose-400 w-full sm:w-auto text-center sm:text-left mt-2 sm:mt-0 p-1 transition-colors">
                          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</span>
                  <span className="text-xl font-black text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]">₹{totalExpenses}</span>
                </div>
              </div>

            </div>

            {/* Khata Ledger Adding List */}
            <div className="bg-[#111827] p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-lg space-y-5 hover:border-slate-700 transition-colors">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
                 <span className="text-amber-500">❖</span> Credit Ledger (Khata)
              </h2>
              <form onSubmit={handleAddKhata} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input type="text" placeholder="Customer Name" className="bg-[#0b1120] rounded-lg border border-slate-700/50 focus:border-amber-500 p-3 text-sm text-slate-200 outline-none transition-all hover:bg-[#0f172a]" value={newCustomer} onChange={(e)=>setNewCustomer(e.target.value)}/>
                <input type="text" placeholder="Vehicle No / Notes" className="bg-[#0b1120] rounded-lg border border-slate-700/50 focus:border-amber-500 p-3 text-sm text-slate-200 outline-none transition-all hover:bg-[#0f172a]" value={newRemarks} onChange={(e)=>setNewRemarks(e.target.value)}/>
                <div className="relative group">
                  <span className="absolute left-3 top-3 text-slate-500 text-sm group-focus-within:text-amber-500 transition-colors">₹</span>
                  <input type="number" placeholder="Amount" className="w-full bg-[#0b1120] rounded-lg border border-slate-700/50 focus:border-amber-500 p-3 pl-7 text-sm text-amber-200 font-medium outline-none transition-all hover:bg-[#0f172a]" value={newAmount} onChange={(e)=>setNewAmount(e.target.value)}/>
                </div>
                <button type="submit" className="flex justify-center items-center gap-2 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold text-sm rounded-lg p-3 transition-all shadow-md hover:shadow-amber-500/20 active:scale-95">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Log Entry
                </button>
              </form>

              <div className="space-y-3 mt-6">
                {khataTransactions.map((tx, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#0b1120] p-4 rounded-xl border border-slate-800 shadow-sm animate-slide-up hover:border-slate-700 transition-colors group">
                    <div>
                      <div className="font-bold text-slate-200 text-sm">{tx.customer}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tx.remarks}</div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="font-mono text-amber-400 font-bold text-base">₹{tx.amount}</div>
                      <button onClick={() => handleRemoveKhata(idx)} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/50 bg-slate-800 hover:bg-emerald-500/10 px-3 py-1.5 rounded-md transition-all opacity-80 group-hover:opacity-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Cleared
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINAL RECONCILIATION SUMMARY */}
        {activeTab === 'report' && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-gradient-to-r from-[#111827] to-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-black text-white tracking-wide">Shift Reconciliation Finalized</h2>
                <p className="text-sm text-amber-500/80 mt-1 font-medium">Verify final balances before generating official print records.</p>
              </div>
              <button onClick={downloadPDF} className="relative z-10 w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 font-bold text-white px-8 py-3.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95">
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 text-center shadow-lg hover:border-slate-700 transition-colors">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Gross Revenue</div>
                <div className="text-3xl font-black text-slate-200">₹{grossRevenue}</div>
              </div>
              <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 text-center shadow-lg hover:border-slate-700 transition-colors">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Total Expenses</div>
                <div className="text-3xl font-black text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]">- ₹{totalExpenses}</div>
              </div>
              <div className="bg-[#0f172a] p-6 rounded-2xl border border-amber-500/30 text-center shadow-[0_0_20px_rgba(245,158,11,0.05)] relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="text-xs text-amber-500/80 font-bold uppercase tracking-wider mb-2">Net Cash Expected</div>
                  <div className="text-3xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]">₹{netCashInTill}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-widest border-b border-slate-800 pb-2">Khata Statement Summary</h3>
              <p className="text-slate-300 leading-relaxed">
                Today's credit log value stands at <span className="text-amber-400 font-black text-lg mx-1">₹{totalKhata}</span> across <span className="text-amber-400 font-bold mx-1">{khataTransactions.length} unique</span> client transactions.
              </p>
            </div>
          </div>
        )}

        <DailyPdfTemplate 
          reportRef={reportRef} 
          data={{
            bunkName, manager, date: new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }),
            openingReading, closingReading, pumpmen, cashCollected, upiCollected, cardCollected,
            expenseList, totalExpenses, khataTransactions
          }}
        />
      </div>
    </div>
  );
}