import varint from 'varint'
export function getQueryPack(host: string, port: number): Buffer {
  const data = [0x00] // packet ID = 0 (varint)
  data.push(0x00) // Protocol version (varint)
  data.push(...varint.encode(host.length)) // host (varint len)
  data.push(...Array.from(host.split('')).map(c => c.charCodeAt(0))) // UTF-8 addr
  data.push(parseInt(port.toString(16).slice(0, 2), 16)) // host port (unsigned short)
  data.push(parseInt(port.toString(16).slice(2, 4), 16))
  data.push(0x01) // Next state: status (varint)
  data.unshift(...varint.encode(data.length)) // prepend length of packet ID + data
  data.push(...[0x01, 0x00])
  return Buffer.from(data)
}

export function ReadVarInt(buf: Buffer, offset = 0): VarInt {
  let value = 0
  let length = 0
  let b = 0
  do {
    b = buf[offset++]
    value |= (b & 0x7F) << (7 * length++)
  } while (b & 0x80)
  return { value, length }
}

export function concat(...args: Buffer[]) {
  let i
  let sumlen = 0
  for (i = 0; i < args.length; i++) {
    sumlen += args[i].length
  }
  const buf = Buffer.alloc(sumlen)
  let pos = 0
  for (i = 0; i < args.length; i++) {
    args[i].copy(buf, pos)
    pos += args[i].length
  }
  return buf
}
