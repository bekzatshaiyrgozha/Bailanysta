import {Comment} from './Comment';

export interface Post {
  id: number;
  body: string;
  image: string;
  created: string;
  userLiked: string[];
  comments: Comment [];
  user: string;
  likes:number;
}
