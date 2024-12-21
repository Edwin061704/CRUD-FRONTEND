const express = require("express");
const yup = require("yup");

const connection = require("./db"); // Importar la conexión a la base de datos

const router = express.Router();

// Esquema de validación para productos
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre del producto es obligatorio"),
  descripcion: yup.string().required("La descripción es obligatoria"),
  precio: yup
    .number()
    .positive("El precio debe ser un valor positivo")
    .required("El precio es obligatorio"),
  imagen: yup.string().url("La imagen debe ser una URL válida").required("La imagen es obligatoria"),
});

// Rutas

// Ruta raíz
router.get("/", function (req, res) {
  res.send("Hello World");
});

// Obtener todos los productos
router.get("/productos", function (req, res) {
  connection.query("SELECT * FROM productos", function (error, result) {
    if (error) {
      return res
        .status(404)
        .json({ mensaje: "Ha ocurrido un error al obtener los productos", error });
        }
    res.json(result);
  });
});

// Obtener un producto por ID
router.get("/producto/:id", function (req, res) {
  const { id } = req.params;
  const query = "SELECT * FROM productos WHERE id = ?";

  connection.query(query, [id], function (error, result) {
    if (error) {
      return res
        .status(400)
        .json({ mensaje: "Ha ocurrido un error al obtener el producto", error });
    }
    if (result.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json(result[0]);
  });
});

// Agregar un nuevo producto
router.post("/producto", async function (req, res) {
  const datos = req.body;

  try {
    const validData = await schema.validate(datos); // Validar el objeto con yup

    const query =
      "INSERT INTO productos (nombre,descripcion, precio, imagen) VALUES (?, ?, ?, ?)";

    connection.execute(query, Object.values(datos), function (error, result) {
      if (error) {
        return res.status(400).json({ mensaje: "Error al guardar el producto", error });
      }
      res.json({ mensaje: "Producto guardado", data: result });
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// Actualizar un producto
router.put("/producto/:id", async function (req, res) {
  const { id } = req.params;
  const datos = req.body;

  try {
    const validData = await schema.validate(datos); // Validar los datos del producto

    // Asegúrate de que validData contiene solo los campos necesarios
    const { nombre, descripcion, precio, imagen } = validData;

    const query =
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?";

    // Pasar solo los valores necesarios en el orden correcto
    const values = [nombre, descripcion, precio, imagen, id];
    console.log("Valores para actualizar: ", values);

    connection.execute(query, values, function (error, result) {
      if (error) {
        console.error("Error en la consulta: ", error);
        return res
          .status(400)
          .json({ mensaje: "Error al actualizar el producto", error });
      }
      res.json({ mensaje: "Producto actualizado", data: result });
    });
  } catch (error) {
    console.error("Error de validación: ", error);
    res.status(400).json({ mensaje: error.message });
  }
});

// Eliminar un producto
router.delete("/producto/:id", function (req, res) {
  const { id } = req.params;

  const query = "DELETE FROM productos WHERE id = ?";

  connection.execute(query, [id], function (error, result) {
    if (error) {
      return res
        .status(400)
        .json({ mensaje: "Error al eliminar el producto", error });
    }
    res.json({ mensaje: "Producto eliminado correctamente", data: result });
  });
});

module.exports = router;

