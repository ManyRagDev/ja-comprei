import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ScanLine, BookOpen, ShoppingCart, User } from 'lucide-react';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    // Mapping of routes to active state identification
    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path === '/scanner' && (location.pathname === '/scanner' || location.pathname === '/scanning' || location.pathname === '/analyzing')) return true;
        if (path === '/minhas-receitas' && (location.pathname === '/minhas-receitas' || location.pathname.includes('/receita/'))) return true;
        if (path === '/minhas-listas' && location.pathname === '/minhas-listas') return true;
        if (path === '/lista' && location.pathname === '/lista') return true;
        return false;
    };

    const navItems = [
        {
            id: 'home',
            label: 'Home',
            icon: Home,
            path: '/dashboard',
        },
        {
            id: 'profile',
            label: 'Perfil',
            icon: User,
            path: '/perfil',
        },
        {
            id: 'scan',
            label: 'Scan',
            icon: ScanLine,
            path: '/scanner',
            isMain: true
        },
        {
            id: 'lists',
            label: 'Listas',
            icon: ShoppingCart,
            path: '/minhas-listas',
        },
        {
            id: 'recipes',
            label: 'Receitas',
            icon: BookOpen,
            path: '/minhas-receitas',
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#171c19]/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 pb-safe pt-2 px-6">
            <div className="flex items-center justify-around max-w-md mx-auto mb-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;

                    if (item.isMain) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className="relative -top-5 groupe transition-transform active:scale-95"
                            >
                                <div className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${active
                                    ? 'bg-[#ee522b] text-white shadow-[#ee522b]/40'
                                    : 'bg-[#221410] dark:bg-[#81B29A] text-white shadow-black/20'
                                    }`}>
                                    <Icon size={24} />
                                </div>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-1 p-2 transition-colors ${active
                                ? 'text-[#81B29A] dark:text-[#81B29A]'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <Icon size={24} className={active ? 'fill-current' : ''} />
                            <span className="text-[10px] font-bold tracking-wide font-sans uppercase">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
