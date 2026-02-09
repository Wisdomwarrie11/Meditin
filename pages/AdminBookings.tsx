
import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../services/firestoreService';
import { PracticeSession } from '../types';
import { 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Building, 
  Briefcase,
  Calendar,
  Loader2,
  Table as TableIcon,
  HelpCircle,
  Shield
} from 'lucide-react';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllBookings();
      setBookings(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const downloadCSV = () => {
    const headers = ['FullName', 'Email', 'Institution', 'Sector', 'Field', 'Nature', 'QType', 'Standard', 'Date', 'Time', 'Paid'];
    const rows = filteredBookings.map(b => [
      b.fullName,
      b.email,
      b.institution,
      b.sector,
      b.field,
      b.natureOfPractice,
      b.questionType || 'N/A',
      b.examStandard || 'N/A',
      b.date,
      b.time,
      b.paid ? 'YES' : 'NO'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `meditin_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter(b => 
    b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-brandOrange" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <div className="max-w-[1700px] mx-auto space-y-8">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center shadow-lg">
              <TableIcon size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-navy tracking-tighter">Booking Master Intel</h1>
              <p className="text-slate-500 font-medium">Manage all mock session leads and customers.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandOrange transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-brandOrange transition-all font-bold text-navy w-full sm:w-80 shadow-sm"
              />
            </div>
            <button 
              onClick={downloadCSV}
              className="px-8 py-4 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-brandOrange transition-all shadow-xl shadow-navy/10"
            >
              <Download size={16} /> Export Intel
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entries</p>
                <p className="text-2xl font-black text-navy">{bookings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversions</p>
                <p className="text-2xl font-black text-green-600">{bookings.filter(b => b.paid).length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Free Tiers</p>
                <p className="text-2xl font-black text-blue-500">{bookings.filter(b => b.planId?.includes('free')).length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unpaid Leads</p>
                <p className="text-2xl font-black text-brandOrange">{bookings.filter(b => !b.paid).length}</p>
            </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Industry & Field</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Nature</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Exam Specs</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Schedule</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="font-black text-navy leading-none">{booking.fullName}</p>
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <Mail size={12} /> {booking.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-navy flex items-center gap-2">
                          <Building size={14} className="text-brandOrange" /> {booking.institution}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {booking.sector} • {booking.field}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {booking.natureOfPractice}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        {booking.questionType ? (
                          <>
                            <p className="text-xs font-black text-navy flex items-center gap-2 italic">
                              <HelpCircle size={14} className="text-brandOrange" /> {booking.questionType}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
                              {booking.examStandard}
                            </p>
                          </>
                        ) : (
                          <p className="text-[10px] text-slate-300 italic">Interview Based</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-navy flex items-center gap-2">
                          <Calendar size={14} /> {booking.date}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                          <Clock size={12} /> {booking.time}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {booking.paid ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Confirmed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-400">
                            <XCircle size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-1">
                            {booking.genderPreference && (
                                <span className="text-[8px] bg-navy/5 text-navy px-2 py-0.5 rounded font-black uppercase">Gender: {booking.genderPreference}</span>
                            )}
                            {booking.planId?.includes('free') && (
                                <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase border border-blue-100">FREE TIER</span>
                            )}
                            <span className="text-[8px] bg-navy/5 text-navy px-2 py-0.5 rounded font-black uppercase">XP: {booking.experienceYears}yr</span>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
