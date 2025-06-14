class Inventory {
  constructor() {
    this.products = [];
  }

  addProduct(product) {
    // Validar que el producto tenga los campos requeridos
    if (!product.id || !product.name || !product.category) {
      throw new Error("El producto debe tener id, nombre, precio y categoría");
    }

    // Validar que no exista un producto con el mismo ID
    if (this.products.some((p) => p.id === product.id)) {
      throw new Error("Ya existe un producto con este ID");
    }

    // Validar que el precio sea positivo
    if (product.price <= 0) {
      throw new Error("El precio debe ser mayor que cero");
    }

    // Agregar stock inicial si no se proporciona
    const newProduct = {
      ...product,
      stock: product.stock || 0,
      createdAt: new Date(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  updateStock(productId, quantity) {
    const productIndex = this.products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }

    const newStock = this.products[productIndex].stock + quantity;

    if (newStock < 0) {
      throw new Error("No hay suficiente stock disponible");
    }

    this.products[productIndex].stock = newStock;
    this.products[productIndex].updatedAt = new Date();

    return this.products[productIndex];
  }

  getProductsByCategory(category) {
    if (!category) {
      throw new Error("La categoría es requerida");
    }

    const products = this.products.filter((p) => p.category === category);

    if (products.length === 0) {
      throw new Error("No se encontraron productos en esta categoría");
    }

    return products;
  }

  calculateTotalValue() {
    return this.products.reduce((total, product) => {
      return total + product.price * product.stock;
    }, 0);
  }

  // Métodos adicionales útiles
  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  }

  getLowStockProducts(threshold = 5) {
    return this.products.filter((p) => p.stock < threshold);
  }

  removeProduct(productId) {
    const productIndex = this.products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }

    const removedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);

    return removedProduct;
  }
}

module.exports = Inventory;
