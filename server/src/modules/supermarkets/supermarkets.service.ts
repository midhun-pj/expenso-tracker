import { PrismaClient } from "@prisma/client";
import {
  CreateSupermarketInput,
  UpdateSupermarketInput,
} from "./supermarkets.schema";

export async function createSupermarketService(
  prisma: PrismaClient,
  userId: string,
  data: CreateSupermarketInput,
) {
  return prisma.supermarket.create({
    data: {
      name: data.name,
      location: data.location,
      userId,
    },
  });
}

export async function getSupermarketsService(
  prisma: PrismaClient,
  userId: string,
  search: string,
) {
  const where: any = {
    userId,
  };

  if (search) {
    where.OR = [{ name: { contains: search } }];
  }

  return prisma.supermarket.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function getSupermarketByIdService(
  prisma: PrismaClient,
  userId: string,
  supermarketId: string,
) {
  return prisma.supermarket.findFirst({
    where: {
      id: supermarketId,
      userId,
    },
  });
}

export async function updateSupermarketService(
  prisma: PrismaClient,
  userId: string,
  supermarketId: string,
  data: UpdateSupermarketInput,
) {
  return prisma.supermarket.updateMany({
    where: {
      id: supermarketId,
      userId,
    },
    data,
  });
}

export async function deleteSupermarketService(
  prisma: PrismaClient,
  userId: string,
  supermarketId: string,
) {
  const existing = await prisma.supermarket.findFirst({
    where: {
      id: supermarketId,
      userId,
    },
    include: { items: true },
  });

  if (!existing) {
    throw new Error("Supermarket not found");
  }

  if (existing.items.length > 0) {
    throw new Error("Cannot delete supermarket with existing grocery items");
  }

  return prisma.supermarket.delete({
    where: { id: supermarketId },
  });
}
