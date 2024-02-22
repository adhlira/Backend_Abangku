import prisma from "../app/helpers/prisma.js";
import { faker } from "@faker-js/faker";

const main = async () => {
  try {
    // await prisma.product.deleteMany({});
    const kidsClothingNames = [
      "Tiny Tots Threads",
      "Little Legends Wardrobe",
      "Cute & Cuddly Creations",
      "Playful Pixie Apparel",
      "Mini Marvels Boutique",
      "Whimsical Wardrobe for Wee Ones",
      "Tiny Treasures Attire",
      "Little Dreamers Collection",
      "Junior Joy Fashion",
      "Sweet Sprouts Styles",
      "Kids Kingdom Closet",
      "Whimsical Pixie Creations"
    ];
    for (let i = 0; i < 12; i++) {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            name: kidsClothingNames[i],
            price:
              Math.floor(
                +faker.commerce.price({ min: 100000, max: 150000 }) / 1000
              ) * 1000,
            quantity: faker.number.int({ min: 10, max: 100 }),
            is_deleted: false,
            description: faker.commerce.productDescription(),
            category_id: 3,
            rating: faker.number.float({ multipleOf: 0.25, min: 3, max: 5 }),
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
