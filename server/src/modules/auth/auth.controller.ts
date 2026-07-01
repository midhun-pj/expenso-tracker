import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { registerSchema, loginSchema } from './auth.schema'

import { hashPassword, comparePassword } from './auth.service'

import { LoginResponse, RegisterResponse } from '@models/auth.model'

export async function register(request: FastifyRequest, reply: FastifyReply): Promise<RegisterResponse> {
    try {
        const body = registerSchema.parse(request.body)

        const existingUser =
            await request.server.prisma.user.findUnique({
                where: {
                    email: body.email,
                },
            })

        if (existingUser) {
            return reply.code(409).send({
                message: 'User already exists',
            })
        }

        const passwordHash = await hashPassword(
            body.password
        )

        const user =
            await request.server.prisma.user.create({
                data: {
                    email: body.email,
                    passwordHash,
                    name: body.name,
                },
            })

        const token = await reply.jwtSign({
            userId: user.id,
            email: user.email,
        })

        return reply.code(201).send({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: error.issues,
            })
        }
        throw error
    }
}

export async function login(request: FastifyRequest, reply: FastifyReply): Promise<LoginResponse> {
    try {
        const body = loginSchema.parse(request.body)

        const user =
            await request.server.prisma.user.findUnique({
                where: {
                    email: body.email,
                },
            })

        if (!user) {
            return reply.code(401).send({
                message: 'Invalid email or password',
            })
        }

        const isPasswordValid =
            await comparePassword(
                body.password,
                user.passwordHash
            )

        if (!isPasswordValid) {
            return reply.code(401).send({
                message: 'Invalid email or password',
            })
        }

        const token = await reply.jwtSign({
            userId: user.id,
            email: user.email,
        })

        return reply.send({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: error.issues,
            })
        }
        throw error
    }
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = request.user as any

        const currentUser =
            await request.server.prisma.user.findUnique({
                where: {
                    id: user.userId,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            })

        if (!currentUser) {
            return reply.code(404).send({
                message: 'User not found',
            })
        }

        return reply.send(currentUser)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: error.issues,
            })
        }
        throw error
    }
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = request.user as any

        await request.server.prisma.user.delete({
            where: {
                id: user.userId,
            },
        })

        return reply.code(204).send()
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: error.issues,
            })
        }
        throw error
    }
}