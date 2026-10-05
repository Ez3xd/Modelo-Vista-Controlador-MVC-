import { UserModel } from "../model/UserModel";
import { UserView } from "../view/UserView";

export class UserController {
  constructor(
    private readonly model: UserModel,
    private readonly view: UserView,
  ) {
    this.view.bindHandlers({
      onAddUser: (name, email) => this.addUser(name, email),
      onRemoveUser: (id) => this.removeUser(id),
    });
    this.model.subscribe((users) => this.view.renderUsers(users));
    this.view.renderUsers(this.model.getUsers());
  }

  private addUser(name: string, email: string): void {
    const result = this.model.addUser({ name, email });
    if (!result.success) {
      this.view.showMessage(result.message);
      return;
    }

    this.view.resetForm();
    this.view.showMessage(`${result.user.name} se agregó correctamente.`, false);
  }

  private removeUser(id: string): void {
    this.model.removeUser(id);
  }
}
