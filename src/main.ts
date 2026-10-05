import { UserController } from "./controller/UserController";
import { UserModel } from "./model/UserModel";
import { UserView } from "./view/UserView";
import "./styles.css";

const model = new UserModel();
const view = new UserView();

new UserController(model, view);
