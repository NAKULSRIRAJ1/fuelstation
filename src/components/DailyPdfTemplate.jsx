import React from 'react';

export default function DailyPdfTemplate({ reportRef, data }) {
  return (
    <div style={{ display: 'none' }}>
      <div ref={reportRef} style={{ fontFamily: 'Arial, sans-serif', color: '#2d3748', padding: '20px', backgroundColor: '#fff' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '3px solid #1a365d', paddingBottom: '12px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a365d', margin: 0, textTransform: 'uppercase' }}>
            {data.bunkName}
          </h1>
          <p style={{ fontSize: '14px', color: '#4a5568', margin: '4px 0 0 0' }}>Daily Operational Summary & Shift Ledger</p>
        </div>

        {/* Metadata & Readings */}
        <table style={{ width: '100%', marginBottom: '20px', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold', width: '15%' }}>Date:</td>
              <td style={{ width: '35%' }}>{data.date}</td>
              <td style={{ fontWeight: 'bold', width: '15%' }}>Manager:</td>
              <td style={{ width: '35%' }}>{data.manager}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', paddingTop: '8px' }}>Meter Open:</td>
              <td style={{ paddingTop: '8px' }}>{data.openingReading || '-'}</td>
              <td style={{ fontWeight: 'bold', paddingTop: '8px' }}>Meter Close:</td>
              <td style={{ paddingTop: '8px' }}>{data.closingReading || '-'}</td>
            </tr>
          </tbody>
        </table>

        {/* 1. Multiple Pumpmen Log */}
        <h3 style={{ color: '#1a365d', borderLeft: '4px solid #2b6cb0', paddingLeft: '8px', margin: '20px 0 10px 0', fontSize: '16px' }}>
          1. Pumpmen Operations Log
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
          <tbody>
            {data.pumpmen.map((pm, idx) => (
              <React.Fragment key={idx}>
                <tr style={{ backgroundColor: '#f7fafc', borderTop: '2px solid #e2e8f0', borderBottom: '1px solid #cbd5e0' }}>
                  <td colSpan="3" style={{ padding: '8px', fontWeight: 'bold', color: '#2b6cb0' }}>
                    Operator {idx + 1}: {pm.name || 'Unnamed'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold', width: '30%' }}>Sales</td>
                  <td style={{ padding: '8px' }}>Power Petrol: {pm.powerPetrol || '-'}</td>
                  <td style={{ padding: '8px' }}>Oil Packets: {pm.oilPacket || '-'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Collections</td>
                  <td style={{ padding: '8px' }} colSpan="2">
                    Cash: ₹{pm.cash || '0'} | UPI: ₹{pm.upi || '0'} | Card: ₹{pm.card || '0'}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* 2. Overall Shift Revenue */}
        <h3 style={{ color: '#1a365d', borderLeft: '4px solid #2b6cb0', paddingLeft: '8px', margin: '20px 0 10px 0', fontSize: '16px' }}>
          2. Overall Shift Revenue
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Payment Mode</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Amount Collected</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px' }}>Physical Cash Bag</td>
              <td style={{ textAlign: 'right', padding: '8px' }}>₹{data.cashCollected}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px' }}>UPI / Digital (GPay/PhonePe)</td>
              <td style={{ textAlign: 'right', padding: '8px' }}>₹{data.upiCollected}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px' }}>Card Swipe Terminals</td>
              <td style={{ textAlign: 'right', padding: '8px' }}>₹{data.cardCollected}</td>
            </tr>
          </tbody>
        </table>

        {/* 3. Khata Sales */}
        <h3 style={{ color: '#1a365d', borderLeft: '4px solid #2b6cb0', paddingLeft: '8px', margin: '20px 0 10px 0', fontSize: '16px' }}>
          3. Credit Sales (Khata Ledger)
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Customer Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Vehicle/Remarks</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.khataTransactions.length === 0 && (
              <tr><td colSpan="3" style={{ padding: '8px', textAlign: 'center', color: '#718096' }}>No active khata entries.</td></tr>
            )}
            {data.khataTransactions.map((tx, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px' }}>{tx.customer}</td>
                <td style={{ padding: '8px' }}>{tx.remarks}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>₹{tx.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 4. Final Reconciliation */}
        <h3 style={{ color: '#1a365d', borderLeft: '4px solid #2b6cb0', paddingLeft: '8px', margin: '20px 0 10px 0', fontSize: '16px' }}>
          4. Final Reconciliation
        </h3>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Gross Revenue</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a' }}>
              ₹{Number(data.cashCollected) + Number(data.upiCollected) + Number(data.cardCollected)}
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Total Expenses Paid</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#c53030' }}>₹{data.totalExpenses}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#ebf8ff', border: '1px solid #bee3f8', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#2b6cb0', textTransform: 'uppercase' }}>Net Cash In Till</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2b6cb0' }}>
              ₹{Number(data.cashCollected) - Number(data.totalExpenses)}
            </div>
          </div>
        </div>
        
        {/* MULTIPLE EXPENSE NOTES SUMMARY */}
        <div style={{ fontSize: '12px', color: '#4a5568', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', padding: '10px', borderRadius: '4px' }}>
          <strong style={{ display: 'block', marginBottom: '6px', color: '#c53030' }}>Itemized Expenses Breakdown:</strong>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {data.expenseList.length === 0 && <li>No expenses recorded for this shift.</li>}
            {data.expenseList.map((exp, idx) => (
              <li key={idx}>
                {exp.reason || 'Unnamed Expense'} — <strong>₹{exp.amount || '0'}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Signatures */}
        <table style={{ width: '100%', marginTop: '40px', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', borderTop: '1px solid #a0aec0', paddingTop: '8px', textAlign: 'center' }}>
                Supervisor Signature
              </td>
              <td style={{ width: '50%', borderTop: '1px solid #a0aec0', paddingTop: '8px', textAlign: 'center' }}>
                Owner Signature
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
}