/**
 * 判断是否是正确的链接
 * @param url
 */
export function isUrl(url: string): boolean {
  //   return /^https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+)/.test(
  //     url
  //   );
  return url.includes("http://192.168.0.68:3000/group/");
}
