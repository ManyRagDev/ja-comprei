import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import RecipeDetail from '../components/RecipeDetail';

export default function RecipeDetailPage() {
    const { index } = useParams();
    const navigate = useNavigate();
    const { getRecipeByIndex } = useRecipes();

    const recipe = getRecipeByIndex(parseInt(index, 10));

    if (!recipe) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#221410]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Receita não encontrada</h1>
                    <button
                        onClick={() => navigate('/sugestoes')}
                        className="px-6 py-3 bg-[#ee522b] text-white rounded-full hover:bg-orange-600 transition-colors"
                    >
                        Voltar às Sugestões
                    </button>
                </div>
            </div>
        );
    }

    return (
        <RecipeDetail
            recipe={recipe}
            onBack={() => navigate('/sugestoes')}
        />
    );
}
