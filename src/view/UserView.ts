import type { User } from "../model/UserModel";

export interface UserViewHandlers {
  readonly onAddUser: (name: string, email: string) => void;
  readonly onRemoveUser: (id: string) => void;
}

export class UserView {
  // Guardamos las referencias para no tener que buscarlas de nuevo en cada evento.
  private readonly form = this.getElement<HTMLFormElement>("#user-form");
  private readonly nameInput = this.getElement<HTMLInputElement>("#user-name");
  private readonly emailInput = this.getElement<HTMLInputElement>("#user-email");
  private readonly formMessage = this.getElement<HTMLParagraphElement>("#form-message");
  private readonly userList = this.getElement<HTMLUListElement>("#user-list");
  private readonly userCount = this.getElement<HTMLSpanElement>("#user-count");
  private readonly emptyState = this.getElement<HTMLDivElement>("#empty-state");

  bindHandlers(handlers: UserViewHandlers): void {
    // La vista recoge los datos, pero deja que el controlador decida qué hacer.
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      handlers.onAddUser(this.nameInput.value, this.emailInput.value);
    });

    // Un solo listener en la lista sirve para todos los botones de eliminar.
    this.userList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest<HTMLButtonElement>("[data-remove-user]");
      const userId = button?.dataset.removeUser;
      if (userId) {
        handlers.onRemoveUser(userId);
      }
    });

    this.form.addEventListener("input", () => this.showMessage(""));
  }

  renderUsers(users: readonly User[]): void {
    // Se reconstruye la lista desde los datos actuales del modelo.
    this.userList.replaceChildren(...users.map((user) => this.createUserItem(user)));
    this.userCount.textContent = `${users.length} ${users.length === 1 ? "usuario" : "usuarios"}`;
    this.emptyState.hidden = users.length > 0;
  }

  resetForm(): void {
    this.form.reset();
    this.nameInput.focus();
  }

  showMessage(message: string, isError = true): void {
    this.formMessage.textContent = message;
    this.formMessage.classList.toggle("is-error", isError && message.length > 0);
    this.formMessage.classList.toggle("is-success", !isError && message.length > 0);
  }

  private createUserItem(user: User): HTMLLIElement {
    // Se crean los elementos con DOM APIs y textContent para mostrar texto sin interpretarlo como HTML.
    const item = document.createElement("li");
    item.className = "user-item";

    const avatar = document.createElement("span");
    avatar.className = "user-avatar";
    avatar.textContent = this.getInitials(user.name);
    avatar.setAttribute("aria-hidden", "true");

    const details = document.createElement("span");
    details.className = "user-details";

    const name = document.createElement("span");
    name.className = "user-name";
    name.textContent = user.name;

    const email = document.createElement("span");
    email.className = "user-email";
    email.textContent = user.email;

    details.append(name, email);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.dataset.removeUser = user.id;
    removeButton.setAttribute("aria-label", `Eliminar a ${user.name}`);
    removeButton.title = "Eliminar usuario";
    removeButton.textContent = "×";

    item.append(avatar, details, removeButton);
    return item;
  }

  private getInitials(name: string): string {
    // El avatar usa como máximo la primera letra de las dos primeras palabras.
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toLocaleUpperCase())
      .join("");
  }

  private getElement<T extends Element>(selector: string): T {
    // Fallamos pronto si el HTML no contiene algún elemento que la vista necesita.
    const element = document.querySelector<T>(selector);
    if (!element) {
      throw new Error(`No se encontró el elemento requerido: ${selector}`);
    }
    return element;
  }
}
