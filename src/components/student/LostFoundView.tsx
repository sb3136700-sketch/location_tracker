import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Tag,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LostFoundItem } from '../../types';

export const LostFoundView: React.FC = () => {
  const { lostFoundList, reportLostFound, getMatchesForItem, user } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'report'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemForMatch, setSelectedItemForMatch] = useState<LostFoundItem | null>(null);

  // Report Form State
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateOccurred, setDateOccurred] = useState(new Date().toISOString().split('T')[0]);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80');
  const [contactInfo, setContactInfo] = useState(user?.email || 'student@campusone.demo');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = ['Electronics', 'ID & Wallets', 'Personal Belongings', 'Books & Notes', 'Keys', 'Clothing'];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !description || !location) return;

    reportLostFound({
      type: reportType,
      itemName,
      category,
      description,
      location,
      date: dateOccurred,
      photoUrl,
      contactInfo,
      reportedBy: user?.id || 'usr-student-01',
      status: 'open'
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('all');
      setItemName('');
      setDescription('');
      setLocation('');
    }, 1500);
  };

  const filteredItems = lostFoundList.filter((item) => {
    if (activeTab === 'lost' && item.type !== 'lost') return false;
    if (activeTab === 'found' && item.type !== 'found') return false;

    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">🔍 Lost & Found Intelligence</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              AI SIMILARITY MATCH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Report lost belongings or items you recovered. Our similarity matcher automatically links corresponding lost and found items.
          </p>
        </div>

        {/* Tab Switcher & Report Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
          >
            <PlusCircle size={15} />
            <span>Report Item</span>
          </button>
        </div>
      </div>

      {/* View Switcher / Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'lost', label: 'Lost Reports' },
            { id: 'found', label: 'Found Items' },
            { id: 'report', label: 'Log New Report' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'report' && (
          <div className="relative min-w-[240px]">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items, tags, locations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* REPORT FORM */}
      {/* ========================================================================= */}
      {activeTab === 'report' ? (
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto space-y-4">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Log Lost or Recovered Article</h3>
              <p className="text-xs text-slate-400">CampusOne AI will cross-reference existing records instantly.</p>
            </div>
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setReportType('lost')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  reportType === 'lost' ? 'bg-rose-500 text-white' : 'text-slate-400'
                }`}
              >
                I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setReportType('found')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  reportType === 'found' ? 'bg-emerald-500 text-white' : 'text-slate-400'
                }`}
              >
                I Found Something
              </button>
            </div>
          </div>

          {formSubmitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-white">Report Successfully Registered!</h4>
              <p className="text-xs text-slate-400">Cross-checking similarity with campus database...</p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Item Title</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Black Casio Calculator fx-991EX"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention color, brand, stickers, unique scratches, or contents..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 h-20 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location on Campus</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. CSE-204 Lecture Hall, 2nd floor desk"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={dateOccurred}
                    onChange={(e) => setDateOccurred(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Email / Phone</label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 font-bold text-white text-xs shadow-lg shadow-cyan-500/20 transition"
              >
                Submit & Run AI Match Analysis
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Items Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const matches = getMatchesForItem(item);
            const bestMatch = matches[0];

            return (
              <div
                key={item.id}
                className="bg-[#0b1329] border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition"
              >
                {/* Photo & Badge */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.photoUrl}
                    alt={item.itemName}
                    className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md ${
                        item.type === 'lost'
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-slate-700">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1">
                  <h3 className="text-base font-bold text-white leading-snug">{item.itemName}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={13} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={13} className="text-cyan-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* AI Matcher Banner if matches exist */}
                  {bestMatch && (
                    <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-300 flex items-center gap-1">
                          <Sparkles size={12} className="text-purple-400" />
                          <span>{bestMatch.score}% Match Found</span>
                        </span>
                        <span className="text-[10px] text-purple-400 uppercase font-mono">Similarity</span>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate">
                        Correlates with: <strong>{bestMatch.item.itemName}</strong>
                      </p>
                      <p className="text-[9px] text-purple-300/80 italic">
                        Possible match — not guaranteed identification.
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/40">
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    Contact: {item.contactInfo}
                  </span>
                  <button
                    onClick={() => setSelectedItemForMatch(item)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>View Matches</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Matches Modal */}
      {selectedItemForMatch && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-cyan-400">AI Match Engine</span>
                <h3 className="text-base font-bold text-white mt-1">
                  Correlating: {selectedItemForMatch.itemName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemForMatch(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>Possible match — not guaranteed identification. Please verify ownership details.</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {getMatchesForItem(selectedItemForMatch).length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No high-confidence matches found yet. We will notify you when a matching report is submitted.
                </div>
              ) : (
                getMatchesForItem(selectedItemForMatch).map(({ item, score }) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-purple-500/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.itemName}</span>
                        <span className="font-mono text-purple-400 font-bold">{score}% match</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Location: {item.location}</p>
                      <p className="text-[11px] text-cyan-300 mt-1">Contact: {item.contactInfo}</p>
                    </div>
                    <a
                      href={`mailto:${item.contactInfo}?subject=Inquiry regarding ${item.itemName} on CampusOne`}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 font-bold hover:bg-purple-500/30 transition text-xs"
                    >
                      Connect
                    </a>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedItemForMatch(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
