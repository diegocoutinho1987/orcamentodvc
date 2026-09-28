import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { FinanceProvider } from '@/lib/finance-context';
import { FinanceShell } from '@/components/finance-shell';
export const Route=createFileRoute('/_authenticated')({ssr:false,beforeLoad:async()=>{const {data,error}=await supabase.auth.getUser();if(error||!data.user)throw redirect({to:'/auth'});return {user:data.user}},component:Layout});
function Layout(){const {user}=Route.useRouteContext();return <FinanceProvider user={user}><FinanceShell><Outlet/></FinanceShell></FinanceProvider>}
