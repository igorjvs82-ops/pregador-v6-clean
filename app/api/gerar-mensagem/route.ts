import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  biblical_text: z.string().min(2),
  theme: z.string().min(2),
  audience: z.string().min(2),
  sermon_type: z.string().default('expositiva'),
  duration_minutes: z.number().min(5).max(90).default(30),
  occasion: z.string().optional(),
  tone: z.string().optional(),
});

function fallback(input: z.infer<typeof schema>) {
  return {
    outline: {
      title: input.theme,
      central_theme: `Mensagem em ${input.biblical_text}`,
      spiritual_objective: 'Conduzir o público a compreender o texto, contemplar Cristo e responder com fé e obediência.',
      main_thesis: 'A mensagem deve nascer do texto bíblico e apontar para a graça de Deus em Cristo.',
      introduction: 'Introduza a dor real do público e conecte-a ao texto bíblico sem manipulação emocional.',
      biblical_context: 'Explique o contexto literário, histórico e canônico antes de aplicar o texto.',
      outline: [
        { point: 'O que o texto revela sobre Deus', explanation: 'Observe o ensino principal do texto.', christ_connection: 'Mostre como essa verdade encontra seu centro em Cristo.', application: 'Leve o ouvinte à fé, arrependimento e confiança no evangelho.' },
        { point: 'O que o texto revela sobre o coração humano', explanation: 'Identifique pecado, medo, idolatria, culpa ou falsa segurança.', christ_connection: 'Mostre como Cristo responde à necessidade humana mais profunda.', application: 'Aplique com clareza pastoral, evitando culpa sem evangelho.' },
        { point: 'Como responder ao evangelho', explanation: 'Chame o público a uma resposta bíblica.', christ_connection: 'A resposta cristã nasce da graça, não do desempenho.', application: 'Defina uma prática concreta para a semana.' }
      ],
      conclusion: 'Retome a tese, aponte para Cristo e chame à resposta fiel.',
      final_prayer: 'Senhor, aplica tua Palavra ao nosso coração e conduz-nos a Cristo. Amém.'
    },
    theological_review: {
      score: 75,
      summary: 'Rascunho inicial seguro para revisão do pregador.',
      strengths: ['Estrutura bíblica básica', 'Ênfase cristocêntrica', 'Aplicação pastoral'],
      risks: ['Precisa aprofundar contexto específico do texto', 'Evitar generalizações'],
      necessary_adjustments: ['Conferir exegese do texto', 'Adaptar exemplos ao público real'],
      approved_for_preacher_review: true
    }
  };
}

export async function POST(request: Request) {
  const json = await request.json();
  const input = schema.parse(json);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(fallback(input));
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Você é um assistente de preparação homilética cristã, bíblica, evangélica, pastoral e cristocêntrica. Não substitua o estudo, a oração ou a responsabilidade do pregador. Evite moralismo, legalismo, triunfalismo, prosperidade e autoajuda gospel. Gere JSON válido com outline e theological_review. Entrada: ${JSON.stringify(input)}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return NextResponse.json(fallback(input));

  return NextResponse.json(JSON.parse(content));
}
