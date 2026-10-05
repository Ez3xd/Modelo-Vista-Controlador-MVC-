import { UserController } from "./controller/UserController";
import { UserModel } from "./model/UserModel";
import { UserView } from "./view/UserView";
import "./styles.css";

// Este archivo conecta las partes de MVC al iniciar la aplicación.
const model = new UserModel();
const view = new UserView();

// El controlador recibe las dos piezas y coordina sus acciones.
new UserController(model, view);
