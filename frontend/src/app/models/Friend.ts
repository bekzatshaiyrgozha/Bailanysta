export interface Friend {
  id: number;
  username: string;
  profile_pic: string;
}
export interface FriendStatus {
  is_friend: boolean;
  friend_request_sent: boolean;
  friend_request_received: boolean;
}
