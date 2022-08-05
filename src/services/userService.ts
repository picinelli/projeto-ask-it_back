import throwError from "../utils/throwError.js";
import { getUserInfoById } from "../repositories/userRepository.js";

async function getUserInfo(userId: number) {
  const user = await getUserInfoById(userId);
  if (!user) throwError("User not found", 404);

  return user
}

export default {
  getUserInfo
}