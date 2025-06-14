const Inventory = require("./inventory");

describe("Inventory System", () => {
  let inventory;

  beforeEach(() => {
    inventory = new Inventory();
    const mockDate = new Date("2023-01-01T00:00:00.000Z");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
  });

  describe("Add Product", () => {
    test("should add a new product successfully", () => {
      // PREPARAR
      // TODO: Crear un objeto producto con todos los campos requeridos
      const product = {
        id: 1,
        name: "Producto 1",
        price: 100,
        stock: 10,
        category: "Electrónica",
      };
      // EJECUTAR
      // TODO: Llamar al método addProduct
      const response = inventory.addProduct(product);
      // VALIDAR
      expect(response).toEqual({
        id: 1,
        name: "Producto 1",
        price: 100,
        category: "Electrónica",
        stock: 10,
        createdAt: new Date("2023-01-01T00:00:00.000Z"),
      });

      // TODO: Verificar que el producto se agregó correctamente
      expect(inventory.products).toEqual([
        {
          category: "Electrónica",
          createdAt: new Date("2023-01-01T00:00:00.000Z"),
          id: 1,
          name: "Producto 1",
          price: 100,
          stock: 10,
        },
      ]);

      // TODO: Verificar que se agregó la fecha de creación
      expect(response.createdAt).toEqual(new Date("2023-01-01T00:00:00.000Z"));
    });

    test("should throw error if payload does not have required fields", () => {
      // Prepare
      const payload = {
        id: 5,
        price: 100,
        category: "Electrónica",
      };

      // Execute
      expect(() => inventory.addProduct(payload)).toThrow(
        "El producto debe tener id, nombre, precio y categoría"
      );
    });

    test("should throw error if product already exists", () => {
      // PREPARAR
      const payload = {
        id: 1,
        name: "Producto 1",
        price: 100,
        category: "Electrónica",
      };

      const alreadyExistingProduct = {
        id: 1,
        name: "Producto 2",
        price: 300,
        category: "Hogar",
      };
      // Execute
      inventory.addProduct(alreadyExistingProduct);

      // Validate
      expect(() => inventory.addProduct(payload)).toThrow(
        "Ya existe un producto con este ID"
      );
    });

    test("should throw error if price is less than 0", () => {
      // Prepare
      const payload = {
        id: 1,
        name: "Producto 1",
        price: 0,
        category: "Electrónica",
      };

      // Execute
      expect(() => inventory.addProduct(payload)).toThrow(
        "El precio debe ser mayor que cero"
      );
    });
  });

  describe("Update Stock", () => {
    test("should update stock successfully", () => {
      // PREPARAR
      // TODO: Crear y agregar un producto con stock inicial
      const product = {
        id: 1,
        name: "Producto 1",
        price: 100,
        stock: 10,
        category: "Electrónica",
      };
      inventory.addProduct(product);

      // EJECUTAR
      // TODO: Actualizar el stock del producto
      const updatedProduct = inventory.updateStock(1, 5);

      // VALIDAR
      // TODO: Verificar que el stock se actualizó correctamente
      expect(updatedProduct.stock).toBe(15);

      // TODO: Verificar que se actualizó la fecha de modificación
      expect(updatedProduct.updatedAt).toEqual(new Date("2023-01-01T00:00:00.000Z"));
    });

    test("should not allow negative stock", () => {
      // PREPARAR
      // TODO: Crear y agregar un producto con stock inicial
      const product = {
        id: 1,
        name: "Producto 1",
        price: 100,
        stock: 10,
        category: "Electrónica",
      };
      inventory.addProduct(product);

      // EJECUTAR y VALIDAR
      // TODO: Verificar que se lanza el error correcto al intentar reducir el stock por debajo de cero
      expect(() => inventory.updateStock(1, -15)).toThrow(
        "No hay suficiente stock disponible"
      );
    });
  });

  describe("Get Products by Category", () => {
    test("should return products in category", () => {
      // PREPARAR
      // TODO: Crear y agregar varios productos de diferentes categorías
      const products = [
        {
          id: 1,
          name: "Producto 1",
          price: 100,
          stock: 10,
          category: "Electrónica",
        },
        {
          id: 2,
          name: "Producto 2",
          price: 200,
          stock: 5,
          category: "Electrónica",
        },
        {
          id: 3,
          name: "Producto 3",
          price: 300,
          stock: 8,
          category: "Hogar",
        },
      ];
      products.forEach(product => inventory.addProduct(product));

      // EJECUTAR
      // TODO: Obtener productos de una categoría específica
      const electronicProducts = inventory.getProductsByCategory("Electrónica");

      // VALIDAR
      // TODO: Verificar que se retornan solo los productos de la categoría solicitada
      expect(electronicProducts).toHaveLength(2);
      expect(electronicProducts.every(p => p.category === "Electrónica")).toBe(true);
    });

    test("should throw error for non-existent category", () => {
      // PREPARAR
      // TODO: Crear y agregar productos en categorías existentes
      const product = {
        id: 1,
        name: "Producto 1",
        price: 100,
        stock: 10,
        category: "Electrónica",
      };
      inventory.addProduct(product);

      // EJECUTAR y VALIDAR
      // TODO: Verificar que se lanza el error correcto al buscar una categoría inexistente
      expect(() => inventory.getProductsByCategory("CategoríaInexistente")).toThrow(
        "No se encontraron productos en esta categoría"
      );
    });
  });

  describe("Calculate Total Value", () => {
    test("should calculate total inventory value", () => {
      // PREPARAR
      // TODO: Crear y agregar varios productos con diferentes precios y cantidades
      const products = [
        {
          id: 1,
          name: "Producto 1",
          price: 100,
          stock: 10,
          category: "Electrónica",
        },
        {
          id: 2,
          name: "Producto 2",
          price: 200,
          stock: 5,
          category: "Electrónica",
        },
        {
          id: 3,
          name: "Producto 3",
          price: 300,
          stock: 8,
          category: "Hogar",
        },
      ];
      products.forEach(product => inventory.addProduct(product));

      // EJECUTAR
      // TODO: Calcular el valor total del inventario
      const totalValue = inventory.calculateTotalValue();

      // VALIDAR
      // TODO: Verificar que el cálculo del valor total es correcto
      // (100 * 10) + (200 * 5) + (300 * 8) = 1000 + 1000 + 2400 = 4400
      expect(totalValue).toBe(4400);
    });

    test("should return zero for empty inventory", () => {
      // PREPARAR
      // TODO: Asegurarse de que el inventario está vacío
      expect(inventory.products).toHaveLength(0);

      // EJECUTAR
      // TODO: Calcular el valor total del inventario
      const totalValue = inventory.calculateTotalValue();

      // VALIDAR
      // TODO: Verificar que el valor total es cero
      expect(totalValue).toBe(0);
    });
  });
});
