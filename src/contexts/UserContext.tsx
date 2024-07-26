"use client";
import { PostToDisplay, User, UserContextState } from "@/typings";
import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext<UserContextState>({
  user: {
    userId: "",
    username: "",
  },
  userPosts: {
    allPosts: [],
    myPosts: [],
    repostedPosts: [],
    likedPosts: [],
    bookmarks: [],
  },
  setUser: (userToSet: User) => {},
  setUserPosts: (postsToSet: {
    allPosts: PostToDisplay[];
    myPosts: PostToDisplay[];
    repostedPosts: PostToDisplay[];
    likedPosts: PostToDisplay[];
    bookmarks: PostToDisplay[];
  }) => {},
});

// Create a provider component
export const UserProvider = ({ children }: React.PropsWithChildren<any>) => {
  const [user, setUser] = useState<User>({
    userId: "",
    username: "",
  });

  const [userPosts, setUserPosts] = useState<{
    allPosts: PostToDisplay[];
    myPosts: PostToDisplay[];
    repostedPosts: PostToDisplay[];
    likedPosts: PostToDisplay[];
    bookmarks: PostToDisplay[];
  }>({
    allPosts: [],
    myPosts: [],
    repostedPosts: [],
    likedPosts: [],
    bookmarks: [],
  });

  //FUnction to update user

  return (
    <UserContext.Provider value={{ user, userPosts, setUser, setUserPosts }}>
      {children}
    </UserContext.Provider>
  );
};
