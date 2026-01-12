export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
    async sugerirReceitas(ingredients: string[]) {
        try {
            const response = await fetch(`${API_URL}/sugerir-receitas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredientes: ingredients.map(item => ({ item, quantidade: '' })) // Adapting to backend schema which expects object with quantity
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar receitas:", error);
            throw error;
        }
    },

    async parseNota(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/analisar-nota`, {
                method: 'POST',
                body: formData, // No 'Content-Type' header needed; fetch sets multipart/form-data boundary automatically
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro na API: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erro no OCR:", error);
            throw error;
        }
    }
};
