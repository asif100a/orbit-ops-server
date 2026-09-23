import { UserModel } from "./user.model";

export class UserService {
    async findAll() {
        return UserModel.find()
    }

    async findById(id: string) {
        return UserModel.findById(id)
    }

    async myProfile(id: string) {
        return UserModel.findById(id).populate('-password')
    }
}