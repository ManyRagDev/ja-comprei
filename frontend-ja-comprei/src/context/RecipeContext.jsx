import { createContext, useContext, useState, useEffect } from 'react';
import { ensureDevSession } from '../services/recipeService';

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [user, setUser] = useState(null);

    // Auto-login (Dev Mode)
    useEffect(() => {
        ensureDevSession().then(u => {
            console.log('User set in context:', u?.email);
            setUser(u);
        });
    }, []);

    const value = {
        recipes,
        setRecipes,
        ingredients,
        setIngredients,
        user,
        // Helper to find a recipe by index (since AI doesn't return IDs)
        getRecipeByIndex: (index) => recipes[index] || null,
    };

    return (
        <RecipeContext.Provider value={value}>
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipes() {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error('useRecipes must be used within a RecipeProvider');
    }
    return context;
}
