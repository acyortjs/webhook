const fs = require('fs')
const content = `
# GitHub secret
# https://github.com/.../.../settings/hooks
secret:

# Travis Ci token
# https://github.com/travis-ci/travis.rb#token
token:

# repository
# example: travis-ci/travis-core
repository:

# branch
# example: master
branch:
`

fs.writeFile('./config.yml', content, err => {
  if (err) {
    return console.log(err)
  }
  console.log('Configure "config.yml" to start the server')
})