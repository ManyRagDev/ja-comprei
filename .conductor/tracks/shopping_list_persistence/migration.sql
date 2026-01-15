-- Tabela de Listas de Compras
CREATE TABLE shopping_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT DEFAULT 'Lista de Compras',
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (Igual recipes)

-- 1. INSERT (Criar lista)
CREATE POLICY "Users can insert their own lists" 
ON shopping_lists 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 2. SELECT (Ler listas)
CREATE POLICY "Users can view their own lists" 
ON shopping_lists 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. DELETE (Apagar listas)
CREATE POLICY "Users can delete their own lists" 
ON shopping_lists 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
