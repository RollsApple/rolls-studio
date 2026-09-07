import { AIModel } from '../types';

export interface StreamChatParams {
  messages: Array<{ role: string; content: string }>;
  model?: AIModel;
  customApiKey?: string;
  currentFiles?: Record<string, string>;
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

export async function streamAIChat({
  messages,
  model,
  customApiKey,
  currentFiles,
  onChunk,
  signal,
}: StreamChatParams): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      model: model || 'gemini-3.1-flash-lite',
      customApiKey: customApiKey?.trim() || undefined,
      currentFiles,
    }),
    signal,
  });

  if (!response.ok) {
    const errText = await response.text();
    let parsedMessage = errText;
    try {
      const errJson = JSON.parse(errText);
      if (errJson.error) parsedMessage = errJson.error;
    } catch {
      // Keep errText
    }
    throw new Error(parsedMessage || `Erreur serveur (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Flux de réponse non disponible.');
  }

  const decoder = new TextDecoder('utf-8');
  let fullAccumulated = '';
  let buffer = '';

  try {
    while (true) {
      if (signal?.aborted) {
        throw new DOMException('Génération arrêtée par l\'utilisateur', 'AbortError');
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Keep incomplete trailing line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (!dataStr) continue;

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            fullAccumulated += parsed.text;
            onChunk(parsed.text);
          }
          if (parsed.done) {
            return fullAccumulated;
          }
        } catch (e: any) {
          if (e.message && e.message !== 'Unexpected end of JSON input') {
            throw e;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullAccumulated;
}
