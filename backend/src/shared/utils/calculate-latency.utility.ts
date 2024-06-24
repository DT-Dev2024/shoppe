export function calculateLatency(start: Date, end: Date): number {
  return end.valueOf() - start.valueOf();
}
