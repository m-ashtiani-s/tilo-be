import express from "express";
import AdminProductController from "../../../../../controllers/web/v1/admin/productController";
import validations from "../../../../../middleware/validations";
import CategoryController from "../../../../../controllers/web/v1/admin/categoryController";

const adminRouter = express.Router();

const productController = new AdminProductController();
const categoryController = new CategoryController();

//product routs
adminRouter.post("/products", validations.createProduct, productController.create.bind(productController));
adminRouter.get("/products", validations.getAllProducts, productController.getAll.bind(productController));
adminRouter.delete("/products/:id", productController.delete.bind(productController));
adminRouter.put("/products/:id", validations.editProduct, productController.edit.bind(productController));
adminRouter.get("/products/:id", productController.get.bind(productController));

//category routs
adminRouter.post("/category", validations.createCategory, categoryController.create.bind(categoryController));
adminRouter.get("/category", categoryController.getAll.bind(categoryController));
adminRouter.delete("/category/:id", categoryController.delete.bind(categoryController));
adminRouter.put("/category/:id", validations.editCategory, categoryController.edit.bind(categoryController));
adminRouter.get("/category/:id", categoryController.get.bind(categoryController));

export default adminRouter;
