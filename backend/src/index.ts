import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter'

const app = new Hono<{
    Bindings: {
        DATABASE_URL : string
    }
}>()

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  return c.text("Hello signup")
})

app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    return c.text("Hello signin")
})

app.post('/api/v1/blog', async (c) => {
  return c.text("Hello blog")
})

app.put('/api/v1/blog', async (c) => {
  return c.text("Hello blog update")
})

app.get('/api/v1/blog/:id', async (c) => {
  return c.text("Hello blog")
})

export default app
