export type Kind = 'receita' | 'fixa' | 'variavel' | 'investimento';
export type Transaction = { id:string; user_id:string; description:string; type:Kind; category:string; amount:number; transaction_date:string; reference_month:number; reference_year:number; paid:boolean; created_at:string };
export type Category = { id:string; user_id:string; type:Kind; name:string; position:number };
export type Profile = { id:string; full_name:string; username:string };
export const kinds:Kind[] = ['receita','fixa','variavel','investimento'];
export const labels:Record<Kind,string> = { receita:'Receitas',fixa:'Despesas Fixas',variavel:'Despesas Variáveis',investimento:'Investimentos' };
export const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
export const defaults:Record<Kind,string[]> = { receita:['Salário','Saldo Anterior','Extras','Outros'], fixa:['Moradia','Contas','Tecnologia','Telefonia','Marketing','Servidores','Educação','Assinaturas','Saúde','Veículo','Pessoal'], variavel:['Transporte','Serviços','Família','Outros'], investimento:['Renda Fixa','Renda Variável','Previdência','Cripto','Imóveis','Reserva de Emergência','Outros'] };
export const money = (n:number) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n || 0);
export const dateBR = (s:string) => s ? new Date(`${s}T12:00:00`).toLocaleDateString('pt-BR') : '—';
export const normalize = (s:string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function matches(t:Transaction,q:string) { const text=normalize([t.description,t.category,t.type,t.transaction_date,dateBR(t.transaction_date),t.reference_month,t.reference_year,months[t.reference_month-1],t.amount,money(t.amount)].join(' ')); return normalize(q).split(/\s+/).filter(Boolean).every(word=>text.includes(word)); }
export function totals(rows:Transaction[]) { const by = Object.fromEntries(kinds.map(k=>[k,rows.filter(t=>t.type===k).reduce((s,t)=>s+Number(t.amount),0)])) as Record<Kind,number>; return {...by, saldo:by.receita-by.fixa-by.variavel-by.investimento}; }
export const percent=(value:number,total:number)=>total ? (value/total)*100 : 0;
