import { GroceryUnit, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import groceryData from "./grocery_items_with_supermarket.json";

// Your user ID (same as migration script)
const userId = "cmqtu1wie0000zd29f1k64me4";

const supermarketList: any[] = [
  {
    id: 1,
    name: "REWE",
  },
  {
    id: 2,
    name: "Lidl",
  },
  {
    id: 3,
    name: "Aldi",
  },
  {
    id: 4,
    name: "Edeka",
  },
  {
    id: 5,
    name: "Kaufland",
  },
  {
    id: 6,
    name: "Netto",
  },
  {
    id: 7,
    name: "Penny",
  },
  {
    id: 8,
    name: "Bio Market",
  },
  {
    id: 9,
    name: "DM",
  },
  {
    id: 10,
    name: "Muller",
  },
  {
    id: 11,
    name: "Tegut",
  },
  {
    id: 12,
    name: "Indian store",
  },
  {
    id: 738,
    name: "Go Asia",
  },
];

// normalize helper (VERY important for duplicates like case/spacing)
function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

async function main() {
  let count = 0;

  for (const superm of supermarketList) {
      await prisma.supermarket.create({
          data: {
              name:superm.name,
              userId,
          },
      })

      count++;
  }

  for (let i = 0; i < groceryData.length; i++) {
    const { supermarketName, name } = groceryData[i];

    const item = groceryData[i];

    const superMarket = await prisma.supermarket.findFirst({
      where: {
        name: supermarketName,
        userId,
      },
    });

    // Create product if it doesn't exist
    let product = await prisma.product.findFirst({
      where: {
        name: {
          equals: normalizeName(name),
        },
      },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: normalizeName(name),
          userId,
        },
      });

      console.log(`✅ Created product: ${product.name}`);
    }

    const groceryItemInclude = {
      product: { select: { id: true, name: true } },
      supermarket: { select: { id: true, name: true } },
    };

    await prisma.groceryItem.create({
      data: {
        productId: product?.id,
        supermarketId: superMarket?.id,
        quantity: item.quantity,
        unit: item.unit.toUpperCase() as GroceryUnit,
        price: item.price,
        date: new Date(item.date),
        userId,
      },
      include: groceryItemInclude,
    });

    count++;
  }

  console.log(`✅ Inserted ${count} products successfully`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
