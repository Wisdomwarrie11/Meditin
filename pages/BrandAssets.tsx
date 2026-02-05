
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Download, Layout, Image as LucideImage, Sparkles, Loader2, Share2, Copy, FileText, Globe, Stethoscope, Briefcase } from 'lucide-react';

const BrandAssets: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('A professional medical poster for an elite academy in navy blue and orange, featuring a modern stethoscope and a global map background, cinematic lighting.');

  const generateAIBrandPoster = async () => {
    setIsGenerating(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt + " High resolution, professional medical branding style, navy and orange theme." }],
        },
        config: {
          imageConfig: { aspectRatio: "9:16" }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        // Find the image part, do not assume it is the first part.
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const assets = [
    { id: 'logo', name: 'MedPraktiz Core Logo', type: 'SVG Vector', src: 'public/Logo.svg', category: 'Logo' },
    { id: 'poster-intl', name: 'Global Career Poster', type: 'SVG Poster', src: 'public/PosterInternational.svg', category: 'Poster' },
    { id: 'poster-interview', name: 'Interview Excellence', type: 'SVG Poster', src: 'public/PosterInterview.svg', category: 'Poster' },
    { id: 'poster-exam', name: 'Board Prep Master', type: 'SVG Poster', src: 'public/PosterExam.svg', category: 'Poster' },
    { id: 'poster-scholar', name: 'Scholarship Gateway', type: 'SVG Poster', src: 'public/PosterScholarship.svg', category: 'Poster' },
    { id: 'social-banner', name: 'Social Media Header', type: 'Graphic', src: 'public/SocialBanner.svg', category: 'Graphic' },
    { id: 'badge', name: 'Verified Badge', type: 'Icon', src: 'public/BadgeSuccess.svg', category: 'Graphic' },
    { id: 'hero-gfx', name: 'Hero Scene Graphic', type: 'Illustration', src: 'public/HeroGraphic.svg', category: 'Graphic' },
    { id: 'pattern', name: 'Clinical Pattern', type: 'Background', src: 'public/PatternBackground.svg', category: 'Graphic' },
    { id: 'icon-set', name: 'Medical Icon Set', type: 'Icon Pack', src: 'public/IconSet.svg', category: 'Icon' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-black text-navy tracking-tighter mb-6">
            Brand <span className="text-brandOrange">Assets</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Download our official graphics, posters, and brand elements. Sophisticated resources for a global medical community.
          </p>
        </div>

        {/* AI Generator Section */}
        <section className="bg-navy rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-20 opacity-10"><Sparkles size={300} /></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-brandOrange/20 border border-brandOrange/30 text-brandOrange rounded-full text-xs font-black uppercase tracking-widest">
                AI Branding Engine
              </div>
              <h2 className="text-4xl font-black leading-tight">Generate Custom <br /> Brand Posters</h2>
              <p className="text-slate-400 font-medium">Use Gemini 2.5 to create unique, high-resolution posters for social media or print instantly.</p>
              
              <div className="space-y-4">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-brandOrange transition-all font-medium text-slate-300"
                  rows={3}
                />
                <button 
                  onClick={generateAIBrandPoster}
                  disabled={isGenerating}
                  className="w-full py-5 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brandOrange/20"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  {isGenerating ? 'Generating Vision...' : 'Generate with AI'}
                </button>
              </div>
            </div>

            <div className="aspect-[9/16] bg-white/5 rounded-[3rem] border-4 border-white/10 overflow-hidden flex items-center justify-center relative group">
              {generatedImage ? (
                <>
                  <img src={generatedImage} alt="AI Generated Poster" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-4 bg-brandOrange rounded-full hover:scale-110 transition-transform"><Download size={24} /></button>
                    <button className="p-4 bg-white text-navy rounded-full hover:scale-110 transition-transform"><Share2 size={24} /></button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 opacity-30">
                  <LucideImage size={80} className="mx-auto" />
                  <p className="font-black uppercase tracking-widest text-sm">Preview Area</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Static Assets Grid */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-navy">Static Assets Library</h3>
            <div className="flex gap-4">
              <span className="text-xs font-black bg-white px-4 py-2 rounded-full text-navy border border-slate-200">10 ITEMS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-[3rem] p-8 border border-slate-100 hover:shadow-2xl transition-all group overflow-hidden">
                <div className="aspect-square bg-slate-50 rounded-[2rem] mb-8 overflow-hidden flex items-center justify-center border border-slate-50 relative">
                  <object data={asset.src} type="image/svg+xml" className="w-full h-full p-4 pointer-events-none"></object>
                  <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-10 text-center space-y-4">
                    <p className="text-white font-black uppercase text-xs tracking-[0.2em]">{asset.category}</p>
                    <button className="w-full py-4 bg-brandOrange text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all">
                      <Download size={18} /> Download
                    </button>
                    <button className="w-full py-4 bg-white/10 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/20">
                      <Copy size={18} /> Copy Path
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-black text-navy mb-1">{asset.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{asset.type}</p>
                  </div>
                  <Layout className="text-slate-100 group-hover:text-brandOrange transition-colors" size={32} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandAssets;
