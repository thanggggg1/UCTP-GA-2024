import { EUserRoles } from "@/enums/user.enum";
import { ESlugError } from "../enums/auth.enum";

export interface LoginParams {
  email: string;
  password: string;
}
export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  role?: EUserRoles;
  universityName: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IUserLogin {
  created_at: string;
  email: string;
  name: string;
  password_changed_at: string;
  username: string;
}
export interface IResponseDataError {
  slug: ESlugError;
  HttpStatus: number;
}
export interface IResponseError {
  status: number;
  data: IResponseDataError;
}
// {
//     "ID": 1,
//     "Name": "Thang pro",
//     "Email": "thanglun077@gmail.com",
//     "Password": "$2a$10$n3gXN.zdC5Hc6xb3MXg/6OwxoDPdjnKEE8duhNLOmHro5XrK6px42",
//     "Role": "",
//     "UniversityID": "1",
//     "University": {
//         "ID": 0,
//         "Name": "",
//         "Address": ""
//     }
// }
export interface ICurrentUser {
  ID: number;
  Name: string;
  Email: string;
  Password: string;
  Role: string;
  UniversityID: string;
  University: {
    ID: number;
    Name: string;
    Address: string;
  };
}
