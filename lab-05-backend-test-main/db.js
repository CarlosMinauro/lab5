require("dotenv").config();
const { Pool } = require("pg");

class Database {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    });
  }

  // Create
  async createUser(userData) {
    const query = `
            INSERT INTO users (name, email, created_at)
            VALUES ($1, $2, NOW())
            RETURNING *
        `;
    const values = [userData.name, userData.email];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  // Read
  async getUserById(id) {
    const query = `
            SELECT * FROM users
            WHERE id = $1
        `;

    try {
      const result = await this.pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Usuario no encontrado");
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  async getAllUsers() {
    const query = `
            SELECT * FROM users
            ORDER BY created_at DESC
        `;

    try {
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  // Update
  async updateUser(id, updateData) {
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const query = `
            UPDATE users
            SET ${setClause}, updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;

    const values = [id, ...Object.values(updateData)];

    try {
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error("Usuario no encontrado");
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  // Delete
  async deleteUser(id) {
    const query = `
            DELETE FROM users
            WHERE id = $1
            RETURNING *
        `;

    try {
      const result = await this.pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Usuario no encontrado");
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  // Método para cerrar la conexión
  async close() {
    await this.pool.end();
  }
}

module.exports = new Database();
