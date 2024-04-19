import express from "express";
import AdminProductController from "../../../../../controllers/web/v1/admin/productController";
import validations from "../../../../../middleware/validations";
import CategoryController from "../../../../../controllers/web/v1/admin/categoryController";


const adminRouter = express.Router();

const productController = new AdminProductController();
const categoryController = new CategoryController();



adminRouter.post("/product", validations.createProduct, productController.create.bind(productController));
adminRouter.get("/admin/products",  productController.getAll.bind(productController));
adminRouter.delete("/products/:id",  productController.delete.bind(productController));
adminRouter.put("/products/:id",  productController.edit.bind(productController));
adminRouter.get("/products/:id",  productController.get.bind(productController));

adminRouter.post("/category", categoryController.create.bind(categoryController));
adminRouter.get("/category",  categoryController.getAll.bind(categoryController));
adminRouter.delete("/category/:id",  categoryController.delete.bind(categoryController));
adminRouter.put("/category/:id",  categoryController.edit.bind(categoryController));
adminRouter.get("/category/:id",  categoryController.get.bind(categoryController));

export default adminRouter;
