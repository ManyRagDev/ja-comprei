import { createContext, useContext, useState } from 'react';

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const value = {
        recipes,
        setRecipes,
        ingredients,
        setIngredients,
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
