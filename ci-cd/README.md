# CI/CD

The utils is to support  the Monorepos CI/CD work-flow.  AS it's the monorepos,
we need to identify which service or project need to run which is wrapped by
`[` and `]`.  The following commit message or merge request title will trigger
the `logger-service` CI/CD.

```
[logger-service] Add new feature for event
```

By default, when new commit happen to the predefined branches (`main`, `develop`
and `test`), it will run the CI/CD for its project environment:

- `develop` branch for `dev` environment
- `test` branch for `test` environment
- `main` branch for `test` environment

By design, the development environment is happened only when the new commit is
made in the `develop` branch, otherwise, it will be run in `test` environment.
You can also add more branch to make it deploys as `test` environment, by
defining the list of branches in the `.build-deploy-rules` configuration.
The following will treat the `main`, `test` and `hello-world` branch to
be built and deploy for `test` environment:

```yml
.build-deploy-rules:
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"
    - if: $CI_COMMIT_BRANCH == "test"
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH == "hello-world"
```

> [!NOTE]
> For `production` environment, we need to do manaully with double confirmation.
> Double confirmation is to make sure we are sure in deploying into the production
> environment.

## Setting up

For setting up the CI/CD for new project, starting with `.gitlab-ci.yml` file. There
are stages from initialization to deployment. As it's the monorepos approach, the
initialization stage is to validate and study which project to be built and deployed.

- **Initialization**: This stag is to validate the environment variables.
- **Linting and Testing**: Tries to check the Linting and runs the unit test.
- **Building and Pushing**: Builds the image and push to image registry
- **Deploying**: Pulls the built image and deploys.

###  Prerequisite

By default we use `alpine:latest` image as based docker image. And, few tweek to make
the CI/CD suppor the monorepos architecture. And the following configuaration is
the first part of the stags.

```yml
image: alpine:latest

variables:
  CI_DEBUG_TRACE: "false"
  GIT_SUBMODULE_STRATEGY: recursive # For the submodule update
  GIT_SUBMODULE_DEPTH: 1 # The submodule depth

.build-deploy-rules:
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"
    - if: $CI_COMMIT_BRANCH == "test"
    - if: $CI_COMMIT_BRANCH == "main"

before_script:
  - apk add --no-cache --upgrade bash
  - export

stages:
  - init
  - linting-testing
  - build
  - deploy
```

### Initialization (`init`)

In the initialization stag, the it gets the application/project name
based on the commit message or merge request title. Once, it's merged or pushed
with new commit, this stag validates if the application defined or not.
If not defined, it cancel the operation. If it has application defined,
then it will generate the `build.env` file to store the building information
for the next step. The validation is operated by a script named `validate.sh`.
After validation is passed, the `APP`, `APP_DIR` and `APP_ENV` is written
in the `build.env` for next stag usage where.

- `APP`: The application name.
- `APP_DIR`: The application directory/folder.
- `APP_ENV`: The application environment.

```yml
init:
  stage: init
  script:
    - bash ${CI_PROJECT_DIR}/validate.sh
  artifacts:
    reports:
      dotenv: build.env
```

### Linting and Unit Test (`linting-testing`)

This stage might be different from project to project, because linting and unit testing
is diffirent for each project setup. So this part is recommended for only proper setup
application. Otherwise, it will break the CI/CD and skips the next stag.

```yaml
linting-testing:
  image: node:20.5.1-alpine
  stage: linting-testing
  dependencies:
    - init
  script:
    - echo "[INFO] Setting env file..."
    - cp apps/${APP}/env.example apps/${APP}/.env
    - ./bin/init apps/${APP}
    - npm run build
    - npm run eslint
    - npm run test
```

### Build and Push (`build-and-push`)

This stag gets information from the initialization stag as well to identify what
application to be built into what environment. And please note that, the build applies
only two branches (basically), which `develop` branch is for `develop` environment,
and `main` branch for `test` environment. Then we use the image built for `test`
environment promoted to higher environemt such as `staging` and `production`. This stag
is generated and operated by a script name `build.sh`. When the build is completed,
the build information is writen the `build.env` of the application folder, which will
be used for next stag.

```yml
build-and-push:
  stage: build
  image: docker:27.3.1-cli
  services:
    - docker:27.3.1-dind
  dependencies:
    - init
  rules:
    - !reference [.build-deploy-rules, rules]
  script:
    - echo "App env. ${APP_ENV}"
    - bash ${CI_PROJECT_DIR}/build.sh
  artifacts:
    reports:
      dotenv: ${APP_DIR}/build.env
```

Please remember that, to push image to the registry server, we need to login into that
registry first. Technically, once login, it will remember the authentication. But, to
make sure the authentication is not expired, we need to login every time before pushing.
And we need to register these information in the **CI/CD Environment Variables**. The
variables are:

- `REGISTRY_HOST`: The host/ip address of the registry without protocol.
- `REGISTRY_USER`: User name to login into the register
-` REGISTRY_PWD`: User's password to login into registry.

### Pull and Deploy (`deploy`)

After the build is succesfully done and pushed to registery server, this stag is triggered.
This stag is operated by a script name `deploy.sh`. The deployment will SSH into
specific server based on the environment using SSH public key. Then pull the
image and deploy. To make this works, we need to make the following
configurations are defined:

- **SSH Key**: As the communication between the deployment server (currently is the
  git-runner server) using passwordless SSH, so you need to generate the key pair
  (public and primary key) and register the public key to the deployment server 
  to the `authorized_keys` file located at `/home/ubuntu/.ssh/authorized_keys` for
  futher login. As the SSH login need to work with **SSH Private Key**, so keep your
  SSH Private Key at the **CI/CD Envionment Variable** and before SSH to the deployment
  server, write the SSH Private Key to the `~/.ssh/id_rs` file.

```yml
deploy:
  stage: deploy
  image: alpine:latest
  dependencies:
    - build-and-push
  rules:
    - !reference [.build-deploy-rules, rules]
  before_script:
    - apk add --no-cache openssh-client bash
    - eval $(ssh-agent -s)
  script:
    - bash ${CI_PROJECT_DIR}/deploy.sh
```
