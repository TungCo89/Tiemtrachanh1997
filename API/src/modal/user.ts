import UserRepository from "../repositories/user";

export class UserModal {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAll(): Promise<any> {
    const results = await this.userRepository.getAll();
    return results[0];
  }
  async getByID(id: number): Promise<any> {
    const results = await this.userRepository.getByID(id);
    return results[0];
  }
  async getRoles(): Promise<any> {
    const results = await this.userRepository.getRoles();
    return results[0];
  }
  async getUserByUserEmail(email: string): Promise<any> {
    const results = await this.userRepository.getUserByUserEmail(email);
    results[0];
  }
  async signup(user: any): Promise<any> {
    return await this.userRepository.signup(user);
  }
  async login(user: any): Promise<any> {
    return await this.userRepository.login(user);
  }
  async update(user: any): Promise<any> {
    return await this.userRepository.update(user);
  }
  async delete(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }
  async searchByKeyword(keyword: string): Promise<any[]> {
    return await this.userRepository.searchByKeyword(keyword);
  }
}

export default UserModal;
