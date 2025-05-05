import {Friend} from "./Friend";

export interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    bio: string;
    profile_pic: string;
    friends: Friend[];
  }

