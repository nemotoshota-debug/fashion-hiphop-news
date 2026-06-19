import Anthropic from "@anthropic-ai/sdk";

const cache = new Map<string, string>();

function isEnglish(text: string): boolean {
  if (!text) return false;
  const nonAscii = [...text].filter((c) => c.charCodeAt(0) > 127).length;
  return nonAscii / text.length < 0.1;
}

export async function translateBatch(texts: string[]): Promise<string[]> {
  if (!process.env.ANTHROPIC_API_KEY) return texts;

  const needsTranslation = texts.map((t, i) => ({ i, t, skip: !isEnglish(t) || cache.has(t) }));
  const toTranslate = needsTranslation.filter((x) => !x.skip).map((x) => x.t);

  if (toTranslate.length > 0) {
    try {
      const client = new Anthropic();
      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `以下のテキストを自然な日本語に翻訳してください。JSON配列のみ返してください（説明不要）。すでに日本語のものはそのまま返してください。\n\n${JSON.stringify(toTranslate)}`,
          },
        ],
      });
      const raw = msg.content[0];
      if (raw.type === "text") {
        const match = raw.text.match(/\[[\s\S]*\]/);
        if (match) {
          const translated: string[] = JSON.parse(match[0]);
          toTranslate.forEach((original, idx) => {
            if (translated[idx]) cache.set(original, translated[idx]);
          });
        }
      }
    } catch {
      // translation failed — return originals
    }
  }

  return texts.map((t) => cache.get(t) ?? t);
}
