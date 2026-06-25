export type PlanKey = 'initial' | 'essential' | 'preacher' | 'church';

export type PlanDefinition = {
  key: PlanKey;
  slug: string;
  name: string;
  price: string;
  monthlyPreparationLimit: number | null;
  features: string[];
};

export const plans: Record<PlanKey, PlanDefinition> = {
  initial: {
    key: 'initial',
    slug: 'acesso-inicial',
    name: 'Acesso inicial',
    price: 'R$ 0',
    monthlyPreparationLimit: 3,
    features: ['Teste inicial do fluxo', 'Preparações limitadas', 'Histórico básico', 'Base revisável para estudo'],
  },
  essential: {
    key: 'essential',
    slug: 'essencial',
    name: 'Essencial',
    price: 'R$ 39/mês',
    monthlyPreparationLimit: 15,
    features: ['Preparações básicas', 'Radar limitado', 'Histórico de mensagens', 'Exportação simples'],
  },
  preacher: {
    key: 'preacher',
    slug: 'pregador',
    name: 'Pregador',
    price: 'R$ 79/mês',
    monthlyPreparationLimit: 60,
    features: ['Preparações ampliadas', 'Radar Teológico completo', 'Teleprompter pastoral', 'Slides e exportação textual', 'Biblioteca de mensagens'],
  },
  church: {
    key: 'church',
    slug: 'igreja',
    name: 'Igreja',
    price: 'R$ 149/mês',
    monthlyPreparationLimit: null,
    features: ['Múltiplos pregadores', 'Séries e calendário', 'Biblioteca da igreja', 'Materiais para ensino', 'Fluxo futuro de aprovação'],
  },
};

export function getPlanBySlug(slug?: string | null): PlanDefinition {
  return Object.values(plans).find((plan) => plan.slug === slug) ?? plans.preacher;
}

export function formatPreparationLimit(plan: PlanDefinition) {
  return plan.monthlyPreparationLimit === null ? 'Ilimitadas' : `${plan.monthlyPreparationLimit}/mês`;
}
