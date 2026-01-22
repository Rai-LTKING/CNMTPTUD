const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const upload = require('../services/s3Service');
const { getAllProducts, saveProduct, deleteProduct, getProductById } = require('../services/dbService');

// Trang chủ: Liệt kê sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.render('index', { products });
    } catch (error) {
        res.status(500).send("Lỗi: " + error.message);
    }
});

// Trang thêm sản phẩm
router.get('/add', (req, res) => res.render('add'));

// Xử lý thêm sản phẩm (có upload ảnh)
router.post('/add', upload.single('image'), async (req, res) => {
    const { name, price, quantity } = req.body;
    const newProduct = {
        id: uuidv4(),
        name,
        price: Number(price),
        quantity: Number(quantity),
        url_image: req.file ? req.file.location : "" // URL từ S3
    };
    await saveProduct(newProduct);
    res.redirect('/');
});

// Xử lý xóa sản phẩm
router.post('/delete', async (req, res) => {
    await deleteProduct(req.body.id);
    res.redirect('/');
});

// Trang hiển thị form sửa sản phẩm
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        res.render('edit', { product });
    } catch (error) {
        res.status(500).send("Lỗi: " + error.message);
    }
});

// Xử lý cập nhật sản phẩm
router.post('/edit', upload.single('image'), async (req, res) => {
    const { id, name, price, quantity, old_image_url } = req.body;
    const updatedProduct = {
        id: id,
        name,
        price: Number(price),
        quantity: Number(quantity),
        url_image: req.file ? req.file.location : old_image_url // Nếu không upload ảnh mới, giữ ảnh cũ
    };
    await saveProduct(updatedProduct); // PutCommand sẽ ghi đè lên ID cũ
    res.redirect('/');
});

module.exports = router;