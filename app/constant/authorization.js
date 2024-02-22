import prisma from "../helpers/prisma.js";

export const authorize = (permission) => {
  return async (req, res, next) => {
    // Mengambil informasi pengguna dari req.user
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const permissionRecords = await prisma.permissionRole.findMany({
      where: { role_id: user.role_id },
      include: { permission: true },
    });

    const permissions = permissionRecords.map((record) => record.permission.name);

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};

export const Role = {
  ADMIN: "admin",
  REGULAR_USER: "regular_user",
};

export const Permission = {
  BROWSE_CATEGORIES: "browse_categories",
  READ_CATEGORIES: "read_categories",
  EDIT_CATEGORIES: "edit_categories",
  ADD_CATEGORIES: "add_categories",
  DELETE_CATEGORIES: "delete_categories",

  BROWSE_PRODUCTS: "browse_products",
  READ_PRODUCTS: "read_products",
  EDIT_PRODUCTS: "edit_products",
  ADD_PRODUCTS: "add_products",
  DELETE_PRODUCTS: "delete_products",

  BROWSE_CARTS: "browse_carts",
  READ_CARTS: "read_carts",
  EDIT_CARTS: "edit_carts",
  ADD_CARTS: "add_carts",
  DELETE_CARTS: "delete_carts",

  BROWSE_ORDERS: "browse_orders",
  READ_ORDERS: "read_orders",
  EDIT_ORDERS: "edit_orders",
  ADD_ORDERS: "add_orders",
  DELETE_ORDERS: "delete_orders",

  ADD_PAYMENTS: "add_payments",

  BROWSE_USERS: "browse_users",
  READ_USERS: "read_users",
  EDIT_USERS: "edit_users",
  ADD_USERS: "add_users",
  DELETE_USERS: "delete_users",
};

export const PermissionAssignment = {
  [Role.ADMIN]: [
    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORIES,
    Permission.EDIT_CATEGORIES,
    Permission.ADD_CATEGORIES,
    Permission.DELETE_CATEGORIES,

    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCTS,
    Permission.EDIT_PRODUCTS,
    Permission.ADD_PRODUCTS,
    Permission.DELETE_PRODUCTS,

    Permission.BROWSE_ORDERS,
    Permission.READ_ORDERS,
    Permission.EDIT_ORDERS,
    Permission.ADD_ORDERS,
    Permission.DELETE_ORDERS,

    Permission.BROWSE_USERS,
    Permission.READ_USERS,
    Permission.EDIT_USERS,
    Permission.ADD_USERS,
    Permission.DELETE_USERS,
  ],

  [Role.REGULAR_USER]: [
    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCTS,

    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORIES,

    Permission.BROWSE_USERS,
    Permission.READ_USERS,
    Permission.EDIT_USERS,

    Permission.BROWSE_CARTS,
    Permission.READ_CARTS,
    Permission.EDIT_CARTS,
    Permission.ADD_CARTS,
    Permission.DELETE_CARTS,

    Permission.READ_ORDERS,
    Permission.ADD_ORDERS,

    Permission.ADD_PAYMENTS,
  ],
};
