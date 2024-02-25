import prisma from "../app/helpers/prisma.js";

async function insertRandomProductSizes() {
  try {
    // Fetch all products and sizes
    const products = await prisma.product.findMany({
      where: {
        NOT: {
          category_id: 4,
        },
      },
    });
    const sizes = await prisma.size.findMany();

    // Check if there are no products or sizes in the database
    if (products.length === 0 || sizes.length === 0) {
      throw new Error("No products or sizes found in the database.");
    }

    // Iterate over each product
    for (const product of products) {
      // Generate a random number of sizes for the product (at least 1, maximum sizes.length)
      const numSizes = Math.floor(Math.random() * sizes.length) + 1;

      // Shuffle sizes array to get a random selection
      const shuffledSizes = sizes.sort(() => Math.random() - 0.5);

      // Select the first numSizes sizes
      const selectedSizes = shuffledSizes.slice(0, numSizes);

      // Create a ProductSize relation for each selected size
      for (const size of selectedSizes) {
        const productSize = await prisma.productSize.create({
          data: {
            product_id: product.id,
            size_id: size.id,
          },
        });

        console.log(
          `ProductSize relation created for product ID ${
            product.id
          } and size ID ${size.id}: ${JSON.stringify(productSize)}`
        );
      }
    }
  } catch (error) {
    console.error("Error inserting random ProductSizes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage:
insertRandomProductSizes();
