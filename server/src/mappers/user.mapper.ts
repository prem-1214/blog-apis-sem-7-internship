import { UserDocument, UserResponseDTO } from "@/types/user.types";

export const userMapper = (user: UserDocument): UserResponseDTO => {
  return {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    // password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isAccountActive: user.isAccountActive,
    isEmailVarified: user.isEmailVarified,
    isGoogleLogedIn: user.isGoogleLogedIn,
    blogs: user.blogs,
    // accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
