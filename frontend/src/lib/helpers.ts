export const makeId = (): string => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const minutesLabel = (n: number | string): string => `${Number(n) || 0} min`;
export const initials = (name = ''): string => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'HC';
export const splitLines = (str = ''): string[] => str.split('\n').map(s => s.trim()).filter(Boolean);
export const shorten = (str = '', n = 120): string => str.length > n ? `${str.slice(0, n - 1)}…` : str;
export const errorMessage = (error: unknown): string => error instanceof Error ? error.message : 'Something went wrong.';
