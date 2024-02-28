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
      "Whimsical Pixie Creations",
    ];
    const kidsClothingDescriptions = [
      "Cute animal-themed onesies for babies",
      "Colorful rain jackets for playful adventures",
      "Sparkly tutus for little ballerinas",
      "Dinosaur-printed t-shirts for budding paleontologists",
      "Comfy leggings with fun patterns for active toddlers",
      "Superhero-themed hoodies for adventurous kids",
      "Princess dresses for magical playtime",
      "Cozy knit sweaters for chilly days",
      "Cool denim overalls for stylish outings",
      "Bright swim trunks for splashing in the pool",
      "Soft pajama sets featuring favorite cartoon characters",
      "Sporty sneakers for running and jumping",
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
            weight:
              Math.round(+faker.number.int({ min: 35, max: 300 }) / 100) * 100 +
              35,
            is_deleted: false,
            description: kidsClothingDescriptions[i],
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
