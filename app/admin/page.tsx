import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InternalSidebar } from '@/components/internal-sidebar';
import { isSuperAdminEmail } from '@/lib/admin';

const roleLabels: Record<string, string> = {
  user: 'Usuário',
  preacher: 'Pregador',
  leader: 'Líder',
  church_admin: 'Líder/Admin igreja',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

const statusLabels: Record<string, string> = {
  active: 'Ativo',
  beta: 'Beta',
  blocked: 'Bloqueado',
};

const planLabels: Record<string, string> = {
  free: 'Grátis',
  initial: 'Acesso inicial',
  essential: 'Essencial',
  preacher: 'Pregador',
  church: 'Igreja',
  pro: 'Pro',
  team: 'Igreja & Equipe',
};

const planPrices: Record<string, number> = {
  free: 0,
  initial: 0,
  essential: 39,
  preacher: 79,
  church: 149,
  pro: 29,
  team: 79,
};

type AdminSubscription = {
  plan_id: string;
  status: string;
  current_period_end: string | null;
};

type AdminUserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
  subscriptions?: AdminSubscription[] | null;
};

function getSubscription(row: AdminUserRow) {
  return row.subscriptions?.[0] ?? null;
}

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  if (!isSuperAdminEmail(user.email)) redirect('/dashboard');
  return { supabase, user };
}

async function updateUserAdmin(formData: FormData) {
  'use server';

  const { supabase } = await requireSuperAdmin();
  const userId = String(formData.get('user_id') ?? '');
  const role = String(formData.get('role') ?? 'user');
  const status = String(formData.get('status') ?? 'beta');
  const planId = String(formData.get('plan') ?? 'free');
  const subscriptionStatus = planId === 'free' || planId === 'initial' ? 'free' : 'active';

  if (!userId) return;

  await supabase
    .from('profiles')
    .update({ role, status })
    .eq('id', userId);

  await supabase
    .from('subscriptions')
    .upsert({ user_id: userId, plan_id: planId, status: subscriptionStatus }, { onConflict: 'user_id' });

  revalidatePath('/admin');
}

export default async function AdminPage() {
  const { supabase, user } = await requireSuperAdmin();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id,email,full_name,role,status,created_at,subscriptions(plan_id,status,current_period_end)')
    .order('created_at', { ascending: false });

  const rows = (profiles ?? []) as unknown as AdminUserRow[];
  const totalUsers = rows.length;
  const activeSubscribers = rows.filter((row) => getSubscription(row)?.status === 'active').length;
  const mrr = rows.reduce((sum, row) => {
    const subscription = getSubscription(row);
    return sum + (subscription?.status === 'active' ? planPrices[subscription.plan_id] ?? 0 : 0);
  }, 0);
  const blockedUsers = rows.filter((row) => row.status === 'blocked').length;

  return (
    <main className="app-shell">
      <InternalSidebar active="/admin" note="Área restrita para administração comercial e operacional." />

      <section className="grid">
        <div className="card" style={{ padding: 34, background: 'linear-gradient(135deg, #fff, #fbf8ff)', boxShadow: 'var(--shadow-premium)' }}>
          <span className="eyebrow">Super Admin</span>
          <h1 className="h2" style={{ marginTop: 16 }}>Administração do Verbum</h1>
          <p className="lead" style={{ fontSize: 17 }}>Gerencie usuários, papéis, status de acesso e planos comerciais. Acesso atual: {user.email}</p>
        </div>

        <div className="grid-3">
          <div className="stat"><strong>{totalUsers}</strong><span className="muted">usuários</span></div>
          <div className="stat"><strong>{activeSubscribers}</strong><span className="muted">assinantes ativos</span></div>
          <div className="stat"><strong>R$ {mrr}</strong><span className="muted">MRR estimado</span></div>
        </div>

        <div className="grid-3">
          <div className="stat"><strong>{blockedUsers}</strong><span className="muted">bloqueados</span></div>
          <div className="stat"><strong>{rows.filter((row) => row.status === 'beta').length}</strong><span className="muted">em beta</span></div>
          <div className="stat"><strong>{rows.filter((row) => row.role === 'admin' || row.role === 'super_admin').length}</strong><span className="muted">admins</span></div>
        </div>

        <section className="card">
          <div className="section-title">
            <div>
              <p className="kicker">Usuários</p>
              <h2 style={{ margin: 0 }}>Contas e planos</h2>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--muted)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                  <th style={{ padding: '14px 10px', borderBottom: '1px solid var(--border)' }}>Usuário</th>
                  <th style={{ padding: '14px 10px', borderBottom: '1px solid var(--border)' }}>Papel</th>
                  <th style={{ padding: '14px 10px', borderBottom: '1px solid var(--border)' }}>Status</th>
                  <th style={{ padding: '14px 10px', borderBottom: '1px solid var(--border)' }}>Plano</th>
                  <th style={{ padding: '14px 10px', borderBottom: '1px solid var(--border)' }}>Assinatura</th>
                  <th style={{ padding: '14px 10px', borderBottom: '1px solid var(--border)' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const subscription = getSubscription(row);
                  const currentPlan = subscription?.plan_id ?? 'free';
                  const email = row.email ?? 'sem e-mail';
                  return (
                    <tr key={row.id}>
                      <td style={{ padding: '16px 10px', borderBottom: '1px solid var(--border)' }}>
                        <strong>{row.full_name || email}</strong>
                        <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>{email}</p>
                      </td>
                      <td style={{ padding: '16px 10px', borderBottom: '1px solid var(--border)' }}><span className="badge">{roleLabels[row.role] ?? row.role}</span></td>
                      <td style={{ padding: '16px 10px', borderBottom: '1px solid var(--border)' }}><span className="badge">{statusLabels[row.status] ?? row.status}</span></td>
                      <td style={{ padding: '16px 10px', borderBottom: '1px solid var(--border)' }}><strong>{planLabels[currentPlan] ?? currentPlan}</strong></td>
                      <td style={{ padding: '16px 10px', borderBottom: '1px solid var(--border)' }}><span className="muted">{subscription?.status ?? 'free'}</span></td>
                      <td style={{ padding: '16px 10px', borderBottom: '1px solid var(--border)' }}>
                        <form action={updateUserAdmin} className="actions" style={{ alignItems: 'center' }}>
                          <input type="hidden" name="user_id" value={row.id} />
                          <select name="role" defaultValue={row.role} style={{ padding: 10, borderRadius: 12, border: '1px solid var(--border)' }}>
                            <option value="user">Usuário</option>
                            <option value="preacher">Pregador</option>
                            <option value="leader">Líder</option>
                            <option value="church_admin">Líder/Admin igreja</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                          <select name="status" defaultValue={row.status} style={{ padding: 10, borderRadius: 12, border: '1px solid var(--border)' }}>
                            <option value="active">Ativo</option>
                            <option value="beta">Beta</option>
                            <option value="blocked">Bloqueado</option>
                          </select>
                          <select name="plan" defaultValue={currentPlan} style={{ padding: 10, borderRadius: 12, border: '1px solid var(--border)' }}>
                            <option value="free">Grátis</option>
                            <option value="initial">Acesso inicial</option>
                            <option value="essential">Essencial</option>
                            <option value="preacher">Pregador</option>
                            <option value="church">Igreja</option>
                          </select>
                          <button className="btn btn-secondary" type="submit">Salvar</button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
