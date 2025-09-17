import UserRepository from "../repositories/user";

export class UserModal {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAll(): Promise<any> {
    return await this.userRepository.getAll();
  }
  async getByID(id: number): Promise<any> {
    return await this.userRepository.getByID(id);
  }
  async getRoles(): Promise<any> {
    return await this.userRepository.getRoles();
  }
  async getByKhoaHoc(id: number): Promise<any> {
    return await this.userRepository.getByKhoaHoc(id);
  }
    async signup(user: any): Promise<any> {
    return await this.userRepository.signup(user);
  }
    async login(user:any): Promise<any> {
    return await this.userRepository.login(user);
  }
    async update(user:any): Promise<any> {
    return await this.userRepository.update(user);
  }
    async delete(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }
}

export default UserModal;
