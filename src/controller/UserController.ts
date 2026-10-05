import { UserModel } from "../model/UserModel";
import { UserView } from "../view/UserView";

export class UserController {
  constructor(
    private readonly model: UserModel,
    private readonly view: UserView,
  ) {
    // La vista avisa al controlador cuando el usuario quiere agregar o eliminar.
    this.view.bindHandlers({
      onAddUser: (name, email) => this.addUser(name, email),
      onRemoveUser: (id) => this.removeUser(id),
    });

    // El modelo avisa cuando cambian los datos; el controlador pide redibujar la lista.
    this.model.subscribe((users) => this.view.renderUsers(users));
    this.view.renderUsers(this.model.getUsers());
  }

  private addUser(name: string, email: string): void {
    // Las reglas de validación están en el modelo, no en la vista.
    const result = this.model.addUser({ name, email });
    if (!result.success) {
      this.view.showMessage(result.message);
      return;
    }

    this.view.resetForm();
    this.view.showMessage(`${result.user.name} se agregó correctamente.`, false);
  }

  private removeUser(id: string): void {
    // La notificación del modelo hará que la vista muestre la lista sin este usuario.
    this.model.removeUser(id);
  }
}
