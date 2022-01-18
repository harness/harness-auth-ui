This repo contains code used in the [Harness CD Community Edition](https://github.com/harness/harness-cd-community) which is licensed under the PolyForm Shield License 1.0.0. This repo also contains code belonging to Harness CD Enterprise Plan which is licensed under the PolyForm Free Trial License 1.0.0. You may obtain a copy of these licenses in the [licenses](./licenses/) directory at the root of this repository.

# Harness Next Gen Auth UI

This repo contains the UI code for next-gen sign/signup flows.

### Getting Started

1. Install **NodeJS v14.16** or above. There are many ways to do this (**choose any one**):

   - Download relevant package from https://nodejs.org/download/release/v14.16.0/, unpack and install.
   - Use Homebrew: `brew install node@14.16`
   - If you already have Node installed, use `nvm` or `n` to install/select correct version. (see https://www.npmjs.com/package/n)

2. Install **yarn** package manager

```
$ brew install yarn
```

> Note: More options here: https://classic.yarnpkg.com/en/docs/install

3. Clone this repo

```
$ git clone git@github.com:harness/harness-auth-ui.git
$ cd harness-auth-ui
```

4. Install/Update/Refresh dependencies

```
$ yarn
```

> Note: This will take some time the first time you run it. Subsequent runs should be near-instant. Run this everytime you change branches or take a pull. If there are no dependency changes, this is practically a no-op.

> Note: This is a shorthand for the command `yarn install`. Read more here: https://classic.yarnpkg.com/en/docs/usage

5. Compile/Build the code **and** start the web-server in watch mode

```
$ yarn dev
```

> Note: This will start the local server in watch mode with hot reloading. Any code changes will trigger fast patch rebuilds and refresh the page in the browser.

[NextGen Setup and Onboarding Slides (With Troubleshoot section)](https://docs.google.com/presentation/d/1xGl8JJPzEVDz1yew6cz7ADOZ7J-geI0dXk159EgAauA/edit?usp=sharing)

### Publishing

```
$ yarn build
$ yarn docker <tagname>
```

First command will create a production build (minified, optimised).

Second command will create a docker image and _publish_ it to `harness/harness-auth-ui` GCR project.

### Utilities

Run lint checks

```
$ yarn lint
```

Run unit tests

```
$ yarn test
```

### Hotfix Process

1. Find out which release branch you need to hotfix. You can do that checking the currently deployed version in the environment you want to hotfix. For eg. For UAT environment, you can hit https://uat.harness.io/auth/static/version.json to get the currently deployed version. (eg. `0.53.4`)
2. Create a branch from the corresponding release branch (eg. `release/0.53.x`) which you want to hotfix
3. Commit your changes on your branch
4. Bump up the patch version in `package.json` (eg. 0.53.0 -> 0.53.1)
5. Raise PR with these changes
6. When this PR gets merged, this [Harness CIE pipeline](https://uat.harness.io/ng/#/account/sjmVqavzTuS1segZNyZqbA/ci/orgs/default/projects/ngauthui_PR_checks/pipelines/buildrelease/pipeline-studio/) will create a new build for you automatically
7. Please inform Ops/QE team to deploy your new build, especially in QA, UAT or prod environment.
8. Make sure to raise a PR with the same changes (minus the version bump) for `main` branch too. Otherwise your changes will get overriden with next deployment.
