import { FastifyReply, FastifyRequest } from "fastify";

import {
  createSupermarketSchema,
  updateSupermarketSchema,
} from "./supermarkets.schema";

import {
  createSupermarketService,
  getSupermarketsService,
  getSupermarketByIdService,
  updateSupermarketService,
  deleteSupermarketService,
} from "./supermarkets.service";

export async function createSupermarket(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createSupermarketSchema.parse(request.body);
  const user = request.user as any;

  const supermarket = await createSupermarketService(
    request.server.prisma,
    user.userId,
    body,
  );

  return reply.code(201).send(supermarket);
}

export async function getSupermarkets(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = request.user as any;

  const { search = "" } = request.query as {    search?: string  };

  const supermarkets = await getSupermarketsService(
    request.server.prisma,
    user.userId,
    search
  );

  return reply.send(supermarkets);
}

export async function getSupermarketById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const user = request.user as any;

  const supermarket = await getSupermarketByIdService(
    request.server.prisma,
    user.userId,
    request.params.id,
  );

  if (!supermarket) {
    return reply.code(404).send({
      message: "Supermarket not found",
    });
  }

  return reply.send(supermarket);
}

export async function updateSupermarket(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = updateSupermarketSchema.parse(request.body);
  const user = request.user as any;

  const result = await updateSupermarketService(
    request.server.prisma,
    user.userId,
    request.params.id,
    body,
  );

  if (result.count === 0) {
    return reply.code(404).send({
      message: "Supermarket not found",
    });
  }

  return reply.send({
    message: "Supermarket updated successfully",
  });
}

export async function deleteSupermarket(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const user = request.user as any;

  try {
    const result = await deleteSupermarketService(
      request.server.prisma,
      user.userId,
      request.params.id,
    );

    return reply.send({
      message: "Supermarket deleted successfully",
      supermarket: result,
    });
  } catch (err: any) {
    return reply.code(400).send({
      message: err.message,
    });
  }
}
