'use strict'

module.exports = (client, sharedState) => {
  return client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:you_are_welcome')
      return client.done()
    },
  })
}
