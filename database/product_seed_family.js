import prisma from "../app/helpers/prisma.js";
import { faker } from "@faker-js/faker";

const main = async () => {
  try {
    // await prisma.product.deleteMany({});
    const familyMatchingClothingNames = [
      "Unity Threads",
      "Harmony Hues Collection",
      "Family Affair Apparel",
      "Coordinated Clan Couture",
      "Kinship Styles Collective",
      "Bonded by Fashion Collection",
      "FamFits Fashion",
      "Matching Moments Attire",
      "Together Trendy Threads",
      "Bonded by Threads"
    ];

    for (let i = 0; i < 9; i++) {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            name: familyMatchingClothingNames[i],
            price:
              Math.floor(
                +faker.commerce.price({ min: 1000000, max: 2000000 }) / 1000
              ) * 1000,
            quantity: faker.number.int({ min: 10, max: 100 }),
            is_deleted: false,
            description: faker.commerce.productDescription(),
            category_id: 4,
            rating: faker.number.float({ multipleOf: 0.25, min: 3, max: 5 }),
          },
        });

        await tx.productImage.create({
          data: {
            product_id: product.id,
            image_url: `http://localhost:5000/static/cp${i + 1}.jpg`,
          },
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

main().catch((e) => {
  throw e;
});
