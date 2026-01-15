import { Routes, Route, useNavigate } from 'react-router-dom';
import { useRecipes } from './context/RecipeContext';
import LandingPage from './LandingPage';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Analyzing from './components/Analyzing';
import Scanning from './components/Scanning';
import ShoppingList from './components/ShoppingList';
import Suggestions from './components/Suggestions';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SavedRecipesPage from './pages/SavedRecipesPage';
import MyListsPage from './pages/MyListsPage';
import SavedListDetailsPage from './pages/SavedListDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SavedRecipeDetailPage from './pages/SavedRecipeDetailPage';
import RecipeTestPage from './pages/RecipeTestPage';
import { api } from './services/api';
import { checkCredits, deductCredit } from './services/recipeService';
import AppLayout from './components/AppLayout';

// Mock data as fallback for scanning
const mockIngredients = [
  { id: 1, name: 'Pão Francês', quantity: '4 unidades', checked: true },
  { id: 2, name: 'Mortadela', quantity: '200g', checked: true },
  { id: 3, name: 'Queijo Mussarela', quantity: '150g', checked: true },
  { id: 4, name: 'Tomate', quantity: '2 unidades', checked: true },
  { id: 5, name: 'Alface', quantity: '1 maço', checked: true },
];

export default function App() {
  const navigate = useNavigate();
  const { recipes, setRecipes, ingredients, setIngredients, user } = useRecipes();

  // Handle scan completion
  const handleScan = async (file) => {
    navigate('/scanning');

    try {
      if (file) {
        const result = await api.parseNota(file);

        // Backend returns: { ingredientes: [ {item, quantidade}, ... ] }
        if (result && result.ingredientes) {
          const formattedIngredients = result.ingredientes.map((ing, idx) => ({
            id: Date.now() + idx, // Unique ID
            name: ing.item,
            quantity: ing.quantidade || '1 uni',
            // Default check ONLY food items (safety filter)
            checked: !ing.categoria || ing.categoria === 'alimento',
            categoria: ing.categoria
          }));
          setIngredients(formattedIngredients);
        } else {
          console.warn("Nenhum ingrediente encontrado ou formato inválido");
        }
        navigate('/lista');
      } else {
        // Fallback for simulation (should not be reached with current UI)
        setIngredients(mockIngredients);
        navigate('/lista');
      }
    } catch (error) {
      console.error("Erro OCR:", error);
      alert("Houve um erro ao ler a nota. Tente novamente com uma imagem mais clara.");
      navigate('/scanner');
    }
  };

  // Handle recipe generation
  const handleGenerate = async (selectedIngredients) => {
    // 1. Check Credits
    if (user) {
      try {
        const { allowed, isAdmin, balance } = await checkCredits(user.id);
        if (!allowed) {
          alert(`Saldo insuficiente (${balance} créditos). Assine o Pro para continuar!`);
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar créditos:", error);
        // Optional: Block or allow on error. Let's allow for now but log.
      }
    }

    navigate('/analyzing');

    try {
      const ingredientNames = selectedIngredients.map(i => i.name);
      const result = await api.sugerirReceitas(ingredientNames);

      if (result && result.receitas) {
        const recipesWithImages = result.receitas;

        // Preload images
        await Promise.all(recipesWithImages.map(recipe => {
          return new Promise((resolve) => {
            if (!recipe.image_url) {
              resolve();
              return;
            }
            const img = new Image();
            img.src = recipe.image_url;
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));

        setRecipes(recipesWithImages);

        // 2. Deduct Credit (if user is logged in)
        if (user) {
          try {
            await deductCredit(user.id);
          } catch (error) {
            console.error("Erro ao descontar crédito:", error);
          }
        }

        navigate('/sugestoes');
      } else {
        console.error("Formato de resposta inválido", result);
        alert("Erro ao gerar receitas. Tente novamente.");
        navigate('/lista');
      }
    } catch (error) {
      console.error("Erro na API", error);
      alert("Falha ao conectar com o Chef. Verifique sua conexão.");
      navigate('/lista');
    }
  };

  // Handle recipe selection
  const handleSelectRecipe = (recipe, index) => {
    navigate(`/receita/${index}`);
  };

  // Handle manual ingredient addition
  const handleAddIngredient = (newItem) => {
    setIngredients(prev => [...prev, newItem]);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-[#102217] text-charcoal dark:text-cream font-sans transition-colors duration-200">
      <AppLayout>
        <Routes>
          <Route path="/" element={
            <LandingPage
              onStart={() => navigate('/scanner')}
              onLogin={() => navigate('/dashboard')}
            />
          } />

          <Route path="/dashboard" element={
            <Dashboard onNavigate={(screen) => navigate(`/${screen === 'scanner' ? 'scanner' : screen === 'shopping-list' ? 'lista' : screen}`)} />
          } />

          <Route path="/scanner" element={
            <Scanner
              onScan={handleScan}
              onBack={() => navigate('/dashboard')}
            />
          } />

          <Route path="/scanning" element={<Scanning />} />

          <Route path="/analyzing" element={<Analyzing />} />

          <Route path="/lista" element={
            <ShoppingList
              ingredients={ingredients}
              onGenerate={handleGenerate}
              onAddIngredient={handleAddIngredient}
              onBack={() => navigate('/scanner')}
            />
          } />

          <Route path="/sugestoes" element={
            <Suggestions
              recipes={recipes}
              onSelectRecipe={handleSelectRecipe}
              onBack={() => navigate('/lista')}
            />
          } />

          <Route path="/minhas-receitas" element={<SavedRecipesPage />} />

          <Route path="/minhas-listas" element={<MyListsPage />} />
          <Route path="/minhas-listas/:id" element={<SavedListDetailsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />

          {/* Receita Salva (URL Permanente por Slug) */}
          <Route path="/r/:slug" element={<SavedRecipeDetailPage />} />

          {/* Receita Temporária (Por Índice em Memória) */}
          <Route path="/receita/:index" element={<RecipeDetailPage />} />

          {/* Rota de Testes (Debug) */}
          <Route path="/debug/recipes" element={<RecipeTestPage />} />
        </Routes>
      </AppLayout>
    </div>
  );
}
