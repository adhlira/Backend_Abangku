import prisma from "../app/helpers/prisma.js";
import { faker } from "@faker-js/faker";

const main = async () => {
  try {
    // await prisma.product.deleteMany({});
    const womenClothingNames = [
      "Femme Fatale Fashion House",
      "Blossom & Lace Boutique Collective",
      "Elegance Ensembles Emporium",
      "Serene Silhouettes Style Studio",
      "Radiant Roses Couture Creations",
      "Empress Elegance Collection Co.",
      "Enchantress Apparel Emporium",
      "Graceful Garments Galore",
      "Siren Styles Studio",
      "Bloom & Chic Designs Boutique",
      "Opulent Orchid Attire Boutique",
      "Luminary Lady Line Collections",
      "Muse & Magnolia Boutique Haven",
    ];
    for (let i = 0; i < 12; i++) {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            name: womenClothingNames[i],
            price:
              Math.floor(
                +faker.commerce.price({ min: 200000, max:5400000 }) / 1000
              ) * 1000,
            quantity: faker.number.int({ min: 10, max: 100 }),
            is_deleted: false,
            description: faker.commerce.productDescription(),
            category_id: 2,
            rating: faker.number.float({ multipleOf: 0.25, min: 3, max: 5 }),
          },
        });  

        await tx.productImage.create({
          data: {
            product_id: product.id,
            image_url: `http://localhost:5000/static/product_${i}_w.png`,
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
