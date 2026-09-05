export type PlanKey = 'daily' | 'weak' | 'flag';

export type View =
  | { name: 'home' }
  | { name: 'chapters' }
  | { name: 'chapter'; id: string }
  | { name: 'sheet'; ch?: string; q?: string }
  | { name: 'stats' }
  | { name: 'settings' }
  | { name: 'study'; plan: PlanKey }
  | { name: 'study-chapter'; ch: string; all: boolean }
  | { name: 'study-custom'; title: string; ids: string[] };
