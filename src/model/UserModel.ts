export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

// Datos que vienen del formulario; el id lo crea el modelo.
export interface NewUser {
  readonly name: string;
  readonly email: string;
}

// Así el controlador puede distinguir un alta correcta de un error.
export type AddUserResult =
  | { readonly success: true; readonly user: User }
  | { readonly success: false; readonly message: string };

export type UsersChangedListener = (users: readonly User[]) => void;

export class UserModel {
  private users: User[] = [];
  private readonly listeners = new Set<UsersChangedListener>();

  getUsers(): readonly User[] {
    // Devolvemos copias para que quien consulte la lista no cambie el estado interno.
    return this.users.map((user) => ({ ...user }));
  }

  subscribe(listener: UsersChangedListener): () => void {
    this.listeners.add(listener);
    // La función que regresamos sirve para dejar de escuchar los cambios.
    return () => this.listeners.delete(listener);
  }

  addUser(input: NewUser): AddUserResult {
    // Quitamos espacios y guardamos el correo en minúsculas para comparar bien.
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (name.length === 0) {
      return { success: false, message: "Escribe el nombre del usuario." };
    }

    if (name.length > 80) {
      return { success: false, message: "El nombre no puede superar los 80 caracteres." };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: "Escribe un correo electrónico válido." };
    }

    if (this.users.some((user) => user.email === email)) {
      return { success: false, message: "Ya existe un usuario con ese correo electrónico." };
    }

    // El usuario se agrega solo después de pasar todas las validaciones.
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
    };

    this.users = [...this.users, user];
    this.notifyListeners();
    return { success: true, user: { ...user } };
  }

  removeUser(id: string): boolean {
    const remainingUsers = this.users.filter((user) => user.id !== id);
    if (remainingUsers.length === this.users.length) {
      // Si no encontramos el id, no hubo cambios que avisar.
      return false;
    }

    this.users = remainingUsers;
    this.notifyListeners();
    return true;
  }

  private isValidEmail(email: string): boolean {
    // Comprobación sencilla para esta práctica; no reemplaza una validación real de correo.
    return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private notifyListeners(): void {
    // Cada suscriptor recibe la lista actualizada cuando cambia el modelo.
    const snapshot = this.getUsers();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}
