import { ArrowLeft, Clock, BarChart2, Users, Play, Heart, Check, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function RecipeDetail({ recipe, onBack }) {
    if (!recipe) return null;

    // Normalize data fields (AI might return Portuguese keys)
    const title = recipe.title || recipe.nome_do_prato;
    const time = recipe.time || recipe.tempo_preparo;

    // Ensure ingredients and steps are arrays
    let ingredients = recipe.ingredients || recipe.ingredientes_usados || [];
    if (!Array.isArray(ingredients)) ingredients = [];

    let steps = recipe.steps || recipe.modo_de_preparo || [];

    // Handle string format (e.g. "1. Mix content.\n2. Cook it.")
    if (typeof steps === 'string') {
        // First try splitting by newline if it looks formatted
        if (steps.includes('\n')) {
            steps = steps.split(/\n/).filter(step => step.trim().length > 0);
        } else {
            // If no newlines, try splitting by numbered lists "1.", "2."
            // Regex looks for "number dot space" and splits, keeping the delimiters slightly complex to reconstruct or just plain split
            // Simpler approach: Split by regex and filter
            const splitByNumbers = steps.split(/\d+\.\s+/).filter(Boolean);
            if (splitByNumbers.length > 1) {
                steps = splitByNumbers;
            } else {
                // Fallback: just array of one string
                steps = [steps];
            }
        }
    }

    if (!Array.isArray(steps)) steps = [];

    const image = recipe.image_url || recipe.image || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80';

    // Tags logic
    const tags = recipe.tags || ['Popular', 'Spicy'];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden group/design-root bg-[#FDFBF7] dark:bg-[#221410] text-[#221410] dark:text-[#FDFBF7] font-serif transition-colors duration-200 md:flex-row md:h-screen md:overflow-hidden">

            {/* Hero Section */}
            <div className="relative w-full h-[40vh] min-h-[320px] md:h-full md:w-1/2 md:shrink-0">
                {/* Nav Overlay */}
                <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-4 pt-12 bg-gradient-to-b from-black/40 to-transparent">
                    <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <button className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors group">
                        <Heart size={24} className="group-hover:text-[#ee522b] group-active:scale-90 transition-transform" />
                    </button>
                </div>

                {/* Hero Image */}
                <div className="absolute inset-0 w-full h-full bg-gray-200">
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${image}')` }}
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FDFBF7] dark:from-[#221410] to-transparent md:hidden"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative px-6 -mt-8 z-10 flex flex-col gap-8 pb-32 md:w-1/2 md:mt-0 md:h-full md:overflow-y-auto md:px-12 md:pt-12 md:pb-12 bg-[#FDFBF7] dark:bg-[#221410]">
                {/* Title Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        {tags.map((tag, idx) => (
                            <span key={idx} className={`px-3 py-1 text-sm font-bold rounded-full border ${idx === 0 ? 'bg-[#E07A5F]/10 text-[#E07A5F] border-[#E07A5F]/20' : 'bg-[#81B29A]/10 text-[#81B29A] border-[#81B29A]/20'} font-sans`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-[36px] leading-[1.1] font-bold">
                        {title}
                    </h1>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white/5 p-4 shadow-sm border border-stone-100 dark:border-white/5">
                        <Clock size={28} className="text-[#81B29A]" />
                        <div className="text-center">
                            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans uppercase tracking-wider">Tempo</p>
                            <p className="text-base font-bold">{time}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white/5 p-4 shadow-sm border border-stone-100 dark:border-white/5">
                        <BarChart2 size={28} className="text-[#81B29A]" />
                        <div className="text-center">
                            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans uppercase tracking-wider">Dificuldade</p>
                            <p className="text-base font-bold">{recipe.difficulty || 'Média'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white/5 p-4 shadow-sm border border-stone-100 dark:border-white/5">
                        <Users size={28} className="text-[#81B29A]" />
                        <div className="text-center">
                            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans uppercase tracking-wider">Porções</p>
                            <p className="text-base font-bold">4</p>
                        </div>
                    </div>
                </div>

                {/* Ingredients Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[22px] font-bold">Ingredientes</h2>
                        <span className="text-sm text-stone-500 dark:text-stone-400 font-sans">{ingredients.length} itens</span>
                    </div>
                    <div className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-white/5 p-5 shadow-sm border border-stone-100 dark:border-white/5">
                        {ingredients.map((ing, idx) => (
                            <div key={idx}>
                                <label className="flex items-start gap-3 cursor-default group">
                                    <div className="relative flex items-center justify-center size-6 shrink-0 mt-0.5">
                                        <input className="peer appearance-none size-5 rounded-md border-2 border-[#81B29A]/50 checked:bg-[#81B29A] checked:border-[#81B29A] transition-all" type="checkbox" checked readOnly />
                                        <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                    </div>
                                    <span className="text-lg text-stone-800 dark:text-stone-200 font-serif">
                                        {typeof ing === 'string' ? ing : `${ing.quantidade || ''} ${ing.item || ''}`}
                                    </span>
                                </label>
                                {idx < ingredients.length - 1 && <div className="h-px w-full bg-stone-100 dark:bg-white/5 my-3"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preparation Section */}
                <div className="flex flex-col gap-5">
                    <h2 className="text-[22px] font-bold">Modo de Preparo</h2>
                    <div className="flex flex-col gap-6">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center size-8 rounded-full bg-[#E07A5F] text-white font-bold font-sans text-sm shadow-md">
                                        {idx + 1}
                                    </div>
                                    {idx < steps.length - 1 && <div className="w-0.5 h-full bg-stone-200 dark:bg-white/10 my-2 rounded-full"></div>}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-white/5">
                                        <p className="text-lg leading-relaxed text-stone-800 dark:text-stone-200">
                                            {step}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Floating Action Button - To be implemented in future feature */}
            {/*
            <div className="fixed bottom-6 right-6 z-30">
                <button className="flex items-center gap-2 bg-[#ee522b] hover:bg-orange-600 text-white pl-5 pr-6 py-4 rounded-full shadow-lg shadow-[#ee522b]/30 transition-all active:scale-95">
                    <Play size={24} className="fill-current" />
                    <span className="font-bold text-base tracking-wide font-sans">Começar</span>
                </button>
            </div>
            */}

        </div>
    );
}
