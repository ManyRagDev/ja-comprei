-- Adiciona Colunas de Créditos e Tier na tabela profiles
-- (Assume que a tabela auth.users já gerencia os usuários, e a tabela public.profiles é espelhada ou os metadados estão em users)
-- NOTA: Como estamos usando Supabase Auth, o ideal é criar uma tabela public.profiles que referencie auth.users se ela ainda não existir.
-- Vamos assumir que não existe e criar, ou adicionar colunas se existir.

-- Tabela Profiles (Extensão do auth.users)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  subscription_tier text default 'free',
  credits_balance int default 3,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS
alter table public.profiles enable row level security;

-- Policies para Profiles
-- Leitura: Usuário vê seu próprio perfil
create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

-- Atualização: Usuário pode atualizar seu próprio perfil (para descontar créditos - RISCO ACEITO p/ MVP)
create policy "Users can update own profile" 
on public.profiles for update 
using ( auth.uid() = id );

-- Inserção: Trigger para criar profile automaticamente ao criar usuário no Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, credits_balance, subscription_tier)
  values (new.id, new.email, 3, 'free');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger (se não existir)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Tabela de Transações de Crédito
create table if not exists public.credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  amount int not null, -- negativo para gasto, positivo para recarga
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS
alter table public.credit_transactions enable row level security;

-- Policies para Transações
-- Leitura: Usuário vê suas transações
create policy "Users can view own transactions" 
on public.credit_transactions for select 
using ( auth.uid() = user_id );

-- Inserção: Usuário pode inserir suas transações (log de gasto)
create policy "Users can insert own transactions" 
on public.credit_transactions for insert 
with check ( auth.uid() = user_id );

-- Atualizações manuais para o Admin (Dev)
-- Roda isso manualmente ou via dashboard do Supabase para setar o admin
-- update public.profiles set subscription_tier = 'admin' where email = 'dev@jacomprei.com';
