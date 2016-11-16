'use strict'

module.exports = (client, sharedState) => {
  return client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('Bye')
      client.done()
    },
  })
}
