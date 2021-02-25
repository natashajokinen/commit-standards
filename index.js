
const DEFAULT_OPTIONS = {
  allowMergeCommits: true,
  commitStandardsDocumentation: 'https://github.com/natashajokinen/commit-standards',
  regexArray: ['^(?:feat|fix|docs|style|refactor|perf|test|chore|revert|demo|deprecate)(?:\(.+\))?: [^A-Z ].+[^\.]$'],
};

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.on(['pull_request.opened', 'pull_request.synchronize'], async (context) => {
      const userConfig = await context.config('commit-standards.yml');
      let {allowMergeCommits, commitStandardsDocumentation, regexArray} = Object.assign({}, DEFAULT_OPTIONS, userConfig);
      regexArray = regexArray.map((regex)=> new RegExp(regex));

      const pullRequestObj = context.repo({
        pull_number: context.payload.pull_request.number
      });
      const commitInfo = await context.octokit.pulls.listCommits(pullRequestObj);
      const commits = commitInfo.data;
      const {areCommitsStandard, invalidCommit = ''} = verifyCommits(commits, regexArray, allowMergeCommits);

      const status = {
        sha: context.payload.pull_request.head.sha,
        state: areCommitsStandard ? 'success' : 'failure',
        description: areCommitsStandard ? 'Commits are following standards' : `Commit ${invalidCommit} doesn't follow commit standards.`,
        context: 'Following Commit Standards',
        target_url: commitStandardsDocumentation,
      };
      const result = await context.octokit.repos.createCommitStatus(context.repo(status));
      return result;
    }
  );
};

function verifyCommits(commits, regexArray, allowMergeCommits) {
  let invalidCommit;
  const areCommitsStandard = commits.map(fullCommit => fullCommit.commit).every((commit, index) => {
    const matches = matchesStandards(commit.message, regexArray, allowMergeCommits);
    if (!matches) {
      invalidCommit = commits[index].sha.slice(0,7);
    };
    return matches;
  });
  return {
    areCommitsStandard,
    invalidCommit,
  };
};

function matchesStandards(message, regexArray, allowMergeCommits) {
  const messageLines = message.split(/\r?\n/);
  if (allowMergeCommits && messageLines[0].slice(0,5) === 'Merge') {
    return true;
  }
  return regexArray.every((regex, index) => {
    return regex.test(messageLines[index]);
  });
};
