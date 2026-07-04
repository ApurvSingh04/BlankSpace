import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';

export const profileRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

// Auth middleware for protected routes (follow / unfollow)
profileRouter.use('/:id/follow', async (c, next) => {
    const header: string = c.req.header('Authorization') || "";
    const token = header.split(" ")[1];

    if (!token) {
        c.status(403);
        return c.json({ message: "Unauthorized" });
    }

    try {
        const decoded = await verify(token, c.env.JWT_SECRET, "HS256");
        if (decoded.id) {
            c.set("userId", decoded.id as string);
            await next();
        } else {
            c.status(403);
            return c.json({ message: "Unauthorized" });
        }
    } catch (e) {
        console.error("Auth error:", e);
        c.status(403);
        return c.json({ message: "Unauthorized" });
    }
});

// GET profile
profileRouter.get('/:id', async (c) => {
    const profileId = c.req.param('id');
    
    // Optional auth to check if current user is following
    let currentUserId: string | null = null;
    const authHeader = c.req.header('Authorization');
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = await verify(token, c.env.JWT_SECRET, "HS256");
            if (decoded.id) currentUserId = decoded.id as string;
        } catch (e) {}
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const user = await prisma.user.findUnique({
            where: { id: profileId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: { where: { published: true } }
                    }
                },
                posts: {
                    where: { published: true },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        createdAt: true,
                        authorId: true,
                        author: { select: { name: true, email: true } },
                        _count: { select: { likes: true, comments: true } }
                    }
                },
                followers: currentUserId ? {
                    where: { followerId: currentUserId }
                } : false
            }
        });

        if (!user) {
            c.status(404);
            return c.json({ message: "User not found" });
        }

        const anyUser = user as any;
        const isFollowing = currentUserId && anyUser.followers ? anyUser.followers.length > 0 : false;

        // Clean up the response
        const { followers, ...safeUser } = anyUser;
        
        return c.json({
            ...safeUser,
            isFollowing
        });

    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});

// POST follow
profileRouter.post('/:id/follow', async (c) => {
    const followingId = c.req.param('id');
    const followerId = c.get('userId');

    if (followingId === followerId) {
        c.status(400);
        return c.json({ message: "Cannot follow yourself" });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        await prisma.follows.create({
            data: {
                followerId,
                followingId
            }
        });
        return c.json({ success: true, message: "Followed successfully" });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Internal server error or already following" });
    }
});

// DELETE follow (unfollow)
profileRouter.delete('/:id/follow', async (c) => {
    const followingId = c.req.param('id');
    const followerId = c.get('userId');

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        await prisma.follows.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });
        return c.json({ success: true, message: "Unfollowed successfully" });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Internal server error or not following" });
    }
});

// GET followers
profileRouter.get('/:id/followers', async (c) => {
    const profileId = c.req.param('id');
    let currentUserId: string | null = null;
    const authHeader = c.req.header('Authorization');
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = await verify(token, c.env.JWT_SECRET, "HS256");
            if (decoded && decoded.id) {
                currentUserId = decoded.id as string;
            }
        } catch (e) {}
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const followers = await prisma.follows.findMany({
            where: { followingId: profileId },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        followers: currentUserId ? {
                            where: { followerId: currentUserId }
                        } : false
                    }
                }
            }
        });

        const users = followers.map(f => ({
            id: f.follower.id,
            name: f.follower.name,
            email: f.follower.email,
            isFollowing: currentUserId && f.follower.followers ? f.follower.followers.length > 0 : false
        }));

        return c.json({ users });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});

// GET following
profileRouter.get('/:id/following', async (c) => {
    const profileId = c.req.param('id');
    let currentUserId: string | null = null;
    const authHeader = c.req.header('Authorization');
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = await verify(token, c.env.JWT_SECRET, "HS256");
            if (decoded && decoded.id) {
                currentUserId = decoded.id as string;
            }
        } catch (e) {}
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const following = await prisma.follows.findMany({
            where: { followerId: profileId },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        followers: currentUserId ? {
                            where: { followerId: currentUserId }
                        } : false
                    }
                }
            }
        });

        const users = following.map(f => ({
            id: f.following.id,
            name: f.following.name,
            email: f.following.email,
            isFollowing: currentUserId && f.following.followers ? f.following.followers.length > 0 : false
        }));

        return c.json({ users });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});
