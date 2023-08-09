import fs from "fs";

class ProductManager {

    constructor() {
        this.products = [];
        this.id = 0;
        this.path = 'products.txt';
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if (fs.existsSync(this.path)) {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                const productsArray = JSON.parse(data);
                let productId = productsArray.length;

                if (!title || !description || !price || !thumbnail || !code || !stock) {
                    return console.log("Incomplete field")
                } else {
                    
                    const product = {
                        id: productId + 1,
                        title: title,
                        description: description,
                        price: price,
                        code: code,
                        thumbnail: thumbnail,
                        stock: stock,
                    };

                    if (productsArray.some(prod => prod.code === product.code)) {
                        return console.log({ status: 'error', message: 'the product already exists' })
                    } else {
                        productsArray.push(product);
                        await fs.promises.writeFile(this.path, JSON.stringify(productsArray, null, 2));
                        return productsArray;
                    }
                }

            } else {
                if (!title || !description || !price || !thumbnail || !code || !stock) {
                    return console.log("Incomplete field")
                } else {
                    
                    const product = {
                        id: 1,
                        title: title,
                        description: description,
                        price: price,
                        code: code,
                        thumbnail: thumbnail,
                        stock: stock,
                    };

                    await fs.promises.writeFile(this.path, JSON.stringify([product], null, 2));
                    return product;
                }
            }

        } catch (err) {
            console.log(err);
        }

    }

    async getProducts() {
        try {
            let data = await fs.promises.readFile(this.path, 'utf-8');
            let productsArray = JSON.parse(data);
            return { product: productsArray };
        } catch (err) {
            return { status: 'error', message: 'no products found' }
        }
    }

    async getProductById(id) {
        try {
            let data = await fs.promises.readFile(this.path, 'utf-8');
            let productsArray = JSON.parse(data);
            let product = productsArray.find(prod => parseInt(prod.id) === parseInt(id))
            if (product) {
                return { product: product };
            } else {
                return { status: 'error', message: 'the product was not found', product: null }
            }
        } catch (err) {
            return { status: 'error', message: 'the product was not found' };
        }
    }

    async updateProduct(id, obj) {
        let dataObj = {
            id: id,
            title: obj.title,
            description: obj.description,
            price: obj.price,
            code: obj.code,
            thumbnail: obj.thumbnail,
            stock: obj.stock,
        }
        try {
            let data = await fs.promises.readFile(this.path, 'utf-8');
            let productsArray = JSON.parse(data);
            let products = productsArray.filter(prod => parseInt(prod.id) !== parseInt(id));
            products.push(dataObj);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
            return { product: products, message: 'product upgrade successfully' }
        } catch (err) {
            return { status: 'error', message: 'the product was not found' }
        }
    }

    async deleteProduct(id) {
        try {
            let data = await fs.promises.readFile(this.path, 'utf-8');
            let productsArray = JSON.parse(data);
            let product = productsArray.filter(prod => parseInt(prod.id) !== parseInt(id));
            await fs.promises.writeFile(this.path, JSON.stringify(product, null, 2));
            return { product: product, message: 'product removed successfully' }
        } catch (err) {
            return { status: 'error', message: 'the product was not found' }
        }
    }

}

export default ProductManager;