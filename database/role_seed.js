import prisma from "../app/helpers/prisma.js";

const main = async () => {
  try {
    await prisma.role.createMany({
      data: [{ name: "admin" }, { name: "regular_user" }],
    });
  } catch (error) {
    console.log(error);
  }
};

main().catch((e) => {
  throw e;
});
