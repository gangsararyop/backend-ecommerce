const { connection } = require("./../connection");
const fs = require("fs");

module.exports = {
  categories: async (req, res) => {
    const connDb = connection.promise();

    try {
      let sql = `select * from categories`;
      let [data] = await connDb.query(sql);

      return res.send(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  sizes: async (req, res) => {
    const connDb = connection.promise();

    try {
      let sql = `select * from sizes`;
      let data = await connDb.query(sql);

      return res.send(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  addProduct: async (req, res) => {
    const connDb = connection.promise();

    try {
      const path = "/products";
      const data = JSON.parse(req.body.data);

      const { name, categories_id, color, price, sizes_id, stock } = data;

      let imagePath = req.files.image
        ? `${path}/${req.files.image[0].filename}`
        : null;

      if (!name || !categories_id || !color || !price || !sizes_id || !stock) {
        if (imagePath) {
          fs.unlinkSync(".public" + imagePath);
        }

        return res.status(400).send({ message: "Kurang input data" });
      }

      let sql = `insert into products set ?`;
      await connDb.query(sql, {
        ...data,
        image: imagePath,
      });

      console.log("berhasil");

      return res.send({ message: "Berhasil menambahkan data" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },

  getProduct: async (req, res) => {
    const connDb = await connection.promise().getConnection();
    const { name, category, priceMin, priceMax, page, limit } = req.query;
    let offset = page * limit;

    try {
      let searchSql = "";

      if (name) {
        searchSql += ` and name like ${connDb.escape("%" + name + "%")}`;
      }
      if (category) {
        searchSql += ` and categories_id = ${connDb.escape(
          parseInt(category)
        )}`;
      }
      if (priceMin) {
        searchSql += ` and price >= ${connDb.escape(parseInt(priceMin))}`;
      }
      if (priceMax) {
        searchSql += ` and price <= ${connDb.escape(parseInt(priceMax))}`;
      }

      let sql = `select p.id, name, color, categories_id, c.category, price, sizes_id, s.size, stock, image, description from products p
      join categories c on p.categories_id = c.id
      join sizes s on p.sizes_id = s.id
      where is_delete = 0 ${searchSql}
      limit ?,?`;

      let [products] = await connDb.query(sql, [
        parseInt(offset),
        parseInt(limit),
      ]);

      sql = `select count(id) as total from products where true ${searchSql}`;
      let [totalProducts] = await connDb.query(sql);

      res.set("x-total-count", totalProducts[0].total);

      connDb.release();

      return res.send(products);
    } catch (error) {
      connDb.release();
      return res.status(500).send({ message: error.message });
    }
  },

  deleteProducts: async (req, res) => {
    const connDb = connection.promise();

    try {
      let sql = `update products set is_delete = 1 where id = ?`;
      await connDb.query(sql, [req.params.productsId]);

      res.send({ message: "Berhasil dihapus" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  editProducts: async (req, res) => {
    const connDb = connection.promise();

    try {
      const path = "/products";
      const data = JSON.parse(req.body.data);

      let imagePath = req.files.image
        ? `${path}/${req.files.image[0].filename}`
        : data.image;

      let sql = `update products set ? where id = ?`;
      await connDb.query(sql, [
        { ...data, image: imagePath },
        req.params.productsId,
      ]);

      res.send({ message: "Berhasil di-update" });
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  },
};

// input usename dan password
// mengecek apakah ada username yang sesuai input di dalam database
// jika ada berhasil login
// jika tidak ada maka ada peringatan dari tampilan
