const axios = require("axios");

async function getTotalLinesOfCode(username, token) {
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  const reposUrl = `https://api.github.com/users/${username}/repos`;
  const reposResponse = await axios.get(reposUrl, { headers });

  if (reposResponse.status !== 200) {
    throw new Error(`Error fetching repositories: ${reposResponse.status}`);
  }

  const repos = reposResponse.data;
  let totalLines = 0;

  for (const repo of repos) {
    const repoName = repo.name;
    const languagesUrl = `https://api.github.com/repos/${username}/${repoName}/languages`;
    const languagesResponse = await axios.get(languagesUrl, { headers });

    if (languagesResponse.status !== 200) {
      throw new Error(`Error fetching languages for ${repoName}: ${languagesResponse.status}`);
    }

    const languages = languagesResponse.data;
    const repoLines = Object.values(languages).reduce((acc, lines) => acc + lines, 0);
    totalLines += repoLines;
    console.log(`${repoName}: ${repoLines} lines`);
  }

  console.log(`Total lines of code: ${totalLines}`);
}

//START WITH OUR DATA
getTotalLinesOfCode("your_username", "your_token").catch((error) => console.error(error));
