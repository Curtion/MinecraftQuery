import Net from 'net'
import { promises as dns } from 'dns'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import ipRegex from 'ip-regex'
import domainNameRegex from 'domain-name-regex'
import { ReadVarInt, concat, getQueryPack } from './utils/pack'

const app = new Koa()
const router = new Router()

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
router.get('/', async(ctx) => {
  let { host, port } = ctx.request.query as unknown as Query
  if (!host) {
    ctx.body = {
      error: 'host is required',
    }
    return
  }
  if (Array.isArray(host)) {
    ctx.body = {
      error: 'host must be a string',
    }
    return
  }
  if (ipRegex({ exact: true }).test(host) && !port) {
    ctx.body = {
      error: 'port is required',
    }
    return
  }
  if (!((ipRegex({ exact: true }).test(host) || domainNameRegex.test(host)) && ((Number(port) > 0 && Number(port) < 65536) || !port))) {
    ctx.body = {
      error: 'Invalid host or port',
    }
    return
  }
  if (!port) {
    try {
      const address = await dns.resolveSrv(`_minecraft._tcp.${host}`)
      host = address[0].name
      port = address[0].port.toString()
    } catch (e) {
      ctx.body = e
      return Promise.resolve()
    }
  }
  let CurrtData = Buffer.alloc(0)
  let totalLen: VarInt
  let typeLen: VarInt
  let stringLen: VarInt
  return new Promise<void>((resolve) => {
    const client = Net.createConnection({
      port: +port,
      host,
    })
    client.on('connect', () => {
      console.log('TCP connection established with the server.')
      const buff = getQueryPack(host, +port)
      client.write(buff)
    })
    client.on('data', (data) => {
      console.log('TCP data received from the server.')
      if (CurrtData.length === 0) {
        console.log('接收数据中...')
        totalLen = ReadVarInt(data)
        typeLen = ReadVarInt(data, totalLen.length)
        stringLen = ReadVarInt(data, totalLen.length + typeLen.length)
        CurrtData = concat(CurrtData, data)
      } else {
        if (CurrtData.length !== totalLen.value + totalLen.length) {
          CurrtData = concat(CurrtData, data)
          if (CurrtData.length === totalLen.value + totalLen.length) {
            console.log('接收接收完毕')
            try {
              ctx.body = JSON.parse(CurrtData.slice(totalLen.length + typeLen.length + stringLen.length).toString())
            } catch (e) {
              ctx.body = e
            }
            client.destroy()
            resolve()
          }
        } else {
          console.log('接收接收完毕')
          try {
            ctx.body = JSON.parse(CurrtData.slice(totalLen.length + typeLen.length + stringLen.length).toString())
          } catch (e) {
            ctx.body = e
          }
          client.destroy()
          resolve()
        }
      }
    })
    client.on('error', (err) => {
      ctx.body = err
      client.destroy()
      resolve()
    })
  })
})

app.listen(3000, () => {
  console.log('server is running at port 3000')
})
