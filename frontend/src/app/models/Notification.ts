import {Post} from "./Post";
import {User} from "./User";

export interface Notification{
  id:number;
  type: string;
  from_user: User;
  post: Post;
  comment_text:string;
  created:Date;
}
