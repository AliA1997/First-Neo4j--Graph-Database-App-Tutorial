//Define your a method based on the request method.
import { NextRequest, NextResponse } from "next/server";
//Import the neo4j driver to connect to our graph database
import { auth, driver } from "neo4j-driver";
import { PostToDisplay } from "@/typings";

// Define arguments only you use, for example if you just need the request you can just get the request.
async function GET(request: NextRequest) {
  // Define try and catch block catching all errors.
  try {
    // Get the username from the query string.
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) throw new Error("Username not passed into query string.");

    //Instantiate the driver via connect uri, and instantiate an auth token via auth.basic(username, user pwd);
    const neo4jDriver = driver(
      process.env.NEO4J_URI!,
      auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PWD!)
    );

    //Instantiate a new session.
    const session = neo4jDriver.session();

    // Use our union statement defined earlier, that will get posts.
    const { records: postResult } = await session.run(
      `
        MATCH (post:Post)
        OPTIONAL MATCH (post)-[:REPOSTED]->(reposter:User)
        OPTIONAL MATCH (post)-[:LIKED]->(liker:User)
        WITH post, COLLECT(DISTINCT reposter) AS reposters, COLLECT(DISTINCT liker) AS likers, "all" as type
        RETURN post, reposters, likers, type
        SKIP 0
        LIMIT 100

        UNION

        MATCH (u:User {username: $username})
        MATCH (post:Post {username: u.username})
        OPTIONAL MATCH (post)-[:REPOSTED]->(reposter:User)
        OPTIONAL MATCH (post)-[:LIKED]->(liker:User)
        WITH post, COLLECT(DISTINCT reposter) AS reposters, COLLECT(DISTINCT liker) AS likers, "user" as type
        RETURN post, reposters, likers, type
        SKIP 0
        LIMIT 100

        UNION

        // Bookmarked Tweets
        MATCH (u:User {username: $username})
        MATCH (post:Post)
        WHERE (u)-[:BOOKMARKED]->(post)
        OPTIONAL MATCH (post)-[:REPOSTED]->(reposter:User)
        OPTIONAL MATCH (post)-[:LIKED]->(liker:User)
        WITH post, COLLECT(DISTINCT reposter) AS reposters, COLLECT(DISTINCT liker) AS likers, "bookmarked" as type
        RETURN post, reposters, likers, type
        SKIP 0
        LIMIT 100

        UNION

        // Liked Tweets
        MATCH (u:User {username: $username})
        MATCH (post:Post)
        WHERE (u)-[:LIKES]->(post)
        OPTIONAL MATCH (post)-[:REPOSTED]->(reposter:User)
        OPTIONAL MATCH (post)-[:LIKED]->(liker:User)
        WITH post, COLLECT(DISTINCT reposter) AS reposters, COLLECT(DISTINCT liker) AS likers, "liked" as type
        RETURN post, reposters, likers, type
        SKIP 0
        LIMIT 100

        UNION

        // Reposted Tweets
        MATCH (u:User {username: $username})
        MATCH (post:Post)
        WHERE (u)-[:REPOSTS]->(post)
        OPTIONAL MATCH (post)-[:REPOSTED]->(reposter:User)
        OPTIONAL MATCH (post)-[:LIKED]->(liker:User)
        WITH post, COLLECT(DISTINCT reposter) AS reposters, COLLECT(DISTINCT liker) AS likers, "reposted" as type
        RETURN post, reposters, likers, type
        SKIP 0
        LIMIT 100
            `,
      { username: username }
    );
    const mappedPostResult = postResult.length ? postResult.map(pr => ({
        post: pr.get('post').properties,
        reposters: pr.get('reposters').map((rp: any) => rp.properties),
        likers: pr.get('likers').map((rp: any) => rp.properties),
        type: pr.get('type')
    } as PostToDisplay)) : [];


    // Return the response which would return the all posts.
    // Which the mappedResult holds
    return NextResponse.json<{
        allPosts: PostToDisplay[];
        myPosts: PostToDisplay[];
        repostedPosts: PostToDisplay[];
        likedPosts: PostToDisplay[];
        bookmarks: PostToDisplay[];
      }>({
        allPosts: mappedPostResult.slice().filter(p => p.type === 'all'),
        myPosts: mappedPostResult.slice().filter(p => p.type === 'user'),
        repostedPosts: mappedPostResult.slice().filter(p => p.type === 'reposted'),
        likedPosts: mappedPostResult.slice().filter(p => p.type === 'liked'),
        bookmarks: mappedPostResult.slice().filter(p => p.type === 'bookmarked'),
      });
  } catch (error) {
    // Records your logs error.
    console.error("Retrieve  posts error:", error);
  }
}

export { GET };
