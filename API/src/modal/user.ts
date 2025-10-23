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
    const processed = results[0];
    return processed.length > 0 ? processed[0] : null;
  }
  async getRoles(): Promise<any> {
    const results = await this.userRepository.getRoles();
    return results[0];
  }
  async getUserByUserEmail(email: string): Promise<any> {
    return await this.userRepository.getUserByUserEmail(email);
  }
  async signup(user: any): Promise<any> {
    return await this.userRepository.signup(user);
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
