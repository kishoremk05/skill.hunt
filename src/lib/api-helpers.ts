export async function fetchGithubMetadata(githubUrl: string) {
  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubUrl.match(regex);
    if (!match) return null;

    const owner = match[1];
    const repo = match[2].replace(".git", "");
    
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.subscribers_count
    };
  } catch (err) {
    return null;
  }
}

export async function checkUrlHealth(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD", mode: "no-cors" });
    return true; 
  } catch (err) {
    return false; 
  }
}
