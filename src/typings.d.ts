// Based on neo4j db
export interface Post {
  postId: string;
  text: string;
  username: string;
}

export interface User {
  userId: string;
  username: string;
}

export interface PostToDisplay {
  post: Post[];
  reposters: User[];
  likers: User[];
  type: string;
}

export type UserContextState = {
  user: User;
  userPosts: {
    allPosts: PostToDisplay[];
    myPosts: PostToDisplay[];
    repostedPosts: PostToDisplay[];
    likedPosts: PostToDisplay[];
    bookmarks: PostToDisplay[];
  };
  setUser: (userToSet: User) => void;
  setUserPosts: (postsToSet: {
    allPosts: PostToDisplay[];
    myPosts: PostToDisplay[];
    repostedPosts: PostToDisplay[];
    likedPosts: PostToDisplay[];
    bookmarks: PostToDisplay[];
  }) => void;
};
