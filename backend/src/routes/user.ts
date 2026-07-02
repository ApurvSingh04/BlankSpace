import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput } from '@apurva-dev/blog-common'
import { signupInput } from '@apurva-dev/blog-common'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();

    const success = signupInput.safeParse(body);

    if (!success.success) {
        c.status(400);
        return c.json({ message: "Invalid input" });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());


    try {
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password
            },
        });

        const token = await sign({ id: user.id }, c.env.JWT_SECRET);

        return c.json({ jwt: token });
    } catch (e: any) {
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());


    try {
        const body = await c.req.json();

        const success = signinInput.safeParse(body);

        if (!success.success) {
            c.status(400);
            return c.json({ message: "Invalid input" });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
                password: body.password,
            }
        });

        if (!user) {
            c.status(403);
            return c.json({ message: "Invalid email or password" });
        }

        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt });
    } catch (e: any) {
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});