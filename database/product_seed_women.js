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
    const womensClothingDescriptions = [
      "Flowy maxi dresses for effortless summer style",
      "Chic blouses with feminine details for work or play",
      "Figure-flattering skinny jeans in a range of washes",
      "Versatile wrap dresses that can be dressed up or down",
      "Cozy knit cardigans for layering in transitional weather",
      "Elegant pencil skirts for a polished office look",
      "Fashionable jumpsuits for a trendy statement outfit",
      "Stylish ankle boots to complement any outfit",
      "Fitted blazers for a professional and tailored appearance",
      "Bohemian-inspired peasant tops for a relaxed vibe",
      "Statement earrings to add a pop of color to any ensemble",
      "Luxurious silk scarves to elevate any outfit",
    ];
    for (let i = 0; i < 12; i++) {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            name: womenClothingNames[i],
            price:
              Math.floor(
                +faker.commerce.price({ min: 200000, max: 540000 }) / 1000
              ) * 1000,
            quantity: faker.number.int({ min: 10, max: 100 }),
            weight:
              Math.round(+faker.number.int({ min: 90, max: 500 }) / 100) * 100 +
              90,
            is_deleted: false,
            description: womensClothingDescriptions[i],
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
