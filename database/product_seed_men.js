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

    const mensClothingDescriptions = [
      "Tailored suits for a sharp look at work or formal events",
      "Classic Oxford shirts for versatile everyday wear",
      "Comfortable chinos in a variety of colors for casual outings",
      "Stylish leather jackets for an edgy vibe",
      "Cozy knit sweaters for layering in the cold",
      "Sporty polo shirts for a casual yet put-together style",
      "Durable denim jeans in various cuts and washes",
      "Professional blazers for polished business attire",
      "Warm down jackets for outdoor adventures",
      "Sleek dress shoes to complete any formal ensemble",
      "Cargo shorts for practicality and style during warmer months",
      "Soft flannel shirts for a relaxed weekend look",
    ];

    for (let i = 0; i < 12; i++) {
      await prisma.$transaction(async (tx) => {
        await tx.product.create({
          data: {
            name: clothingBrandNames[i],
            price:
              Math.floor(
                +faker.commerce.price({ min: 100000, max: 400000 }) / 1000
              ) * 1000,
            quantity: faker.number.int({ min: 10, max: 100 }),
            weight:
              Math.round(+faker.number.int({ min: 90, max: 500 }) / 100) * 100 +
              90,
            is_deleted: false,
            description: mensClothingDescriptions[i],
            category_id: 1,
            rating: faker.number.float({ multipleOf: 0.25, min: 3, max: 5 }),
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
