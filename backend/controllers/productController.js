const {Product, validateCreateProduct, validateUpdateProduct} = require("../models/Product");
const fs = require("fs");
const path = require("path");
const {cloudinaryUploadImage, cloudinaryRemoveImage} = require("../utils/cloudinary")
/**---------------------------------
 *@desc Create New Post
 *@router /app/posts
 * @method post
 --------------------------------*/
module.exports.createProductCtrl = async (req, res) => {
    try {
        // 1. Validation for image
        // if (!req.file) {
        //     return res.status(400).json({message: "no image provided "})
        // }
        // // 2. Validation for data
        // const {error} = validateCreateProduct(req.body);
        // if (error) {
        //     return res.status(400).json({message: error.details[0].message})
        // }
        // 3. Upload photo
        const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
        const result = await cloudinaryUploadImage(imagePath);
        // 4. Create new post and save it to DB
        const product = await Product.create({
            name: req.body.name,
            qt: req.body.qt,
            price: req.body.price,
            PurchasingPrice: req.body.PurchasingPrice,
            description: req.body.description,
            category: req.body.category,
            user: req.userToken.id,
            image: {
                url: result.secure_url,
                publicId: result.public_id
            }

        })
        // 5. Send response to the client|
        res.status(200).json(product)
        // 6. Remove image from the server
        fs.unlinkSync(imagePath)
    } catch (e) {
        console.log(e)
    }
}
/**---------------------------------
 *@desc Get Post by id
 *@router /app/posts/post/:id
 * @method get
 --------------------------------*/
module.exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            // .populate("user")
            // .populate("categories")
            // .sort({createdAt: -1})
        if (!product) {
            return res.status(404).json({message: "Product Not fond"})
        }
        res.status(200).json(product)

    } catch (e) {
        console.log(e)

    }
}
/**---------------------------------
 *@desc Get all post
 *@router /app/posts/post/
 * @method get
 --------------------------------*/
module.exports.getAllProductsCtrl = async (req, res) => {
    try {
        const product_PER_PAGE = 10;
        const { pageNumber, userId, category } = req.query;  // تشمل الفئة في المعاملات

        // بناء كائن الاستعلام بناءً على المعلمات المقدمة
        let query = {};
        if (userId) {
            query.user = userId;  // تصفية حسب معرف المستخدم
        }
        if (category) {
            query.category = category;  // تصفية حسب الفئة
        }

        let products;
        if (pageNumber) {
            products = await Product.find(query).sort({ createdAt: -1 })
                .skip((pageNumber - 1) * product_PER_PAGE)
                .limit(product_PER_PAGE)
                .populate("user")
            res.status(200).json(products);
        } else {
            products = await Product.find(query)
                .sort({ createdAt: 1 })
                .populate("user", "-password")
            res.status(200).json(products);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Error fetching products' });
    }
}

/**---------------------------------
 *@desc Get Cunt
 *@router /app/posts/Cunt/
 * @method get
 --------------------------------*/
module.exports.getProductCountCtrl = async (req, res) => {

    try {
        const userId = req.params.id; // Make sure that userId is passed as a part of the request path
        const productCount = await Product.countDocuments({ user: userId });
        res.status(200).json(productCount);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Error counting products for the specified user' });
    }
}
/**---------------------------------
 *@desc searchProducts
 *@router /app/posts/Cunt/
 * @method get
 --------------------------------*/
module.exports.searchProducts = async (req, res) => {

    try {
        const { userId, searchTerm } = req.query;

        // التحقق من وجود معرف المستخدم ومصطلح البحث
        if (!userId || !searchTerm) {
            return res.status(400).json({ message: "User ID and search term are required." });
        }

        // البحث عن المنتجات التي تتطابق مع مصطلح البحث ومعرف المستخدم
        const products = await Product.find({
            user: userId,
            name: { $regex: searchTerm, $options: 'i' } // البحث بدون حساسية لحالة الأحرف
        });

        // إرجاع النتائج
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while searching for products." });
    }
}
/**---------------------------------
 *@desc Delete Post
 *@router /app/posts/:id
 * @method get
 --------------------------------*/
module.exports.deleteProductCtrl = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({message: "Product Not Found"})
        }
        console.log(product.user)
        if (req.userToken.isAdmin || req.userToken.id === product.user.toString()) {
            await Product.findByIdAndDelete(req.params.id)
            await cloudinaryRemoveImage(product.image.publicId)
            res.status(200).json(
                {
                    message: "Product Is deleted",
                    postId: product._id

                })
        } else {
            res.status(403).json({message: "access denied, forbidden"})

        }
    } catch (e) {
        console.log(e)
    }
}
/**---------------------------------
 *@desc Update Product
 *@router /app/posts/:id
 * @method put
 --------------------------------*/
module.exports.updateProductCtrl = async (req, res) => {
    try {
        // 1. Validation
        const {error} = validateUpdateProduct(req.body)
        if (error) {
            return res.status(400).json({message: error.details[0].message})
        }
        // 2. Get the post from DB and check if post exist
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                message: 'product not found'
            })
        }
        //3. check if this post belong to logged in
        if (req.userToken.id !== product.user.toString()) {
            return res.status(403).json({message: 'access denied, you are not allowed'});
        }
        // 4. Update post
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                qt: req.body.qt,
                PurchasingPrice: req.body.PurchasingPrice,
                description: req.body.description,
                category: req.body.category
            }
        }, {new: true}).populate("user")
        //5.
        res.status(200).json(updateProduct)
    } catch (e) {
        console.log(e)
    }
}
/**--------------------------------
 *@desc Update Imag Post
 *@router /api/posts/upload-image/:id
 * @method put
 --------------------------------*/
module.exports.uploadImageCtrl = async (req, res) => {
    try {
        // 1. Validation

        if (!req.file) {
            return res.status(400).json({message: "No Image Provided"})
        }
        // 2. Get the post from DB and check if post exist
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        //3. check if this post belong to logged in
        if (req.userToken.id !== product.user.toString()) {
            return res.status(403).json({message: 'access denied, you are not allowed'});
        }
        // 4. Remove old Image
        await cloudinaryRemoveImage(product.image.publicId)
        //5.Uplode Image
        const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
        const result = await cloudinaryUploadImage(imagePath)

        // 4. Update Product
        const updateImage = await Product.findByIdAndUpdate(req.params.id, {
            $set: {
                image: {
                    url: result.secure_url,
                    publicId: result.public_id
                }

            }
        }, {new: true}).populate("user")

        res.status(200).json(updateImage)
        fs.unlinkSync(imagePath)
    } catch (e) {
        console.log(e)
    }
}