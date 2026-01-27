/**
 * 将字符串转换为kebab-case格式（短横线分隔）
 *
 * @param str - 需要转换的字符串，支持驼峰命名、下划线命名等格式
 * @returns 转换后的kebab-case格式字符串
 */
export function toKebabCase(str: string) {
  // 将所有下划线替换为短横线
  str = str.replaceAll(/_+/g, "-")
  // 如果字符串中没有大写字母，直接返回原字符串
  if (/^[^A-Z]+$/.test(str)) return str
  let res = ""
  // 遍历字符串中的每个字符，将大写字母转换为小写并在前面添加短横线
  for (let char of str) {
    res += /[A-Z]/.test(char) ? "-" + char.toLowerCase() : char
  }
  return res
}
