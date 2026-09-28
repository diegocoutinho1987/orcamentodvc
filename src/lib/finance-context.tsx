import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { defaults, kinds, type Category, type Profile, type Transaction } from './finance';

type Context = { user:User; profile:Profile|null; categories:Category[]; transactions:Transaction[]; loading:boolean; error:string; refresh:()=>Promise<void> };
const FinanceContext=createContext<Context|null>(null);
export const useFinance=()=>{const value=useContext(FinanceContext); if(!value) throw new Error('FinanceProvider missing'); return value};
export function FinanceProvider({user,children}:{user:User;children:ReactNode}) {
 const [profile,setProfile]=useState<Profile|null>(null),[categories,setCategories]=useState<Category[]>([]),[transactions,setTransactions]=useState<Transaction[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const refresh=useCallback(async()=>{setLoading(true);setError(''); const [p,c,t]=await Promise.all([supabase.from('profiles').select('*').eq('id',user.id).maybeSingle(),supabase.from('categories').select('*').eq('user_id',user.id).order('position'),supabase.from('transactions').select('*').eq('user_id',user.id).order('transaction_date',{ascending:false})]); if(p.error||c.error||t.error) setError(p.error?.message||c.error?.message||t.error?.message||'Erro ao carregar dados'); else {setProfile(p.data as Profile|null);setCategories((c.data||[]) as Category[]);setTransactions((t.data||[]) as Transaction[])} setLoading(false)},[user.id]);
 useEffect(()=>{void (async()=>{const existing=await supabase.from('profiles').select('id').eq('id',user.id).maybeSingle();if(!existing.data&&!existing.error){const full_name=String(user.user_metadata?.['full_name']||user.user_metadata?.['name']||user.email?.split('@')[0]||'Usuário');const username=String(user.user_metadata?.['username']||user.id);await supabase.from('profiles').insert({id:user.id,full_name,username})}await refresh()})()},[refresh,user.id]);
 // First-time accounts receive their own private starter categories.
 useEffect(()=>{if(loading||error||categories.length||!profile) return; const key=`budget-categories-${user.id}`; if(sessionStorage.getItem(key))return; sessionStorage.setItem(key,'1'); void supabase.from('categories').insert(kinds.flatMap(type=>defaults[type].map((name,position)=>({user_id:user.id,type,name,position})))).then(({error:e})=>{if(e) {setError(e.message);sessionStorage.removeItem(key)} else void refresh()})},[loading,error,categories.length,profile,user.id,refresh]);
 return <FinanceContext.Provider value={{user,profile,categories,transactions,loading,error,refresh}}>{children}</FinanceContext.Provider>
}
