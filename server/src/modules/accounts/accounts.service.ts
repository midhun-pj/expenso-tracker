import { AccounntRequestPayload } from "@models/account.model";
import { PrismaClient, AccountType } from "@prisma/client";

export async function createAccountService(
  prisma: PrismaClient,
  userId: string,
  data: AccounntRequestPayload,
) {
  return prisma.account.create({
    data: {
      name: data.name,
      type: data.type,
      balance: data.initialBalance ?? 0,
      userId,
    },
  });
}

export async function getAccountsService(
  prisma: PrismaClient,
  userId: string,
  search: string,
) {
    
  const where: any = {
    userId,
    isDeleted: false,
  };

  if (search) {
    where.OR = [{ name: { contains: search } }];
  }

  return prisma.account.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAccountByIdService(
  prisma: PrismaClient,
  userId: string,
  accountId: string,
) {
  return prisma.account.findFirst({
    where: {
      id: accountId,
      userId,
    },
  });
}

export async function updateAccountService(
  prisma: PrismaClient,
  userId: string,
  accountId: string,
  data: {
    name?: string;
    type?: AccountType;
  },
) {
  return prisma.account.updateMany({
    where: {
      id: accountId,
      userId,
    },
    data,
  });
}

export async function deleteAccountService(
  prisma: PrismaClient,
  userId: string,
  accountId: string,
) {
  const existingAccount = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId,
    },
    include: {
      entries: true,
    },
  });

  if (!existingAccount) {
    throw new Error("Account not found");
  }

  if (existingAccount.entries.length > 0) {
    return prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  return prisma.account.delete({
    where: {
      id: accountId,
    },
  });
}
