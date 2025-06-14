const db = require("./db");

// Mock de pg
jest.mock("pg", () => {
  const mockPool = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return {
    Pool: jest.fn(() => mockPool),
  };
});

describe("Database CRUD Operations", () => {
  let mockUser;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();

    // Datos de usuario de ejemplo
    mockUser = {
      id: 1,
      name: "Juan Pérez",
      email: "juan@example.com",
      created_at: new Date(),
      updated_at: null,
    };
  });

  // Cerrar la conexión después de todas las pruebas
  afterAll(async () => {
    await db.close();
  });

  describe("Create User", () => {
    test("debería crear un nuevo usuario correctamente", async () => {
      // PREPARAR
      const userData = {
        name: mockUser.name,
        email: mockUser.email,
      };
      db.pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      // EJECUTAR
      const newUser = await db.createUser(userData);

      // VALIDAR
      expect(db.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        [userData.name, userData.email]
      );
      expect(newUser).toEqual(mockUser);
    });

    test("debería manejar errores al crear usuario", async () => {
      // PREPARAR
      const userData = {
        name: "Otro Usuario",
        email: "juan@example.com",
      };
      db.pool.query.mockRejectedValueOnce(new Error("Error de duplicación"));

      // EJECUTAR y VALIDAR

      await expect(db.createUser(userData)).rejects.toThrow(
        "Error al crear usuario: Error de duplicación"
      );
    });
  });

  describe("Read Users", () => {
    test("debería obtener un usuario por ID", async () => {
      // PREPARAR
      db.pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      // EJECUTAR
      const foundUser = await db.getUserById(1);

      // VALIDAR
      expect(db.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM users"),
        [1]
      );
      expect(foundUser).toEqual(mockUser);
    });

    test("debería lanzar error al buscar usuario inexistente", async () => {
      // PREPARAR
      db.pool.query.mockResolvedValueOnce({ rows: [] });

      // EJECUTAR y VALIDAR
      await expect(db.getUserById(999)).rejects.toThrow(
        "Usuario no encontrado"
      );
    });

    test("debería obtener todos los usuarios", async () => {
      // PREPARAR
      const mockUsers = [
        mockUser,
        { ...mockUser, id: 2, email: "otro@example.com" },
      ];
      db.pool.query.mockResolvedValueOnce({ rows: mockUsers });

      // EJECUTAR
      const allUsers = await db.getAllUsers();

      // VALIDAR
      expect(db.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM users")
      );
      expect(allUsers).toEqual(mockUsers);
    });
  });

  describe("Update User", () => {
    test("debería actualizar un usuario existente", async () => {
      // PREPARAR
      const updatedUser = {
        ...mockUser,
        name: "Juan Pérez Actualizado",
        updated_at: new Date(),
      };
      const updateData = { name: "Juan Pérez Actualizado" };
      db.pool.query.mockResolvedValueOnce({ rows: [updatedUser] });

      // EJECUTAR
      const result = await db.updateUser(1, updateData);

      // VALIDAR
      expect(db.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE users"),
        expect.arrayContaining([1, updateData.name])
      );
      expect(result).toEqual(updatedUser);
    });

    test("debería lanzar error al actualizar usuario inexistente", async () => {
      // PREPARAR
      db.pool.query.mockResolvedValueOnce({ rows: [] });

      // EJECUTAR y VALIDAR
      await expect(
        db.updateUser(999, { name: "Nuevo Nombre" })
      ).rejects.toThrow("Usuario no encontrado");
    });
  });

  describe("Delete User", () => {
    test("debería eliminar un usuario existente", async () => {
      // PREPARAR
      db.pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      // EJECUTAR
      const deletedUser = await db.deleteUser(1);

      // VALIDAR
      expect(db.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM users"),
        [1]
      );
      expect(deletedUser).toEqual(mockUser);
    });

    test("debería lanzar error al eliminar usuario inexistente", async () => {
      // PREPARAR
      db.pool.query.mockResolvedValueOnce({ rows: [] });

      // EJECUTAR y VALIDAR
      await expect(db.deleteUser(999)).rejects.toThrow("Usuario no encontrado");
    });
  });
});
