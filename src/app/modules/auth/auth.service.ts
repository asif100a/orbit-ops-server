export class AuthService {
  constructor() {}

  async register(input: any): Promise<any> {
    console.log("Input data: ", input);
  }

  async login(input: any): Promise<any> {}
}

export const authService = new AuthService();
