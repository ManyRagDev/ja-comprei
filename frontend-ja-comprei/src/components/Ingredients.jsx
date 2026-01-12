import { useState } from 'react';
import { ArrowLeft, Edit2, PlusCircle, Check, Trash2, Utensils } from 'lucide-react';

export default function Ingredients({ ingredients: initialIngredients, onBack, onGenerate }) {
    const [ingredients, setIngredients] = useState(initialIngredients);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');

    const toggleIngredient = (id) => {
        setIngredients(ingredients.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const removeIngredient = (id) => {
        setIngredients(ingredients.filter(item => item.id !== id));
    };

    const addIngredient = () => {
        if (newItemName.trim()) {
            setIngredients([
                ...ingredients,
                {
                    id: Date.now(),
                    name: newItemName.trim(),
                    quantity: newItemQuantity.trim() || '1 un',
                    checked: true,
                }
            ]);
            setNewItemName('');
            setNewItemQuantity('');
            setShowAddModal(false);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-screen bg-cream text-charcoal font-sans transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between bg-cream/90 px-6 py-5 backdrop-blur-md">
                <button
                    onClick={onBack}
                    className="group flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                    <ArrowLeft size={20} className="text-charcoal" />
                </button>
                <h1 className="flex-1 text-center text-xl font-bold tracking-tight text-charcoal">
                    Lista de Compras
                </h1>
                <div className="size-10"></div> {/* Spacer */}
            </header>

            {/* Main Content List */}
            <main className="flex-1 px-4 pb-32 pt-2">
                <div className="flex flex-col gap-3">
                    {/* Helper Text */}
                    <p className="mb-2 px-2 text-sm font-medium text-gray-500">
                        Ingredientes detectados
                    </p>

                    {/* Ingredient Items */}
                    {ingredients.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative flex items-center justify-between gap-4 rounded-[1.5rem] bg-white p-4 shadow-sm transition-all hover:shadow-md ${!item.checked ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="relative flex size-6 items-center justify-center cursor-pointer"
                                    onClick={() => toggleIngredient(item.id)}
                                >
                                    <div className={`h-6 w-6 rounded-md border-2 transition-all flex items-center justify-center ${item.checked
                                            ? 'border-sage bg-sage'
                                            : 'border-gray-200 group-hover:border-sage'
                                        }`}>
                                        {item.checked && <Check size={14} className="text-white" />}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <span className={`text-base font-semibold text-charcoal ${!item.checked ? 'line-through text-gray-400' : ''}`}>
                                        {item.name}
                                    </span>
                                    <span className="text-xs font-medium text-gray-400">{item.quantity}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => removeIngredient(item.id)}
                                className="flex size-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                    {/* Add New Item Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-gray-200 p-4 text-gray-400 transition-colors hover:border-sage hover:text-sage"
                    >
                        <PlusCircle size={20} />
                        <span className="text-sm font-semibold">Adicionar item manualmente</span>
                    </button>
                </div>
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center p-6 bg-gradient-to-t from-cream via-cream to-transparent pointer-events-none max-w-md mx-auto">
                <button
                    onClick={() => onGenerate(ingredients.filter(i => i.checked))}
                    disabled={ingredients.filter(i => i.checked).length === 0}
                    className="pointer-events-auto flex h-14 w-full items-center justify-center gap-3 rounded-full bg-sage text-white shadow-lg shadow-sage/20 transition-transform active:scale-95 hover:shadow-xl hover:shadow-sage/30 hover:bg-[#72a38b] disabled:opacity-50 disabled:pointer-events-none"
                >
                    <Utensils size={24} className="fill-current" />
                    <span className="text-lg font-bold">Sugerir Receitas</span>
                </button>
            </div>

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
                    <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4 animate-slide-up">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-serif text-xl font-bold text-charcoal">Adicionar Item</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <ArrowLeft size={20} className="rotate-[-90deg]" />
                            </button>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Nome do item</label>
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Ex: Tomate"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Quantidade</label>
                            <input
                                type="text"
                                value={newItemQuantity}
                                onChange={(e) => setNewItemQuantity(e.target.value)}
                                placeholder="Ex: 500g"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none"
                            />
                        </div>

                        <button
                            onClick={addIngredient}
                            disabled={!newItemName.trim()}
                            className="w-full py-4 bg-sage text-white rounded-xl font-bold hover:bg-sage/90 transition-colors disabled:opacity-50"
                        >
                            Adicionar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
