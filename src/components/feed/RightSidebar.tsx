import React from 'react';
import { 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { useFeed } from '../../context/FeedContext';

export const RightSidebar: React.FC = () => {
  const { executePromptSearch } = useFeed();

  const cyberCityClusters = [
    { name: 'DLF Phase 3 (U Block)', dist: '1.2 km', time: '4 mins drive / 14m walk', prompt: 'DLF Phase 3 U Block room near Cyber City' },
    { name: 'DLF Phase 2 (P Block)', dist: '1.8 km', time: '6 mins drive / 18m walk', prompt: 'DLF Phase 2 roommate near Cyber Hub' },
    { name: 'Sector 24 (Cyber Park)', dist: '2.1 km', time: '7 mins drive / 22m walk', prompt: 'Sector 24 Cyber Park studio flat' },
    { name: 'DLF Phase 1 / MG Road', dist: '3.2 km', time: '9 mins drive', prompt: 'DLF Phase 1 2 BHK near MG Road' },
    { name: 'Golf Course Road (DLF 5)', dist: '5.2 km', time: '14 mins drive', prompt: 'Golf Course Road DLF 5 luxury roommate' },
  ];

  const recentRoommateSeekers = [
    { name: 'Pooja Iyer', profession: 'Product Designer at Uber', seeking: 'Looking for 1 female roommate in DLF Phase 2/3', budget: '₹18k/mo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { name: 'Siddharth Roy', profession: 'Software Engineer at Zomato', seeking: 'Looking for 1 roommate in DLF Phase 1/Cyber City', budget: '₹16k/mo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Ananya Sharma', profession: 'Consultant at Deloitte', seeking: 'Looking for single room with balcony in Golf Course Rd', budget: '₹22k/mo', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <aside className="space-y-4">
      {/* 1. DLF Cyber City Proximity Radar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-4 space-y-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">DLF Cyber City Radar</h4>
              <p className="text-[10px] text-slate-400">Workplace proximity matrix</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Center Point
          </span>
        </div>

        {/* Proximity Clusters List */}
        <div className="space-y-2 pt-1">
          {cyberCityClusters.map(cluster => (
            <div
              key={cluster.name}
              onClick={() => executePromptSearch(cluster.prompt)}
              className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer transition flex items-center justify-between group"
            >
              <div>
                <p className="font-bold text-slate-900 text-[11px] group-hover:text-emerald-800 transition">
                  {cluster.name}
                </p>
                <p className="text-[10px] text-slate-500">{cluster.time}</p>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-900 font-extrabold text-[10px]">
                  {cluster.dist}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Active Roommate Requests Ticker */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
            Active Roommate Seekers
          </h4>
          <span className="text-[10px] font-bold text-slate-400">Live</span>
        </div>

        <div className="space-y-2.5">
          {recentRoommateSeekers.map((seeker, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={seeker.avatar}
                    alt={seeker.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">{seeker.name}</p>
                    <p className="text-[9px] text-slate-400 truncate">{seeker.profession}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700">{seeker.budget}</span>
              </div>

              <p className="text-[11px] text-slate-700 leading-snug">
                "{seeker.seeking}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Community Safety & Zero Brokerage Note */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="font-bold text-white text-xs">100% Zero Brokerage Platform</h4>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          ekThikana connects you directly with verified tenants, working roommates, and direct homeowners in Delhi/NCR. Powered by open-source IndexedDB.
        </p>
      </div>
    </aside>
  );
};
