import prisma from "../app/helpers/prisma.js";
import { Role, Permission, PermissionAssignment } from "../app/constant/authorization.js";

const main = async () => {
  await prisma.permissionRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  for (const role in Role) {
    await prisma.role.create({
      data: {
        name: Role[role],
      },
    });
  }

  for (const permission in Permission) {
    await prisma.permission.create({
      data: {
        name: Permission[permission],
      },
    });
  }

  for (const role in PermissionAssignment) {
    for (const permission of PermissionAssignment[role]) {
      await prisma.permissionRole.create({
        data: {
          role: {
            connect: {
              name: role,
            },
          },
          permission: {
            connect: {
              name: permission,
            },
          },
        },
      });
    }
  }
};

main().catch((e) => {
  throw e;
});
