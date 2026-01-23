export function toJoinNaming(str: string) {
  if (/^[^A-Z]+$/.test(str)) return str
  let res = ""
  for (let char of str) {
    res += /[A-Z]/.test(char) ? "-" + char.toLowerCase() : char
  }
  return res
}
