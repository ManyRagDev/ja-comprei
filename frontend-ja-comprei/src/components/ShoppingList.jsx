import { ArrowLeft, Check, Edit2, PlusCircle, UtensilsCrossed, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';
import { saveShoppingList } from '../services/recipeService';

export default function ShoppingList({ ingredients, onGenerate, onAddIngredient, onBack }) {
    const { user } = useRecipes();
    const [items, setItems] = useState(ingredients.map(i => ({ ...i, checked: true })));
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // Item being edited
    const [isSaving, setIsSaving] = useState(false);

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleEditItem = (updatedItem) => {
        setItems(items.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        ));
        setEditingItem(null);
    };

    const handleGenerateClick = () => {
        const selectedItems = items.filter(i => i.checked);
        onGenerate(selectedItems);
    };

    const handleSaveList = async () => {
        if (!user) {
            alert('Você precisa estar logado para salvar listas.');
            return;
        }

        const validItems = items.filter(i => i.name && i.name.trim() !== '');
        if (validItems.length === 0) {
            alert('A lista está vazia.');
            return;
        }

        const listTitle = prompt('Dê um nome para sua lista:', `Lista ${new Date().toLocaleDateString('pt-BR')}`);
        if (!listTitle) return;

        setIsSaving(true);
        try {
            await saveShoppingList(user.id, listTitle, validItems);
            alert('Lista salva com sucesso!');
        } catch (error) {
            alert('Erro ao salvar lista. Tente novamente.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col mx-auto shadow-2xl bg-[#f6f8f7] dark:bg-[#102217] transition-colors duration-200 font-sans text-[#102217] dark:text-white md:max-w-7xl md:px-0">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between bg-[#f6f8f7]/90 dark:bg-[#102217]/90 px-6 py-5 backdrop-blur-md md:rounded-t-3xl">
                <button onClick={onBack} className="group flex size-10 items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm transition-transform hover:scale-105 active:scale-95 text-[#102217] dark:text-white">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="flex-1 text-center text-xl font-bold tracking-tight">
                    Lista de Compras
                </h1>
                <button
                    onClick={handleSaveList}
                    disabled={isSaving || items.length === 0}
                    className="group flex size-10 items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm transition-transform hover:scale-105 active:scale-95 text-[#13ec6a] disabled:opacity-50"
                    title="Salvar Lista"
                >
                    <Save size={20} className={isSaving ? 'animate-pulse' : ''} />
                </button>
            </header>

            {/* Main Content List */}
            <main className="flex-1 px-4 pb-32 pt-2 md:px-8">
                <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {/* Helper Text */}
                    <p className="mb-2 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {items.length > 0 ? `${items.length} itens na lista` : 'Nenhum item na lista'}
                    </p>

                    {items.map((item) => (
                        <div key={item.id} className={`group relative flex items-center justify-between gap-4 rounded-[1.5rem] bg-white dark:bg-[#1A2C22] p-4 shadow-sm transition-all hover:shadow-md ${!item.checked ? 'opacity-60' : ''}`}>
                            <div className="flex items-center gap-4">
                                {/* Custom Checkbox */}
                                <div className="relative flex size-6 items-center justify-center cursor-pointer" onClick={() => toggleItem(item.id)}>
                                    <div className={`peer h-6 w-6 rounded-md border-2 transition-all ${item.checked ? 'border-[#13ec6a] bg-[#13ec6a]' : 'border-gray-200 dark:border-gray-600'}`}></div>
                                    {item.checked && <Check size={16} className="absolute text-white pointer-events-none" />}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-base font-semibold">{item.name}</span>
                                    <span className="text-xs font-medium text-gray-400">{item.quantity}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingItem(item)}
                                    className="flex size-9 items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#13ec6a] dark:hover:bg-white/10"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="flex size-9 items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Item Button */}
                    <button
                        onClick={() => setIsAddItemOpen(true)}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 p-4 text-gray-400 transition-colors hover:border-[#13ec6a] hover:text-[#13ec6a] dark:hover:border-[#13ec6a]"
                    >
                        <PlusCircle size={20} />
                        <span className="text-sm font-semibold">Adicionar item manualmente</span>
                    </button>
                </div>
                {/* Generate Button (Static at bottom) */}
                <div className="mt-8 flex justify-center w-full">
                    <button
                        onClick={handleGenerateClick}
                        disabled={items.filter(i => i.checked).length === 0}
                        className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#13ec6a] text-[#102217] shadow-lg shadow-[#13ec6a]/20 transition-transform active:scale-95 hover:shadow-xl hover:shadow-[#13ec6a]/30 md:w-auto md:px-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UtensilsCrossed size={24} className="fill-current" />
                        <span className="text-lg font-bold">Sugerir Receitas</span>
                    </button>
                </div>
            </main>

            {/* Add Item Drawer */}
            {isAddItemOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsAddItemOpen(false)}
                    ></div>

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] bg-white dark:bg-[#1A2C22] p-6 shadow-2xl transition-transform animate-in slide-in-from-bottom duration-300">
                        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>

                        <h2 className="mb-6 text-xl font-bold text-charcoal dark:text-white">Adicionar Novo Item</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const name = formData.get('name');
                                const quantity = formData.get('quantity');

                                if (name) {
                                    const newItem = {
                                        id: Date.now(),
                                        name,
                                        quantity: quantity || '1 un',
                                        checked: true
                                    };
                                    setItems(prev => [...prev, newItem]);
                                    if (onAddIngredient) onAddIngredient(newItem);
                                    setIsAddItemOpen(false);
                                }
                            }}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome do Item</label>
                                <input
                                    name="name"
                                    autoFocus
                                    placeholder="Ex: Leite Integral"
                                    className="w-full rounded-xl bg-gray-50 dark:bg-black/20 p-4 text-base font-semibold outline-none focus:ring-2 focus:ring-[#13ec6a]"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantidade</label>
                                <input
                                    name="quantity"
                                    placeholder="Ex: 1 litro"
                                    className="w-full rounded-xl bg-gray-50 dark:bg-black/20 p-4 text-base font-semibold outline-none focus:ring-2 focus:ring-[#13ec6a]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#13ec6a] shadow-lg shadow-[#13ec6a]/20 p-4 text-center font-bold text-[#102217] transition-transform active:scale-95"
                            >
                                <span className="text-sm font-bold text-[#102217]">Adicionar à Lista</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Item Drawer */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setEditingItem(null)}
                    ></div>

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] bg-white dark:bg-[#1A2C22] p-6 shadow-2xl transition-transform animate-in slide-in-from-bottom duration-300">
                        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>

                        <h2 className="mb-6 text-xl font-bold text-charcoal dark:text-white">Editar Item</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const name = formData.get('name');
                                const quantity = formData.get('quantity');

                                if (name) {
                                    handleEditItem({
                                        ...editingItem,
                                        name,
                                        quantity: quantity || '1 un'
                                    });
                                }
                            }}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome do Item</label>
                                <input
                                    name="name"
                                    autoFocus
                                    defaultValue={editingItem.name}
                                    placeholder="Ex: Leite Integral"
                                    className="w-full rounded-xl bg-gray-50 dark:bg-black/20 p-4 text-base font-semibold outline-none focus:ring-2 focus:ring-[#13ec6a]"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantidade</label>
                                <input
                                    name="quantity"
                                    defaultValue={editingItem.quantity}
                                    placeholder="Ex: 1 litro"
                                    className="w-full rounded-xl bg-gray-50 dark:bg-black/20 p-4 text-base font-semibold outline-none focus:ring-2 focus:ring-[#13ec6a]"
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gray-100 dark:bg-white/10 p-4 text-center font-bold text-gray-600 dark:text-gray-300 transition-transform active:scale-95"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#13ec6a] shadow-lg shadow-[#13ec6a]/20 p-4 text-center font-bold text-[#102217] transition-transform active:scale-95"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
}

