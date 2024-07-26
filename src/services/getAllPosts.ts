export async function getAllPosts(username: string) {
  const res = await fetch(`/api/posts?username=${username}`, {
    method: "GET",
  });

  const allPosts = await res.json();

  return allPosts;
}
