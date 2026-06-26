import { FastifyReply, FastifyRequest } from "fastify";

import {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./products.schema";

import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "./products.service";

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createProductSchema.parse(request.body);
  const user = request.user as any;

  const product = await createProductService(
    request.server.prisma,
    user.userId,
    body,
  );

  return reply.code(201).send(product);
}

export async function getProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = request.user as any;

  const query = getProductSchema.parse(request.query);

  const products = await getProductsService(request.server.prisma, user.userId, query);

  return reply.send(products);
}

export async function getProductById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const user = request.user as any;

  const product = await getProductByIdService(
    request.server.prisma,
    user.userId,
    request.params.id,
  );

  if (!product) {
    return reply.code(404).send({
      message: "Product not found",
    });
  }

  return reply.send(product);
}

export async function updateProduct(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = updateProductSchema.parse(request.body);
  const user = request.user as any;

  const result = await updateProductService(
    request.server.prisma,
    user.userId,
    request.params.id,
    body,
  );

  if (result.count === 0) {
    return reply.code(404).send({
      message: "Product not found",
    });
  }

  return reply.send({
    message: "Product updated successfully",
  });
}

export async function deleteProduct(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const user = request.user as any;

  try {
    const result = await deleteProductService(
      request.server.prisma,
      user.userId,
      request.params.id,
    );

    return reply.send({
      message: "Product deleted successfully",
      product: result,
    });
  } catch (err: any) {
    return reply.code(400).send({
      message: err.message,
    });
  }
}
