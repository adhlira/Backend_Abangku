import prisma from "../app/helpers/prisma.js";
import { faker } from "@faker-js/faker";

const main = async () => {
  try {
    // await prisma.product.deleteMany({});
    const clothingBrandNames = [
      "Vanguard Apparel",
      "Gentlemen's Haven",
      "Urban Gents Attire",
      "Noble Threads",
      "Heritage Hues",
      "Masculine Moda",
      "Refined Raiment",
      "Dapper Domain",
      "Manifold Styles Co.",
      "Stalwart Sartorial",
      "Classic Chaps Collection",
      "Swagger & Stitch",
    ];
    for (let i = 0; i < 11; i++) {
      await prisma.$transaction(async (tx) => {
        await tx.product.create({
          data: {
            name: clothingBrandNames[i],
            price:
              Math.floor(
                +faker.commerce.price({ min: 100000, max: 400000 }) / 1000
              ) * 1000,
            quantity: faker.number.int({ min: 10, max: 100 }),
            is_deleted: false,
            description: faker.commerce.productDescription(),
            category_id: 1,
            rating: faker.number.float({ multipleOf: 0.25, min: 0, max: 5 }),
          },
        });
        await tx.productImage.create({
          data: {
            product_id: i + 1,
            image_url: `http://localhost:5000/static/product_${i}.png`,
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
