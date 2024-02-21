import prisma from "../app/helpers/prisma.js";
import { faker } from "@faker-js/faker";

const main = async () => {
  try {
    // await prisma.product.deleteMany({});
    for (let i = 0; i < 12; i++) {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            name: faker.commerce.productName(),
            price:
              Math.floor(
                +faker.commerce.price({ min: 100000, max: 200000 }) / 1000
              ) * 1000,
            quantity: faker.number.int({ min: 10, max: 100 }),
            is_deleted: false,
            description: faker.commerce.productDescription(),
            category_id: 3,
            rating: faker.number.float({ multipleOf: 0.25, min: 0, max: 5 }),
          },
        });  

        await tx.productImage.create({
          data: {
            product_id: product.id,
            image_url: `http://localhost:5000/static/product_${i}_k.png`,
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
