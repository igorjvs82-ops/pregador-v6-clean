import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  text: z.string().min(40).max(20000),
  goal: z.string().max(500).optional(),
});

type ReviewInput = z.infer<typeof schema>;

function fallback(input: ReviewInput) {
  const text = input.text.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasBiblicalReference = /\b\d?\s?[A-ZÁÉÍÓÚÂÊÔÃÕÇa-záéíóúâêôãõç]+\s+\d+[:.]\d+/.test(text);
  const hasChrist = /cristo|jesus|evangelho|graça|cruz|ressurreição/i.test(text);
  const score = Math.max(55, Math.min(82, 65 + (hasBiblicalReference ? 8 : 0) + (hasChrist ? 9 : 0) + (wordCount > 350 ? 4 : 0)));

  return {
    score,
    summary: 'Revisão automática inicial. Use como triagem pastoral, não como parecer final.',
    strengths: [
      wordCount > 250 ? 'Texto com desenvolvimento suficiente para revisão.' : 'Texto curto, mas já permite identificar direção geral.',
      hasChrist ? 'Há menção explícita a Cristo, Jesus, evangelho, graça, cruz ou ressurreição.' : 'Há espaço para tornar a conexão com Cristo mais explícita.',
      hasBiblicalReference ? 'O texto contém referência bíblica identificável.' : 'A passagem bíblica principal precisa ficar mais clara.',
    ],
    observations: [
      {
        category: 'clareza',
        problem: 'A revisão completa depende de conferir se a ideia central nasce claramente do texto bíblico.',
        suggestion: 'Declare a proposição em uma frase simples: o que o texto ensina e como o ouvinte deve responder.',
        corrected_text: 'Este texto revela que Deus chama seu povo a responder pela fé, à luz da graça manifestada em Cristo.',
      },
      {
        category: 'aplicacao',
        problem: 'Aplicações genéricas podem enfraquecer a fidelidade textual.',
        suggestion: 'Faça cada aplicação responder diretamente a uma afirmação ou movimento do texto bíblico.',
        corrected_text: 'Por isso, a aplicação pastoral deve nascer da passagem e conduzir o ouvinte a arrependimento, fé e obediência concreta.',
      },
      {
        category: 'doutrina',
        problem: 'Confira se a mensagem evita moralismo, prosperidade, triunfalismo ou autoajuda religiosa.',
        suggestion: 'Inclua uma conexão evangélica explícita: o que Cristo realizou e como isso sustenta a resposta do crente.',
        corrected_text: 'A resposta cristã não nasce do mérito humano, mas da graça de Deus que nos alcança em Cristo.',
      },
    ],
    corrected_text: text,
    next_steps: [
      'Conferir contexto literário e histórico da passagem.',
      'Tornar a proposição mais objetiva.',
      'Amarrar cada aplicação a uma afirmação do texto.',
      'Revisar linguagem pastoral antes de usar publicamente.',
    ],
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

    const prompt = `Voce e o modulo Verbum Review, uma revisao biblica, pastoral e teologica para pregadores.

Regras:
- Nao entregue um sermao final pronto.
- Revise o texto como base revisavel.
- Avalie fidelidade textual, clareza, doutrina, aplicacao, tom pastoral e riscos teologicos.
- Aponte moralismo, legalismo, triunfalismo, prosperidade, autoajuda gospel, alegoria forcada e aplicacao sem base no texto.
- Use portugues do Brasil.
- Seja especifico, pastoral e objetivo.

Responda apenas JSON valido, sem markdown, nesta estrutura:
{
  "score": number,
  "summary": string,
  "strengths": string[],
  "observations": [
    {
      "category": "doutrina" | "atencao" | "melhoria" | "clareza" | "aplicacao",
      "problem": string,
      "suggestion": string,
      "corrected_text": string
    }
  ],
  "corrected_text": string,
  "next_steps": string[]
}

Objetivo informado: ${input.goal || 'Nao informado'}

Texto para revisar:
${input.text}`;

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
    return NextResponse.json({ error: 'invalid_review_request', message }, { status: 400 });
  }
}
