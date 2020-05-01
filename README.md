# @graphql/runner

#### Download binary

```bash
wget https://github.com/Stradivario/graphql-runner/raw/master/dist/runner-linux
```

#### Give it permission to execute

```bash
chmod +x runner-linux
```

#### Start it

```bash
./runner-linux
```


```bash
./dist/runner-linux --wss ws://localhost:9000/subscriptions --runner-type runner
```

```graphql
mutation {
  execute(
    cmd: NGINX_SAVE_CONFIG
    args: {
      path: "./src"
      domain: "my.graphql.com"
      subDomain: "pesho"
      ip: "123"
    }
  ) {
    code
    data
    error
  }
}
```

```graphql
mutation {
  execute(
    cmd: NGINX_GENERATE_CONFIG
    args: { domain: "my.graphql.com", subDomain: "pesho", ip: "123" }
  ) {
    code
    data
    error
  }
}
```

```graphql
mutation {
  simulateNginxConfigGeneration(
    payload: {
      domain: "my.graphql.com"
      subDomain: "pesho"
      ip: "123"
    }
  ) {
    config
  }
  saveNginxConfiguration(
    path: "./src"
    payload: {
      domain: "my.graphql.com"
      subDomain: "pesho"
      ip: "123"
    }
  ) {
    config
  }
  removeNginxConfiguration(
    path: "./src"
    payload: { subDomain: "pesho" }
  ) {
    config
  }
}
```
