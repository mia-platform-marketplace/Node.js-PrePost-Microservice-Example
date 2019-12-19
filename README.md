# %CUSTOM_PLUGIN_SERVICE_NAME%

[![pipeline status][pipeline]][git-link]
[![coverage report][coverage]][git-link]

## Summary

%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%

## Local Development

To develop the service locally you need:
- Node 10+

To setup node, please if possible try to use [nvm][nvm], so you can manage
multiple versions easily. Once you have installed nvm, you can go inside
the directory of the project and simply run `nvm install`, the `.nvmrc` file
will install and select the correct version if you don’t already have it.

Once you have all the dependency in place, you can launch:
```shell
npm ci
npm run coverage
```

This two commands, will install the dependencies and run the tests with
the coverage report that you can view as an HTML page in
`coverage/lcov-report/index.html`.  
After running the coverage you can create your local copy of the default values
for the `env` variables needed for launching the application.
```shell
cp ./default.env ./local.env
```

From now on, if you want to change anyone of the default values for
the variables you can do it inside the `local.env` file without
pushing it to the remote repository.

Once you have all your dependency in place you can launch:
```shell
npm run start:local
```

After that you will have the service exposed on your machine.

## Notes

The first project build will fail because the `package-lock.json`
file is missing.

[pipeline]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/badges/master/pipeline.svg
[coverage]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/badges/master/coverage.svg
[git-link]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/commits/master

[nvm]: https://github.com/creationix/nvm
[merge-request]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/merge_requests
