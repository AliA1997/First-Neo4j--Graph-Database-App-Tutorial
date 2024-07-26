import { User } from "@/typings";

export async function retrieveOrCreateUser(newUser: User) {
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(newUser),
  });

  const createdUser = await res.json();

  return createdUser;
}
