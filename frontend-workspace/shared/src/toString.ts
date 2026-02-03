export function toString(data: any): string {
  if (typeof data === "object" && data) data = data.toString()
  else data = String(data)
  return data
}
