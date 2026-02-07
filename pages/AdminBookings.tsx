
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
  Table as TableIcon
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
    const headers = ['FullName', 'Email', 'Institution', 'Sector', 'Field', 'Nature', 'Date', 'Time', 'Paid'];
    const rows = filteredBookings.map(b => [
      b.fullName,
      b.email,
      b.institution,
      b.sector,
      b.field,
      b.natureOfPractice,
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
      <div className="max-w-[1600px] mx-auto space-y-8">
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
                placeholder="Search name, email, sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-brandOrange transition-all font-bold text-navy w-full sm:w-80 shadow-sm"
              />
            </div>
            <button 
              onClick={downloadCSV}
              className="px-8 py-4 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-brandOrange transition-all shadow-xl shadow-navy/10"
            >
              <Download size={16} /> Export to CSV
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                <p className="text-2xl font-black text-navy">{bookings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue Events</p>
                <p className="text-2xl font-black text-green-600">{bookings.filter(b => b.paid).length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
                <p className="text-2xl font-black text-navy">{bookings.length ? Math.round((bookings.filter(b => b.paid).length / bookings.length) * 100) : 0}%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Sync</p>
                <p className="text-2xl font-black text-brandOrange">{bookings.filter(b => !b.paid).length}</p>
            </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Client Details</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Professional Context</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Practice Nature</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Schedule</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Financials</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Admin Tags</th>
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
                            <span className="text-[10px] font-black uppercase tracking-widest">Paid</span>
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
                                <span className="text-[8px] bg-navy/5 text-navy px-2 py-0.5 rounded font-black uppercase">Pref: {booking.genderPreference}</span>
                            )}
                            <span className="text-[8px] bg-navy/5 text-navy px-2 py-0.5 rounded font-black uppercase">XP: {booking.experienceYears}yr</span>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                <Search size={32} />
              </div>
              <p className="font-bold text-slate-400 italic">No bookings match your current filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
