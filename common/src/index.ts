import { z } from 'zod'

export const signupInput = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6)
})


export const signinInput = z.object({
    email: z.email(),
    password: z.string().min(6)
})


export const createBlogInput = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    published: z.boolean().optional(),
})

export const updateBlogInput = z.object({
    id: z.string(),
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    published: z.boolean().optional(),
})

export const createCommentInput = z.object({
    content: z.string().min(1)
})



export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
export type CreateCommentInput = z.infer<typeof createCommentInput>;