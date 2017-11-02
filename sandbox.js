var crypto = require('crypto')
  , text = ''
  , key = 'abcdeg'
  , hash

hash = crypto.createHmac('sha1', key).update(text).digest('hex')
