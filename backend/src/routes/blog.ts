import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const header: string = c.req.header('Authorization') || "";
    const token = header.split(" ")[1];

    if (!token) {
        c.status(401);
        return c.json({ message: "Unauthorized: no token provided" });
    }

    try {
        const response = await verify(token, c.env.JWT_SECRET, "HS256");
        if (response.id) {
            c.set('userId', response.id as string);
            await next();
        } else {
            c.status(403);
            return c.json({ message: "Unauthorized: invalid token payload" });
        }
    } catch (e) {
        c.status(401);
        return c.json({ message: "Unauthorized: token verification failed" });
    }
});

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: true,
                authorId: c.get("userId")
            }
        });

        return c.json({ id: post.id });
    } catch (e) {
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const userId = c.get("userId");

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const existing = await prisma.post.findUnique({
            where: { id: body.id },
            select: { authorId: true }
        });

        if (!existing) {
            c.status(404);
            return c.json({ message: "Post not found" });
        }

        if (existing.authorId !== userId) {
            c.status(403);
            return c.json({ message: "Forbidden: you are not the author" });
        }

        const post = await prisma.post.update({
            where: { id: body.id },
            data: {
                title: body.title,
                content: body.content,
                published: body.published ?? true
            }
        });

        return c.json({ id: post.id });
    } catch (e) {
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const page  = Math.max(1, Number(c.req.query('page')  ?? 1));
    const limit = Math.min(100, Math.max(1, Number(c.req.query('limit') ?? 10)));
    const skip  = (page - 1) * limit;

    try {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { published: true },
                skip,
                take: limit,
                orderBy: { id: 'desc' },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    authorId: true,
                    author: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.post.count({ where: { published: true } })
        ]);

        return c.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (e) {
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});


blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id');

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                authorId: true,
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!post) {
            c.status(404);
            return c.json({ message: "Post not found" });
        }

        return c.json({ post });
    } catch (e) {
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});