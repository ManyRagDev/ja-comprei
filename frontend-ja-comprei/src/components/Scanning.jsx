import { ScanLine, Receipt, Sparkles } from 'lucide-react';

export default function Scanning() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-cream dark:bg-[#171b19] text-charcoal dark:text-[#FDFBF7] font-sans transition-colors duration-300">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border border-sage/20 opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full border border-terracotta/20 opacity-20"></div>

            <div className="flex flex-col items-center justify-center z-10 p-8 max-w-sm w-full text-center space-y-10">

                {/* Animated Icon Container */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Pulse Rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-sage/30 animate-[pulse-ring_3s_ease-in-out_infinite]"></div>
                    <div className="absolute inset-4 rounded-full border border-terracotta/20 animate-[pulse-ring_3s_ease-in-out_infinite] delay-700"></div>

                    <div className="relative z-10">
                        {/* Floating Icons */}
                        <div className="absolute -top-8 right-0 animate-bounce delay-700">
                            <Sparkles className="text-sage" size={20} />
                        </div>

                        {/* Main Receipt Icon */}
                        <div className="relative">
                            <Receipt className="text-charcoal dark:text-[#FDFBF7]" size={80} strokeWidth={1.5} />

                            {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-[-10%] w-[120%] h-[2px] bg-terracotta/80 shadow-[0_0_15px_rgba(224,122,95,0.6)] animate-[scan_2s_linear_infinite]"></div>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-medium leading-snug animate-pulse">
                        Lendo sua nota fiscal...
                    </h2>
                    <p className="text-sm text-[#687d73] dark:text-[#97a09c] font-light tracking-wide">
                        Isso pode levar alguns segundos enquanto identificamos os itens e preços.
                    </p>
                </div>

                {/* Loading Dots */}
                <div className="w-16 flex justify-center space-x-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-sage animate-bounce delay-0"></div>
                    <div className="w-2 h-2 rounded-full bg-sage animate-bounce delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-sage animate-bounce delay-300"></div>
                </div>

            </div>

            {/* Footer Icon */}
            <div className="absolute bottom-8 text-charcoal/10 dark:text-white/5">
                <ScanLine size={32} />
            </div>
        </div>
    );
}
