"use client";
import { UserContext } from "@/contexts/UserContext";
import { getAllPosts } from "@/services/getAllPosts";
import React, { useContext, useEffect, useState } from "react";

enum TabKeys {
  AllPosts = "All Posts",
  MyPosts = "My Posts",
  LikedPosts = "Liked Posts",
  RepostedPosts = "Reposted Posts",
  Bookmarks = "Bookmarks",
}

const Tabs = () => {
  const { user, userPosts, setUserPosts } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState<TabKeys>(TabKeys.AllPosts);

  const tabs = [
    TabKeys.AllPosts,
    TabKeys.MyPosts,
    TabKeys.LikedPosts,
    TabKeys.RepostedPosts,
    TabKeys.Bookmarks,
  ];
  
  useEffect(
    () => {
      (async function() {
        if(user.username) {
          const allPosts = await getAllPosts(user.username); 
          setUserPosts(allPosts);
        }
        
      }())
    }, 
    [user.username]
  )

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-sm font-medium 
            ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeTab === TabKeys.AllPosts && (
          <div>{JSON.stringify(userPosts.allPosts)}</div>
        )}
        {activeTab === TabKeys.MyPosts && (
          <div>{JSON.stringify(userPosts.myPosts)}</div>
        )}
        {activeTab === TabKeys.LikedPosts && (
          <div>{JSON.stringify(userPosts.likedPosts)}</div>
        )}
        {activeTab === TabKeys.RepostedPosts && (
          <div>{JSON.stringify(userPosts.repostedPosts)}</div>
        )}
        {activeTab === TabKeys.Bookmarks && (
          <div>{JSON.stringify(userPosts.bookmarks)}</div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
