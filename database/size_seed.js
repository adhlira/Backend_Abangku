import prisma from "../app/helpers/prisma.js";

const main = async () => {
  try {
    await prisma.size.createMany({
      data: [
        { name: "S" },
        { name: "M" },
        { name: "L" },
        { name: "XL" },
        { name: "XXL" },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};

main().catch((e) => {
  throw e;
});
