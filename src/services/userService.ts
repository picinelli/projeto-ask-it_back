import throwError from "../utils/throwError.js";
import { userRepository } from "../repositories/userRepository.js";

async function getUserInfo(userId: number) {
  const user = await userRepository.getUserInfoById(userId);
  if (!user) throwError("User not found", 404);

  return user
}

export default {
  getUserInfo
}