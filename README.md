# commit-standards

A Github App that verifies all commits in a PR follow the configured standards.

## Configuration

The standards enforced can be configured by the repo. Just add a `commit-standards.yml` file to the .`github` directory of the repo. 

```
# Each line of the file can contain a regex expression that a commit must match.
# Lines in a commit message that don't have a corresponding regex expression in
# the `commit-standards.yml` are not matched.
regexArray:
  - /^(?:feat|fix|docs|style|refactor|perf|test|chore|revert|demo|deprecate)(?:\(.+\))?: [^A-Z ].+[^\.]$/
  - /\n/
  - /description/
```

```
# You can add a link to where the commit standards configured here are documented
commitStandardsDocumentation: 'https://github.com/natashajokinen/commit-standards'
```

The default configured standards are the same as the [conventional commits definition](https://conventionalcommits.org/) with additional requirements that:
* the description is not capitalized
* the description does not end with a `.`
* the allowed types are listed below. Descriptions of each type are the same as [conventional commit types](https://github.com/commitizen/conventional-commit-types/blob/v3.0.0/index.json) or self-explanitory
  * `feat`
  * `fix`
  * `docs`
  * `style`
  * `refactor`
  * `perf`
  * `test`
  * `chore`
  * `revert`
  * `demo`
  * `deprecate`

## Contributing

If you have suggestions for how commit-standards could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 Natasha Jokinen <https://github.com/natashajokinen>
