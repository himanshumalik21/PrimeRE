import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Lock, 
  ShieldCheck, 
  CheckCheck, 
  ChevronRight
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useProperties } from '../../context/PropertyContext';

export const ChatDrawer: React.FC = () => {
  const { 
    threads, 
    activeThread, 
    activeThreadId, 
    selectThread, 
    sendMessage, 
    sendOffer, 
    isChatOpen, 
    setIsChatOpen 
  } = useChat();

  const { setSelectedProperty, properties } = useProperties();

  const [inputMessage, setInputMessage] = useState('');
  const [isOfferInputOpen, setIsOfferInputOpen] = useState(false);
  const [customOfferVal, setCustomOfferVal] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  if (!isChatOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickQuestion = (q: string) => {
    sendMessage(q);
  };

  const handleCustomOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customOfferVal);
    if (!val) return;
    sendOffer(val);
    setCustomOfferVal('');
    setIsOfferInputOpen(false);
  };

  const currentProperty = activeThread
    ? properties.find(p => p.id === activeThread.propertyId)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col sm:flex-row border-l border-slate-200">
        
        {/* Left Sub-Column: Threads List (on desktop) */}
        <div className="w-full sm:w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-44 sm:h-full">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Encrypted Chats</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 sm:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Threads List */}
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {threads.map(t => {
              const isActive = t.id === activeThreadId;
              return (
                <div
                  key={t.id}
                  onClick={() => selectThread(t.id)}
                  className={`p-2.5 rounded-2xl cursor-pointer transition flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-white shadow-xs border border-slate-200/80 font-medium'
                      : 'hover:bg-slate-100/80 text-slate-600'
                  }`}
                >
                  <img
                    src={t.participant.avatar}
                    alt={t.participant.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{t.participant.name}</p>
                      <span className="text-[10px] text-slate-400">{t.lastMessageAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate font-medium">{t.propertyTitle}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">{t.propertyPrice}</p>
                  </div>
                  {t.unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 self-center"></span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Security Banner on bottom of sidebar */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Direct Landlord Channel. Spam Protected.</span>
          </div>
        </div>

        {/* Right / Main Active Chat Column */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/50">
          
          {activeThread ? (
            <>
              {/* Active Thread Header */}
              <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={activeThread.participant.avatar}
                    alt={activeThread.participant.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {activeThread.participant.name}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        {activeThread.participant.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Active Now • Responds {activeThread.participant.responseTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentProperty && (
                    <button
                      onClick={() => {
                        setSelectedProperty(currentProperty);
                        setIsChatOpen(false);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>View Listing</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Property Snapshot Mini Bar */}
              <div className="px-4 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={activeThread.propertyImage}
                    alt={activeThread.propertyTitle}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate text-[11px]">
                      {activeThread.propertyTitle}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {activeThread.propertyLocality}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-900 font-display shrink-0 pl-2">
                  {activeThread.propertyPrice}
                </span>
              </div>

              {/* End-to-End Encryption Notice */}
              <div className="mx-4 my-2 p-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-[10px] text-emerald-800 flex items-center justify-center gap-1.5 text-center">
                <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Messages and negotiations in this channel are end-to-end encrypted ({activeThread.encryptionFingerprint})</span>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeThread.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.isMe
                          ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                      }`}
                    >
                      {/* Standard text */}
                      <p>{msg.text}</p>

                      {/* Offer Badge Card */}
                      {msg.offer && (
                        <div className="mt-2 p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 flex items-center justify-between text-[11px]">
                          <span className="font-bold">Direct Offer: ₹{msg.offer.amount.toLocaleString('en-IN')}</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-bold uppercase text-[9px]">
                            {msg.offer.status}
                          </span>
                        </div>
                      )}

                      {/* Visit Badge Card */}
                      {msg.visit && (
                        <div className="mt-2 p-2 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-100 flex items-center justify-between text-[11px]">
                          <span className="font-bold">{msg.visit.type} on {msg.visit.date}</span>
                          <span className="px-1.5 py-0.2 rounded bg-blue-400 text-slate-950 font-bold uppercase text-[9px]">
                            {msg.visit.status}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400 px-1">
                      <span>{msg.timestamp}</span>
                      {msg.isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Inquiry Action Chips */}
              <div className="px-3 py-2 bg-white border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => handleQuickQuestion('Is the price negotiable for an immediate token?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                >
                  🏷️ Price Negotiable?
                </button>
                <button
                  onClick={() => handleQuickQuestion('How far is the nearest Metro station by walking?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                >
                  🚇 Metro Distance?
                </button>
                <button
                  onClick={() => handleQuickQuestion('Can we schedule a physical visit this Saturday?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                >
                  📅 Visit This Weekend?
                </button>
                <button
                  onClick={() => setIsOfferInputOpen(!isOfferInputOpen)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition border border-emerald-200"
                >
                  💰 Submit Offer
                </button>
              </div>

              {/* Offer Drawer input */}
              {isOfferInputOpen && (
                <form onSubmit={handleCustomOfferSubmit} className="p-3 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-950">Make Offer (INR ₹):</span>
                  <input
                    type="number"
                    value={customOfferVal}
                    onChange={e => setCustomOfferVal(e.target.value)}
                    placeholder="e.g. 8500000"
                    className="flex-1 p-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Send Offer
                  </button>
                </form>
              )}

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Type an encrypted message..."
                  className="flex-1 p-2.5 rounded-xl bg-slate-100 focus:bg-white text-xs font-medium text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Lock className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">Select a conversation</p>
              <p className="text-[11px]">Chat directly with verified property owners in Delhi/NCR.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
