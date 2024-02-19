import prisma from "../app/helpers/prisma.js";

const main = async () => {
  try {
    await prisma.membership.createMany({
      data: [{ name: "Bronze" }, { name: "Silver" }, { name: "Gold" }, { name: "Platinum" }],
    });
  } catch (error) {
    console.log(error);
  }
};

main().catch((e) => {
  throw e;
});
