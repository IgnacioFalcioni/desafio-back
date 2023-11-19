const express = require("express");
const bodyParser = require("body-parser");
const productsRouter = require("../src/routes/products.js");
const cartsRouter = require("../src/routes/carts.js");
const handlebars = require("express-handlebars").create({'defaultLayout':'./main'});
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const viewRouter = require("../src/routes/view.router.js");
const path = require("path");
const router = require ("../src/routes/view.router.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require('./routes/db.js');
const fileStore = require("session-file-store");
const handlebarsHelpers = require('handlebars-helpers')();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const check = require('express-validator');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(cookieParser());



app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../src/views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/view", viewRouter);
app.use("/", router );


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret:'secretCoder',

  resave:true,


  saveUninitialized:true
}));

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require(" ../controllers/usuarios"); 
const router = Router ();
 router.get('/', usuariosGet ); 
 router-put('/:id', [
   check('id', "No es un ID válido"). isMongoId(), 
   check( 'id') .custom( existeUsuarioPorId ), 
   check('rol') .custom( esRoleValido ),
    validarCampos
  ] ,usuariosPut ); 
  router.post('/',[
     check(' nombre', 'El nombre es obligatorio') .not () . isEmpty(), 
  check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }), 
  check(' correo' ,'El correo no es válido').isEmail (),
   check(' correo'). custom ( emailexiste), 
   
    check('rol').custom( esRoleValido ),
     validarCampos 
    ], usuariosPost );
    
    router .delete('/:id',[
       check('id', 'No es un ID válido'). isMongoId() ,
        check('id').custom( existeUsuarioPorId), 
        validarCampos 
      ],usuariosDelete ); 
      
router .patch('/' , usuariosPatch);

const users = [
  { id: 1, email: 'adminCoder@coder.com', password: 'adminCod3r123', role: 'admin' },
  { id: 2, email: 'usuario@ejemplo.com', password: 'usuario123', role: 'usuario' }
];

const checkAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

app.get('/login', (req, res) => {
  res.render('login'); 
});

app.post('/login', (req, res) => {
 

  
  req.session.user = { role: 'usuario' };  

  
  return res.redirect('/productos');
});

app.get('/productos', checkAuth, (req, res) => {
  const { users } = req.session;
  res.render('crear-producto', { users }); 
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/login');
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;


  const user = users.find(u => u.email === email);

  if (user) {
 
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.user = user;
      return res.redirect('/productos');
    }
  }

  return res.redirect('/login');
});




passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    const user = users.find(u => u.email === email);

    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  const user = users.find(u => u.email === email);
  done(null, user);
});

app.use(session({ secret: 'tu_secreto', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));



app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/realtimeproducts", (req, res) => {
  const productos = JSON.parse(
    fs.readFileSync("./src/routes/productos.json", "utf-8")
  );

  res.render("realTimeProducts", { productos });
});

io.on("connection", (socket) => {
  console.log("cliente conectado");
  socket.on("nuevo_producto", (producto) => {
    io.emit("producto_agregado", producto);
  });

  socket.on("eliminar_producto", (productoId) => {
    const index = productos.findIndex((p) => p.id === productoId);
    if (index !== -1) {
      const productoEliminado = productos.splice(index, 1)[0];
      io.emit("producto_eliminado", productoEliminado);

      io.to("realTimeProducts").emit(
        "producto_eliminado",
        productoEliminado.id
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("cliente desconectado");
  });
});





const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});