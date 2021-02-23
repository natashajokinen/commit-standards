# commit-standards

A Github App that verifies all commits in a PR follow the configured standards.

## Configuration

The standards enforced can be configured by the repo. Just add a `commit-standards.yml` file to the .`github` directory of the repo. Each line of the `commit-standards.yml` file can contain a regex expression that a commit must match. Lines in a commit message that don't have a corresponding regex expression in the `commit-standards.yml` are not matched.

## Contributing

If you have suggestions for how commit-standards could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 Natasha Jokinen <https://github.com/natashajokinen>
