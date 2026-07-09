export async function fetchGithubMetadata(githubUrl: string) {
  try {
    const regex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = githubUrl.match(regex);
    if (!match) return null;

    const owner = match[1];
    const repo = match[2].replace(".git", "");
    
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    
    let commitsCount = 0;
    let lastCommitDate = null;

    try {
      const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`);
      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        if (commitsData && commitsData.length > 0) {
          lastCommitDate = commitsData[0].commit?.committer?.date || commitsData[0].commit?.author?.date || null;
        }
        const linkHeader = commitsRes.headers.get("link") || commitsRes.headers.get("Link");
        if (linkHeader) {
          const pageMatch = linkHeader.match(/page=(\d+)>;\s*rel="last"/);
          if (pageMatch) {
            commitsCount = parseInt(pageMatch[1], 10);
          } else {
            commitsCount = commitsData.length;
          }
        } else {
          commitsCount = commitsData.length;
        }
      }
    } catch (cErr) {
      console.error("Error fetching commits metadata:", cErr);
    }

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.subscribers_count,
      language: data.language,
      commits: commitsCount,
      lastCommit: lastCommitDate
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
