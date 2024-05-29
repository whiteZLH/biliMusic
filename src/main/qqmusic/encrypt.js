export const encryptFunc = (data) => {
  return getSign(data)
}

function getSign(message) {
  // 假设有一个函数可以计算MD5哈希
  const md5 = calculateMD5(message) // 你需要实现这个函数或使用现有的库

  let sign = 'zzb'
  const a1 = [21, 4, 9, 26, 16, 20, 27, 30]
  for (let i = 0; i < a1.length; i++) {
    // 注意：JavaScript的索引是从0开始的，所以这里不需要+1
    sign += md5[a1[i]] // 假设a1中的索引不会超过md5的长度
  }

  // 将十六进制字符串转换为Uint8Array
  const a2 = Uint8Array.from(Buffer.from('D42D5044C3A3A3CB9DDCFE5BCC4F6806', 'hex'))
  const b2 = Uint8Array.from(Buffer.from(md5, 'hex'))
  const Ls = []
  for (let i = 0; i < a2.length; i++) {
    Ls.push(a2[i] ^ b2[i]) // 位异或操作
  }

  const zd = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let t = 0
  let i = 0
  while (t < 5) {
    // 确保不会越界  clea
    sign += zd.charAt(Ls[i] >> 2) // 右移和取模操作
    sign += zd.charAt(((Ls[i] & 3) << 4) | (Ls[i + 1] >> 4)) // 位或和取模操作
    sign += zd.charAt(((Ls[i + 1] & 15) << 2) | (Ls[i + 2] >> 6))
    sign += zd.charAt(Ls[i + 2] & 63)
    i += 3
    t++
  }

  // 处理剩余的元素（如果有的话）
  if (i < Ls.length) {
    sign += zd.charAt(Ls[i] >> 2)
    sign += zd.charAt((Ls[i] & 3) << 4) // 注意这里可能只有一个剩余元素，所以没有Ls[i + 2]和Ls[i + 3]
  }

  // zq
  const a3 = [18, 11, 3, 2, 1, 7, 6, 25]
  for (let i = 0; i < a3.length && i < md5.length; i++) {
    sign += md5.charAt(a3[i] % md5.length) // 同样假设a3中的索引不会超过md5的长度
  }

  return sign.toLowerCase()
}

function calculateMD5(message) {
  const CryptoJS = require('crypto-js')
  const hash = CryptoJS.MD5(message)
  // 输出32位的十六进制字符串
  return hash.toString()
}
