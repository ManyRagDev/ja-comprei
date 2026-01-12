import React, { useRef, useState } from 'react';
import { Camera, ChefHat, ScanLine } from 'lucide-react';

export default function Home() {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      console.log("Arquivo pronto para envio:", file);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D405B] font-sans flex flex-col relative overflow-hidden">
      <header className="pt-12 pb-6 px-6 z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-[#E07A5F] rounded-lg text-white">
            <ChefHat size={24} />
          </div>
          <span className="text-sm font-bold tracking-wider text-[#E07A5F] uppercase">Já Comprei</span>
        </div>
        <h1 className="text-4xl font-serif font-bold leading-tight text-[#3D405B]">
          O que temos na <br />
          <span className="italic text-[#E07A5F]">cozinha hoje?</span>
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div
          onClick={handleCameraClick}
          className="w-full aspect-[3/4] max-w-sm bg-white rounded-[2rem] shadow-xl border-4 border-white overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#F4F1DE] flex flex-col items-center justify-center text-[#81B29A] border-2 border-dashed border-[#81B29A]/30 rounded-[1.8rem] m-0">
              <ScanLine size={48} className="mb-4 opacity-50" />
              <p className="font-medium text-center px-8 text-[#3D405B]/60">
                Toque para escanear <br />sua nota fiscal
              </p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </main>

      <footer className="pb-10 pt-6 px-6 flex justify-center z-10">
        <button
          onClick={handleCameraClick}
          className="bg-[#E07A5F] text-[#FDFBF7] h-20 w-20 rounded-full flex items-center justify-center shadow-lg shadow-[#E07A5F]/40 hover:bg-[#D06A4F] transition-all active:scale-95 border-4 border-[#FDFBF7]"
        >
          <Camera size={32} strokeWidth={2.5} />
        </button>
      </footer>

      <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-[#F2CC8F]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 bg-[#81B29A]/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
