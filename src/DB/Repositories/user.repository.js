import User from "../model/user.model.js";
import BaseRepository from "./base.repository.js";



export default class UserRepository extends BaseRepository{

  constructor() {
    super(User)
  }

  findUserByEmail(email){
    return this.model.findOne({email})

  }
  findUserByIdAndUpdate(_id, updates, options) {
    return this.model.findByIdAndUpdate(_id, updates, options);
}
}