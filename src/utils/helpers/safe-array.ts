export function safeArray<T>(data: T[] | null | undefined): T[] {
  return Array.isArray(data) ? data : [];
}
