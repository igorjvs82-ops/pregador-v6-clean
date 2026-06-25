import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  biblical_text: z.string().min(2).max(120),
  theme: z.string().min(2).max(160),
  audience: z.string().min(2).max(160),
  sermon_type: z.string().default('expositiva'),
  duration_minutes: z.number().min(5).max(90).default(30),
  occasion: z.string().max(160).optional(),
  tone: z.string().max(160).optional(),
});

function fallback(input: z.infer<typeof schema>) {
  return {
    outline: {
      title: input.theme,
      central_theme: `Mensagem em ${input.biblical_text}`,
      spiritual_objective: 'Conduzir o publico a compreender o texto, contemplar Cristo e responder com fe e obediencia.',
      main_thesis: 'A mensagem deve nascer do texto biblico e apontar para a graca de Deus em Cristo.',
      introduction: 'Introduza a dor real do publico e conecte-a ao texto biblico sem manipulacao emocional.',
      biblical_context: 'Explique o contexto literario, historico e canonico antes de aplicar o texto.',
      outline: [
        { point: 'O que o texto revela sobre Deus', explanation: 'Observe o ensino principal do texto.', christ_connection: 'Mostre como essa verdade encontra seu centro em Cristo.', application: 'Leve o ouvinte a fe, arrependimento e confianca no evangelho.' },
        { point: 'O que o texto revela sobre o coracao humano', explanation: 'Identifique pecado, medo, idolatria, culpa ou falsa seguranca.', christ_connection: 'Mostre como Cristo responde a necessidade humana mais profunda.', application: 'Aplique com clareza pastoral, evitando culpa sem evangelho.' },
        { point: 'Como responder ao evangelho', explanation: 'Chame o publico a uma resposta biblica.', christ_connection: 'A resposta crista nasce da graca, nao do desempenho.', application: 'Defina uma pratica concreta para a semana.' }
      ],
      conclusion: 'Retome a tese, aponte para Cristo e chame a resposta fiel.',
      final_prayer: 'Senhor, aplica tua Palavra ao nosso coracao e conduz-nos a Cristo. Amem.',
      preacher_note: 'Base revisavel. Confira exegese, contexto, doutrina, exemplos e aplicacoes antes de pregar.'
    },
    theological_review: {
      score: 75,
      summary: 'Base inicial segura para revisao do pregador, mas ainda dependente de conferencia exegetica e pastoral.',
      strengths: ['Estrutura biblica basica', 'Enfase cristocentrica', 'Aplicacao pastoral'],
      risks: ['Precisa aprofundar contexto especifico do texto', 'Evitar generalizacoes', 'Conferir se a aplicacao nasce da passagem'],
      necessary_adjustments: ['Conferir exegese do texto', 'Adaptar exemplos ao publico real', 'Revisar linguagem e tom antes do pulpito'],
      approved_for_preacher_review: true
    }
  };
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = schema.parse(json);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(fallback(input));
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Voce e o motor de preparacao biblica do Verbum.

Identidade do produto:
- Verbum e uma plataforma de preparacao biblica assistida para pregadores fieis ao texto.
- Nao gere sermao pronto como autoridade final.
- Entregue uma base revisavel para estudo, oracao, discernimento, edicao e aprovacao pastoral.

Metodo obrigatorio:
1. Priorize fidelidade textual, contexto literario, contexto historico, genero e fluxo argumentativo.
2. A aplicacao deve nascer do texto, nao ser colocada sobre o texto.
3. Aponte para Cristo sem alegoria forcada.
4. Evite moralismo, legalismo, triunfalismo, prosperidade, autoajuda gospel e promessas sem base textual.
5. Use portugues do Brasil, tom pastoral, claro e reverente.
6. Seja util para pregacao real, mas mantenha alertas de revisao.

Responda apenas JSON valido, sem markdown, com esta estrutura:
{
  "outline": {
    "title": string,
    "central_theme": string,
    "spiritual_objective": string,
    "main_thesis": string,
    "introduction": string,
    "biblical_context": string,
    "outline": [
      { "point": string, "explanation": string, "christ_connection": string, "application": string }
    ],
    "conclusion": string,
    "final_prayer": string,
    "preacher_note": string
  },
  "theological_review": {
    "score": number,
    "summary": string,
    "strengths": string[],
    "risks": string[],
    "necessary_adjustments": string[],
    "approved_for_preacher_review": boolean
  }
}

Entrada: ${JSON.stringify(input)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return NextResponse.json(fallback(input));

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    return NextResponse.json({ error: 'invalid_generation_request', message }, { status: 400 });
  }
}
