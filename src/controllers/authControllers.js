const { connection } = require("./../connection");
const {
  hashPass,
  transporter,
  createTokenRegister,
  createTokenAccess,
} = require("./../helpers");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");

module.exports = {
  register: async (req, res) => {
    const connDb = await connection.promise().getConnection();
    const { username, email, password } = req.body;

    try {
      let sql = `select * from users where username = ?`;
      let [dataUsername] = await connDb.query(sql, [username, email]);

      sql = `select * from users where email = ?`;
      let [dataEmail] = await connDb.query(sql, [email]);

      if (dataUsername.length || dataEmail.length) {
        throw { message: "User atau email sudah terdaftar" };
      }

      sql = `insert into users set ?`;
      let [dataRegister] = await connDb.query(sql, [
        { ...req.body, password: hashPass(password) },
      ]);

      sql = `select id, username, email, roles_id, is_verified  from users where id = ?`;
      let [dataUser] = await connDb.query(sql, [dataRegister.insertId]);

      let dataToken = {
        id: dataRegister.insertId,
        role_id: 2,
      };

      let dataLogin = {
        id: dataUser[0].id,
        username: dataUser[0].username,
        roles_id: dataUser[0].roles_id,
      };

      connDb.release();

      const token = createTokenRegister(dataToken);
      const accessToken = createTokenAccess(dataLogin);

      res.set("x-token-register", token);
      res.set("x-token-access", accessToken);

      // let filepath = path.resolve(
      //   __dirname,
      //   "../templates/emailVerifyUser.html"
      // );
      // let htmlString = fs.readFileSync(filepath, "utf-8");
      // const template = handlebars.compile(htmlString);
      // const htmlToEmail = template({ text: "Test", token });

      // transporter.sendMail({
      //   from: "Gangsar <gangsar45@gmail.com>",
      //   to: "gangsararyo@gmail.com",
      //   subject: "Testing email",
      //   html: htmlToEmail,
      // });

      return res.send({ ...dataUser[0], carts: [] });
    } catch (error) {
      connDb.release();
      return res.status(409).send({ message: error.message });
    }
  },

  login: async (req, res) => {
    const connDb = await connection.promise().getConnection();
    const { username, password } = req.query;

    try {
      let sql = `select id, username, email, roles_id, is_verified from users where username = ? and password = ?`;
      let [dataUser] = await connDb.query(sql, [username, hashPass(password)]);

      if (!dataUser.length) {
        throw { message: "User tidak ditemukan" };
      }

      sql = `select p.name, p.color, p.categories_id, p.price, p.sizes_id, p.stock, p.image, p.description from carts c
              join carts_details cd on c.id = cd.carts_id
              join products p on cd.products_id = p.id
              where c.is_checkout = 0 and c.users_id = ?`;
      let [dataCarts] = await connDb.query(sql, [dataUser[0].id]);

      const { id, roles_id, is_verified } = dataUser[0];

      let dataToken = {
        id,
        username: dataUser[0].username,
        roles_id,
        is_verified,
      };

      connDb.release();

      let token = createTokenAccess(dataToken);

      res.set("x-token-access", token);

      return res.send({ ...dataUser[0], carts: dataCarts });
    } catch (error) {
      connDb.release();
      return res.status(500).send({ message: error.message });
    }
  },

  keepLogin: async (req, res) => {
    const connDb = await connection.promise().getConnection();

    try {
      console.log(req.user);
      let sql = `select username, email, roles_id, is_verified  from users where id = ?`;
      let [dataUser] = await connDb.query(sql, [req.user.id]);

      sql = `select p.name, p.color, p.categories_id, p.price, p.sizes_id, p.stock, p.image, p.description from carts c
      join carts_details cd on c.id = cd.carts_id
      join products p on cd.products_id = p.id
      where c.is_checkout = 0 and c.users_id = ?`;
      let [dataCarts] = await connDb.query(sql, [req.user.id]);

      connDb.release();

      return res.send({ ...dataUser[0], carts: dataCarts });
    } catch (error) {
      connDb.release();
      return res.status(500).send(error.message);
    }
  },

  verifyEmail: async (req, res) => {
    try {
    } catch (error) {}
  },
};
