/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  CreditCard, 
  Share2, 
  BookOpen, 
  Bus, 
  FlaskConical, 
  CheckCircle, 
  Download, 
  HelpCircle, 
  History, 
  Loader2, 
  ArrowLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { FeeItem, PaymentTransaction } from '../types';

export default function FeeManagement() {
  // Outstanding balance states
  const [balance, setBalance] = useState<number>(12450);
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  
  // Payment Modal State
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<'options' | 'card' | 'success'>('options');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  
  // Card Details state
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');

  // Fee breakdown data
  const [fees, setFees] = useState<FeeItem[]>([
    { id: 'f1', name: 'Tuition Fees', amount: 8500, status: 'Unpaid', icon: 'book' },
    { id: 'f2', name: 'Transport', amount: 2400, status: 'Unpaid', icon: 'bus' },
    { id: 'f3', name: 'Lab & Library', amount: 1550, status: 'Unpaid', icon: 'lab' }
  ]);

  // Payment transactions
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: 'tx1',
      title: 'Term 1 Full Payment',
      date: '14 Aug 2024',
      receiptNumber: 'TXN-8842',
      amount: 15200,
      status: 'Success'
    },
    {
      id: 'tx2',
      title: 'Admission Fee',
      date: '02 Apr 2024',
      receiptNumber: 'TXN-1029',
      amount: 5000,
      status: 'Success'
    },
    {
      id: 'tx3',
      title: 'Verification Pending',
      date: 'Bank Transfer initiated • 24h ago',
      receiptNumber: 'TXN-9128',
      amount: 2000,
      status: 'Pending'
    }
  ]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleBalance = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handlePayNowClick = () => {
    if (balance <= 0) {
      triggerToast("You have no outstanding balance to pay.");
      return;
    }
    setPaymentStep('options');
    setShowPayModal(true);
  };

  const handlePaymentSubmit = () => {
    setIsProcessing(true);
    // Simulate API network latency
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
      
      // Update data state
      const completedAmount = balance;
      setBalance(0);
      setFees(fees.map(f => ({ ...f, status: 'Paid' })));
      
      // Add transaction to history
      const newTx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        title: 'Outstanding Dues Payment',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        receiptNumber: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: completedAmount,
        status: 'Success'
      };
      setTransactions([newTx, ...transactions]);
    }, 2000);
  };

  const handleDownloadReceipt = (txn: PaymentTransaction) => {
    triggerToast(`Downloading Receipt ${txn.receiptNumber} for ₹${txn.amount.toLocaleString()} as PDF...`);
  };

  const handleShareDetails = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bharat Junior High School - Outstanding Fees',
        text: `My total outstanding fees is ₹${balance.toLocaleString('en-IN')}`,
        url: window.location.href,
      }).catch(err => {
        triggerToast("Fees details copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(`Bharat School - Total Outstanding Balance: ₹${balance.toLocaleString('en-IN')}`);
      triggerToast("Fees details copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6 pb-28 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1a237e] text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-semibold tracking-wide border border-indigo-400/20">
          <CheckCircle size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Outstanding Balance Hero Card */}
      <section className="mt-2">
        <div className="bg-gradient-to-br from-[#1a237e] to-[#283593] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          {/* Decorative blur effect */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <p className="text-sm font-semibold text-indigo-100 opacity-80 mb-1 tracking-wider uppercase">Total Outstanding Balance</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span 
              onClick={handleToggleBalance}
              className="text-4xl font-bold cursor-pointer transition-opacity hover:opacity-80 font-mono tracking-tight"
              title="Click to hide/reveal balance"
            >
              {isBalanceVisible ? `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ ••••••'}
            </span>
            {balance > 0 && (
              <span className="text-xs text-indigo-200 bg-white/10 px-2 py-0.5 rounded font-medium">
                Due by Oct 15
              </span>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handlePayNowClick}
              className={`flex-1 ${
                balance > 0 ? 'bg-amber-500 hover:bg-amber-400 text-amber-950' : 'bg-slate-600 text-slate-300 cursor-not-allowed'
              } py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all duration-200`}
              disabled={balance <= 0}
            >
              <CreditCard size={18} />
              {balance > 0 ? 'Pay Now' : 'All Paid!'}
            </button>
            <button 
              onClick={handleShareDetails}
              className="p-3.5 rounded-full border border-white/30 hover:bg-white/10 transition-colors active:scale-90"
              title="Share Fee Invoice Details"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Fee Breakdown */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1a237e] tracking-tight">Fee Breakdown</h2>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Term 2 (2026-2027)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fees.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-36 hover:shadow-md hover:border-indigo-50 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1a237e]">
                  {item.icon === 'book' && <BookOpen size={20} />}
                  {item.icon === 'bus' && <Bus size={20} />}
                  {item.icon === 'lab' && <FlaskConical size={20} />}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.status === 'Paid' || balance === 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-amber-50 text-amber-800 border border-amber-100'
                }`}>
                  {item.status === 'Paid' || balance === 0 ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.name}</p>
                <p className="text-2xl font-bold text-[#1a237e] font-mono mt-0.5">₹{item.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment History */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1a237e] tracking-tight">Payment History</h2>
          <button 
            onClick={() => triggerToast("Loading more transactions...")}
            className="text-sm font-bold text-[#1a237e] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((txn) => (
            <div 
              key={txn.id} 
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${
                txn.status === 'Success' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : txn.status === 'Pending'
                    ? 'bg-indigo-50 text-indigo-600 border border-dashed border-indigo-200'
                    : 'bg-rose-50 text-rose-600'
              }`}>
                {txn.status === 'Success' ? (
                  <CheckCircle size={24} />
                ) : (
                  <History size={24} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-800 tracking-tight truncate">{txn.title}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {txn.date} • Receipt #{txn.receiptNumber}
                </p>
              </div>

              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="text-base font-bold text-slate-800 font-mono">₹{txn.amount.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    txn.status === 'Success' 
                      ? 'text-emerald-600' 
                      : 'text-amber-600'
                  }`}>
                    {txn.status}
                  </span>
                </div>
                {txn.status === 'Success' && (
                  <button 
                    onClick={() => handleDownloadReceipt(txn)}
                    className="text-[#1a237e] hover:bg-indigo-50 p-2 rounded-xl transition-colors" 
                    title="Download Receipt PDF"
                  >
                    <Download size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Help Support Card */}
      <section className="pb-12">
        <div className="bg-[#eeeeee] p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-[#1a237e] tracking-tight">Need help?</h3>
            <p className="text-sm text-slate-500 font-light max-w-md">
              Facing issues with credit card gateways, bank transfers, or need to request a custom installment plan?
            </p>
          </div>
          <button 
            onClick={() => triggerToast("Connecting you to Fee Desk Support Chat...")}
            className="bg-[#1a237e] text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-800 transition-colors active:scale-90"
            title="Chat with Support"
          >
            <HelpCircle size={22} />
          </button>
        </div>
      </section>

      {/* Payment Processing Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            {/* Step 1: Payment Options */}
            {paymentStep === 'options' && (
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[#1a237e]">Select Payment Method</h3>
                  <button 
                    onClick={() => setShowPayModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-semibold p-1.5 hover:bg-slate-50 rounded-full"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => { setSelectedMethod('card'); setPaymentStep('card'); }}
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-[#1a237e] hover:bg-indigo-50/20 text-left flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-[#1a237e]" size={24} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Credit / Debit Card</p>
                        <p className="text-xs text-slate-400 mt-0.5">Visa, Mastercard, RuPay, Maestro</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>

                  <button 
                    onClick={() => { setSelectedMethod('upi'); handlePaymentSubmit(); }}
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-[#1a237e] hover:bg-indigo-50/20 text-left flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#1a237e] flex items-center justify-center font-black text-xs">UPI</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Instant UPI Transfer</p>
                        <p className="text-xs text-slate-400 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm">
                  <span className="text-slate-500">Payable Amount:</span>
                  <span className="font-bold text-[#1a237e] font-mono">₹{balance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            {/* Step 2: Card details */}
            {paymentStep === 'card' && (
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPaymentStep('options')}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <h3 className="text-xl font-bold text-[#1a237e]">Card Details</h3>
                  </div>
                  <button 
                    onClick={() => setShowPayModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-semibold p-1.5 hover:bg-slate-50 rounded-full"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456" 
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e] outline-none text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e] outline-none text-sm font-medium text-center"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase">CVV</label>
                      <input 
                        type="password" 
                        placeholder="***" 
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e] outline-none text-sm font-medium text-center"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full bg-[#1a237e] hover:bg-indigo-800 disabled:bg-slate-400 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Processing Secure Gateway...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Pay ₹{balance.toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 3: Success message */}
            {paymentStep === 'success' && (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle size={36} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1a237e]">Payment Successful</h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">
                    Your Term 2 outstanding dues have been settled successfully. A formal receipt has been emailed to your parent/guardian.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="text-slate-800 font-mono">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Amount Settled:</span>
                    <span className="text-slate-800 font-bold">₹12,450.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Channel:</span>
                    <span className="text-slate-800 uppercase font-semibold">{selectedMethod === 'card' ? 'Visa Card' : 'UPI Instant'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPayModal(false)}
                  className="w-full bg-[#1a237e] hover:bg-indigo-800 text-white py-3 rounded-full font-bold text-sm shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
