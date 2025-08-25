export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
export function today() {
  return new Date().toISOString().slice(0, 10);
}
    