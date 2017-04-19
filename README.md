# webhook

构建流程图

![flow](https://cloud.githubusercontent.com/assets/2193211/25170520/7276e498-251d-11e7-8ced-38369c752c36.png)

### 准备工作

1. Travis Ci 的构建触发

https://github.com/acyortjs/acyortjs.github.io/issues/13

2. 获得 Travis Ci 的 api 访问 Token

```bash
# install travis
# https://github.com/travis-ci/travis.rb#installation
$ gem install travis

# login
# https://github.com/travis-ci/travis.rb#login
$ travis login

# token
# https://github.com/travis-ci/travis.rb#token
$ travis token
```

### 安装运行 webhook

需要 nodejs 环境，版本 `>= 7.6.0`

1. fork 或者下载这个项目，进入文件主目录运行

```bash
npm install
```

2. 项目配置

修改 config.yml，填入配置信息

```yml
# 密钥设置，自定义一个特殊值，后面在项目 webhook 填入
# https://github.com/.../.../settings/hooks
secret:

# 刚刚获取的 Travis Ci token
# https://github.com/travis-ci/travis.rb#token
token:

# 准备工作阶段设置的触发 Travis Ci 构建项目
# example: travis-ci/travis-core
repository:

# 触发构建项目分支
# example: master
branch:
```

3. 启动 webhook

```bash
node index.js
```

### 配置 GitHub webhook

进入你的 issue 内容项目，选择 setting，添加一个 webhook，具体配置

- Payload URL：填写你的 webhook 运行地址
- Content type：选择 `application/json`
- Secret：前面设置的密钥
- Which events would you like to trigger this webhook?：选择 `Let me select individual events.`，然后只勾选 `Issues`

保存你的设置，这时候当你更新 issue 时候，会触发 Travis Ci 构建，然后你的博客就自动更新了

