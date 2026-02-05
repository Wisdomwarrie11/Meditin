
import React, { useState } from 'react';
import { Download, Maximize2, X, Share2, Filter } from 'lucide-react';

interface Flyer {
  id: string;
  title: string;
  category: 'Poster' | 'Graphic' | 'Icon' | 'Logo';
  src: string;
  description: string;
}

const FLYERS: Flyer[] = [
  { id: 'poster-intl', title: 'Global Career Gateway', category: 'Poster', src: 'public/PosterInternational.svg', description: 'Promoting international recruitment opportunities for medical graduates.' },
  { id: 'poster-interview', title: 'Interview Mastery', category: 'Poster', src: 'public/PosterInterview.svg', description: 'Marketing our expert-led mock interview simulation services.' },
  { id: 'poster-exam', title: 'Board Exam Excellence', category: 'Poster', src: 'public/PosterExam.svg', description: 'Focused on high-fidelity exam simulation and prep materials.' },
  { id: 'poster-scholar', title: 'Scholarship Launchpad', category: 'Poster', src: 'public/PosterScholarship.svg', description: 'Targeting students seeking international scholarship opportunities.' },
  { id: 'social-banner', title: 'Meditin Social Banner', category: 'Graphic', src: 'public/SocialBanner.svg', description: 'Official high-resolution banner for professional social platforms.' },
  { id: 'badge', title: 'Verified Excellence Badge', category: 'Graphic', src: 'public/BadgeSuccess.svg', description: 'Brand certification mark used for verified alumni and successful prep.' },
  { id: 'hero-gfx', title: 'Brand Hero Illustration', category: 'Graphic', src: 'public/HeroGraphic.svg', description: 'The main thematic illustration used across the Meditin ecosystem.' },
  { id: 'logo', title: 'Core Brand Identity', category: 'Logo', src: 'public/Logo.svg', description: 'The primary Meditin logo representing clinical precision and growth.' },
  { id: 'icon-set', title: 'Professional Icon Set', category: 'Icon', src: 'public/IconSet.svg', description: 'Custom-designed iconography for medical field categorization.' },
  { id: 'pattern', title: 'Clinical Pattern', category: 'Graphic', src: 'public/PatternBackground.svg', description: 'Geometric clinical pattern used for document and UI backgrounds.' },
];

const Gallery: React.FC = () => {
  const [selectedFlyer, setSelectedFlyer] = useState<Flyer | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredFlyers = activeFilter === 'All' 
    ? FLYERS 
    : FLYERS.filter(f => f.category === activeFilter);

  const categories = ['All', 'Poster', 'Graphic', 'Icon', 'Logo'];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center space-y-6">
        <h2 className="text-brandOrange font-black uppercase tracking-[0.3em] text-sm">Design Showcase</h2>
        <h1 className="text-5xl lg:text-7xl font-black text-navy tracking-tighter">
          Branding & <span className="text-brandOrange">Flyers</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto">
          Explore our visual identity through this curated gallery of posters, icons, and official graphics designed for the modern medical professional.
        </p>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-400 mr-2">
            <Filter size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all border-2 
                ${activeFilter === cat 
                  ? 'bg-navy border-navy text-white shadow-xl scale-105' 
                  : 'bg-transparent border-slate-100 text-slate-400 hover:border-brandOrange hover:text-brandOrange'}`}
            >
              {cat}s
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredFlyers.map((flyer) => (
          <div 
            key={flyer.id}
            className="group cursor-pointer space-y-6"
            onClick={() => setSelectedFlyer(flyer)}
          >
            <div className="relative aspect-[3/4] bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-500 z-10 flex items-center justify-center">
                <div className="w-16 h-16 bg-white text-navy rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                  <Maximize2 size={24} />
                </div>
              </div>
              <object 
                data={flyer.src} 
                type="image/svg+xml" 
                className="w-full h-full object-cover pointer-events-none p-4"
              />
              <div className="absolute top-8 left-8 z-20">
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-navy shadow-sm">
                  {flyer.category}
                </span>
              </div>
            </div>
            <div className="px-4">
              <h3 className="text-xl font-black text-navy group-hover:text-brandOrange transition-colors">{flyer.title}</h3>
              <p className="text-sm text-slate-400 font-medium mt-1 line-clamp-1">{flyer.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Detail Modal */}
      {selectedFlyer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedFlyer(null)}
            className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors p-4"
          >
            <X size={40} />
          </button>

          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Image Preview */}
            <div className="lg:col-span-3 aspect-[3/4] lg:aspect-auto lg:h-[80vh] bg-white rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white/10">
              <object 
                data={selectedFlyer.src} 
                type="image/svg+xml" 
                className="w-full h-full p-10 pointer-events-none"
              />
            </div>

            {/* Content Details */}
            <div className="lg:col-span-2 space-y-10 text-white p-4">
              <div className="space-y-4">
                <span className="inline-block px-6 py-2 bg-brandOrange text-white rounded-full text-xs font-black uppercase tracking-widest">
                  {selectedFlyer.category}
                </span>
                <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none">
                  {selectedFlyer.title}
                </h2>
                <p className="text-xl text-white/60 font-medium leading-relaxed">
                  {selectedFlyer.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <a 
                  href={selectedFlyer.src}
                  download={selectedFlyer.title.replace(/\s+/g, '_')}
                  className="flex-1 px-10 py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest text-center flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-brandOrange/20"
                >
                  <Download size={24} /> Download File
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/' + selectedFlyer.src);
                    alert('Asset link copied to clipboard!');
                  }}
                  className="flex-1 px-10 py-6 bg-white/10 text-white border border-white/20 rounded-full font-black uppercase tracking-widest text-center flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
                >
                  <Share2 size={24} /> Share Asset
                </button>
              </div>

              <div className="pt-10 border-t border-white/10 flex items-center gap-6">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-navy bg-brandOrange flex items-center justify-center font-black text-[10px]">MT</div>)}
                 </div>
                 <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Part of Meditin Elite Identity v1.0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
