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
  SELLER: "seller",
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

  BROWSE_CART: "browse_cart",
  READ_CART: "read_cart",
  EDIT_CART: "edit_cart",
  ADD_CART: "add_cart",
  DELETE_CART: "delete_cart",

  BROWSE_ORDERS: "browse_orders",
  READ_ORDERS: "read_orders",
  ADD_ORDERS: "add_orders",

  ADD_PAYMENT: "add_payment",

  BROWSE_USERS: "browse_users",
  READ_USERS: "read_users",
  EDIT_USERS: "edit_users",
  ADD_USERS: "add_users",
  DELETE_USERS: "delete_users",
};

export const PermissionAssignment = {
  [Role.SELLER]: [
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

    Permission.BROWSE_USERS,
    Permission.READ_USERS,
    Permission.EDIT_USERS,
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

    Permission.BROWSE_CART,
    Permission.READ_CART,
    Permission.EDIT_CART,
    Permission.ADD_CART,
    Permission.DELETE_CART,

    Permission.READ_ORDERS,
    Permission.ADD_ORDERS,

    Permission.ADD_PAYMENT,
  ],
};
