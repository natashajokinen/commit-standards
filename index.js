
const DEFAULT_OPTIONS = {
  regexArray: [/^(?:feat|fix|docs|style|refactor|perf|test|chore|revert|demo|deprecate)(?:\(.+\))?: [^A-Z ].+[^\.]$/],
  commitStandardsDocumentation: 'https://github.com/natashajokinen/commit-standards',
};

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.on(['pull_request.opened', 'pull_request.synchronize'], async (context) => {
      //TODO write getConfig
      // const userConfig = await getConfig(context, 'commit-standards.yml', {});
      // const {regexArray} = Object.assign({}, DEFAULT_OPTIONS, userConfig);
      const {commitStandardsDocumentation, regexArray} = Object.assign({}, DEFAULT_OPTIONS);

      const pullRequestObj = context.repo({
        pull_number: context.payload.pull_request.number
      });
      const commitInfo = await context.octokit.pulls.listCommits(pullRequestObj);
      const commits = commitInfo.data;
      const areCommitsStandard = verifyCommits(commits, regexArray);

      const status = {
        sha: context.payload.pull_request.head.sha,
        state: areCommitsStandard ? 'success' : 'failure',
        description: areCommitsStandard ? 'commits are following standards' : 'every commit needs to follow commit standards',
        context: 'Following Commit Standards',
        target_url: commitStandardsDocumentation,
      };
      const result = await context.octokit.repos.createCommitStatus(context.repo(status));
      return result;
    }
  );
};

function verifyCommits(commits, regexArray) {
  return commits.map(fullCommit => fullCommit.commit).every(commit => matchesStandards(commit.message, regexArray));
};

function matchesStandards(message, regexArray) {
  const messageLines = message.split(/\r?\n/);
  return regexArray.every((regex, index) => {
    return regex.test(messageLines[index]);
  });
};
