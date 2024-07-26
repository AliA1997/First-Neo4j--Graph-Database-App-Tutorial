//Define your a method based on the request method.

import { User } from "@/typings";
import { NextRequest, NextResponse } from "next/server";
//Import the neo4j driver to connect to our graph database
import { auth, driver } from "neo4j-driver";

// Define arguments only you use, for example if you just need the request you can just get the request.
async function POST(request: NextRequest) {
  // Define try and catch block catching all errors.
  try {
    //Get the Body of the request via the json method.
    const { username } = await request.json();

    //Instantiate the driver via connect uri, and instantiate an auth token via auth.basic(username, user pwd);
    const neo4jDriver = driver(
      process.env.NEO4J_URI!,
      auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PWD!)
    );

    //Instantiate a new session.
    const session = neo4jDriver.session();

    // Check if a user exists if it exists, creates the user.
    // Using the session, run your query and pass your username.
    // Use the MERGE keyword to get the user based on the username, if it doesn't exist, create it, when creating it assign the userId to a new Guid.
    const { records: users } = await session.run(
      `
                MERGE (u:User {username: $username})
                ON CREATE SET u.userId = randomUUID()
                RETURN u
            `,
      { username: username }
    );

    // All queries return an array, just get the first item of the array.
    //If their is a user, retrieves 'u' node from query, and get the properties of the node or record.
    const result: User = (
      users && users.length ? users[0].get("u").properties : {}
    ) as User;

    // Return the response which would return the created or returned user.
    // Which the result holds
    return NextResponse.json<User>(result);
  } catch (error) {
    // Records your logs error.
    console.error("Retrieve or Create user error:", error);
  }
}

export { POST };
