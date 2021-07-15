import Koa from 'koa'
import Router from '@koa/router'
import mount from 'koa-mount'
import koaBody from 'koa-body'
import { customAlphabet } from 'nanoid'
import { Low, JSONFile } from 'lowdb'

import { Database } from './types'
import cors from '@koa/cors'
import serve from 'koa-static'

const CUSTOM_CHARACTERS = '가나다라마바사아자차카타파하고노도로모보소조초코토포호0123456789'
const nanoid = customAlphabet(CUSTOM_CHARACTERS, 5)

// initialize database

const adapter = new JSONFile<Database>('/Users/nalava12/Develop/dev/astenib/backend/db.json')
const db = new Low<Database>(adapter)

db.read().then(() => {
  if (db.data == null) {
    db.data = { posts: [] }
  }
})

// initialize koa framework

const app = new Koa()
const router = new Router()

router.get('/post/:id', async (ctx, next) => {
  const { id: queryId } = ctx.params
  let post = db.data?.posts.find(({id}) => id == queryId)
  if (post == null) {
    ctx.status = 404
    ctx.body = 'cannot found ' + queryId
    return
  }
  ctx.body = post
  // console.log(ctx.request.body)
})

router.post('/save', async (ctx, next) => {
  let id = nanoid()
  if (ctx.request.body == null || !('title' in ctx.request.body && 'content' in ctx.request.body)) {
    ctx.status = 400
    ctx.body = 'Bad request'
    return
  }
  db.data?.posts.push({
    id,
    title: ctx.request.body.title,
    content: ctx.request.body.content,
    time: Date.now()
  })
  ctx.body = id
  await db.write()
})

app.use(cors())
app.use(koaBody())
app.use(mount('/', serve('./static')))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('server is listening to port 3000')
})