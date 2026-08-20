import React from 'react';
import { 
  X, 
  Scale, 
  Trash2, 
  MessageSquare, 
  Eye,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertyContext';
import { useChat } from '../../context/ChatContext';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose }) => {
  const { user, toggleCompareProperty, clearComparedProperties } = useAuth();
  const { properties, setSelectedProperty } = useProperties();
  const { openChatForProperty } = useChat();

  if (!isOpen) return null;

  const comparedProperties = properties.filter(p => user.comparedPropertyIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-500 text-white flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Side-by-Side Property Comparison</h3>
              <p className="text-xs text-slate-500">
                Comparing {comparedProperties.length} of 4 selected homes in Delhi/NCR
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProperties.length > 0 && (
              <button
                onClick={clearComparedProperties}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-4 sm:p-6">
          {comparedProperties.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No properties selected for comparison</h4>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Click the scale icon on any property card to compare features, prices, and metro distances side by side.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="min-w-[700px]">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 w-48 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Property Details
                    </th>
                    {comparedProperties.map(p => (
                      <th key={p.id} className="p-3 w-64 align-top">
                        <div className="relative group bg-slate-50 rounded-2xl p-2.5 border border-slate-200">
                          <button
                            onClick={() => toggleCompareProperty(p.id)}
                            className="absolute top-1.5 right-1.5 p-1 bg-white rounded-full shadow-xs text-slate-400 hover:text-rose-500"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full aspect-[16/10] rounded-xl object-cover mb-2"
                          />
                          <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                          <p className="text-sm font-extrabold text-brand-600 font-display mt-0.5">
                            {p.priceDisplay}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{p.locality}, {p.region}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* Price per sq.ft */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Rate / sq.ft</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3 font-bold text-slate-800">
                        {p.pricePerSqFt ? `₹${p.pricePerSqFt.toLocaleString('en-IN')} / sq.ft` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* BHK & Config */}
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-500">Configuration</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3 font-bold text-slate-800">
                        {p.bhk} BHK, {p.bathrooms} Baths, {p.balconies} Balconies
                      </td>
                    ))}
                  </tr>

                  {/* Super Area vs Carpet */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Area (Super / Carpet)</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3 text-slate-700">
                        <span className="font-bold">{p.superAreaSqFt} sq.ft</span> (Carpet: {p.carpetAreaSqFt} sq.ft)
                      </td>
                    ))}
                  </tr>

                  {/* Nearest Metro */}
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-500">Metro Proximity</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3 text-slate-700">
                        <p className="font-bold text-slate-900">{p.nearestMetro.stationName}</p>
                        <p className="text-[10px] text-slate-500">{p.nearestMetro.distanceMeters}m walk ({p.nearestMetro.line} Line)</p>
                      </td>
                    ))}
                  </tr>

                  {/* Furnishing */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Furnishing</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3 font-semibold text-slate-800">
                        {p.furnishing}
                      </td>
                    ))}
                  </tr>

                  {/* Maintenance */}
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-500">Monthly Maintenance</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3 text-slate-700 font-semibold">
                        {p.maintenanceMonthly ? `₹${p.maintenanceMonthly.toLocaleString('en-IN')}/mo` : 'Included'}
                      </td>
                    ))}
                  </tr>

                  {/* Vastu Compliant */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Vastu Compliant</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3">
                        {p.vastuCompliant ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                            <Check className="w-3.5 h-3.5" /> Compliant
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* RERA Status */}
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-500">RERA Verified</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3 font-medium text-slate-800">
                        {p.reraId ? `✓ ${p.reraId}` : 'Freehold Direct Title'}
                      </td>
                    ))}
                  </tr>

                  {/* Actions row */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Actions</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="p-3">
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedProperty(p);
                              onClose();
                            }}
                            className="py-1.5 px-3 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full Details</span>
                          </button>
                          <button
                            onClick={() => {
                              openChatForProperty(p);
                              onClose();
                            }}
                            className="py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-200 flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Chat with Owner</span>
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
