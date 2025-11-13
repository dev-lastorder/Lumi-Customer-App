import { ar, de, en, fr, he, km, zh } from '@/utils';

export type TranslationKeys =
  | keyof typeof en
  | keyof typeof ar
  | keyof typeof de
  | keyof typeof fr
  | keyof typeof he
  | keyof typeof km
  | keyof typeof zh;
