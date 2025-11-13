export function cn(...classes: (string | undefined | null | false)[]): string {
  const style = classes.filter(Boolean).join(' ');
  
  return style;
}
