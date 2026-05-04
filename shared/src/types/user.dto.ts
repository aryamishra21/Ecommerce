export type UserRole = "user" | "admin" | "seller";
export interface UserDto {
  id: string;
  name: string;
  email: string;
  password:string,
  role: UserRole;
  addresses:Array<string>;
  isEmailVerified: boolean;
  refreshToken:string;
  resetPasswordToken?:string,
  resetPasswordExpire?:Date
}
