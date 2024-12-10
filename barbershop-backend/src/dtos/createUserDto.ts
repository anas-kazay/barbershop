export class CreateUserDto {
  name: string;

  email: string;

  password: string;

  constructor() {
    this.name = "";
    this.email = "";
    this.password = "";
  }
}
