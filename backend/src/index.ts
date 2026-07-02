import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode, sign, verify} from 'hono/jwt'
import { env } from 'hono/adapter'

const app = new Hono<{
    Bindings: {
        DATABASE_URL : string
        JWT_SECRET : string
    }
}>()

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try{
      const user = await prisma.user.create({
      data : {
        name: body.name,
        email : body.email,
        password : body.password
      },
    })

    const token = await sign({id : user.id}, c.env.JWT_SECRET)

    return c.json({
      jwt : token,
    })
  }
  catch(e : any){
    c.status(403);
    return c.json({
      message : "Internal server error"
    });
  }
})


app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
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
