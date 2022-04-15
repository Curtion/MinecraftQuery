import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
const router = new Router()

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

router.get('/', async(ctx) => {
  ctx.body = ctx.request.query
})

app.listen(3000, () => {
  console.log('server is running at port 3000')
})
