const auth = require('../app/middleware/auth');
const manager = require('../app/middleware/manager');
const multer = require("multer");
const shop = require("../app/controllers/shop.controller");
const router = require("express").Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

module.exports = (app) => {

    router.post("/pay", auth, shop.payment);
    router.post('/products', upload.single("image"), shop.createProduct)
    router.get('/products', auth, shop.getProducts)
    router.get('/orders', [auth, manager], shop.getOrders);
    router.delete('/orders/:id', shop.deleteOrder)
    app.use("/api/shop", router);
};
