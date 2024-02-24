import prisma from "../helpers/prisma.js";
const authorize = (permission) => {
  return async (req, res, next) => {
    if (req.special) {
      return next();
    }
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const permissionRecords = await prisma.permissionRole.findMany({
      where: { role_id: req.user.role_id },
      include: { permission: true },
    });

    const permissions = permissionRecords.map(
      (record) => record.permission.name
    );

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};

export default authorize;
