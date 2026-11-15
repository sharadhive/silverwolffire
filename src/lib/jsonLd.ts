/** Safely serialize JSON-LD escaping '<' to prevent script breakout */
export function safeJsonLd(obj: object): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
