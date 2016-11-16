'use strict'

module.exports = (client, sharedState) => {
  return client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('app:response:name:welcome/intro')
      client.updateConversationState({
        helloSent: true,
      })
      client.done()
    },
  })
}
