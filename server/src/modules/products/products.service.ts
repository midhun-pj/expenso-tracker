import { PrismaClient } from "@prisma/client";
import { CreateProductInput, UpdateProductInput } from "./products.schema";
import { GetProductQuery } from "@models/product.model";

export async function createProductService(
  prisma: PrismaClient,
  userId: string,
  data: CreateProductInput,
) {
  return prisma.product.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function getProductsService(
  prisma: PrismaClient,
  userId: string,
  query: GetProductQuery,
) {
  const { page = 1, limit = 20, search="" } = query;

  const skip = (page - 1) * limit;

  const where: any = {
    userId,
  };

  if (search) {
    where.OR = [{ name: { contains: search } }];
  }

  const [rawProducts, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,

      orderBy: {
        name: "asc",
      },

      skip,

      take: limit,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    data: rawProducts,

    pagination: {
      page,
      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductByIdService(
  prisma: PrismaClient,
  userId: string,
  productId: string,
) {
  return prisma.product.findFirst({
    where: {
      id: productId,
      userId,
    },
  });
}

export async function updateProductService(
  prisma: PrismaClient,
  userId: string,
  productId: string,
  data: UpdateProductInput,
) {
  return prisma.product.updateMany({
    where: {
      id: productId,
      userId,
    },
    data,
  });
}

export async function deleteProductService(
  prisma: PrismaClient,
  userId: string,
  productId: string,
) {
  const existing = await prisma.product.findFirst({
    where: {
      id: productId,
      userId,
    },
    include: { items: true },
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  if (existing.items.length > 0) {
    throw new Error("Cannot delete product with existing grocery items");
  }

  return prisma.product.delete({
    where: { id: productId },
  });
}
