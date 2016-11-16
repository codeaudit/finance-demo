'use strict'

module.exports = (client, sharedState) => {
  return client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log('Out of domain query')
      client.addResponse('app:response:name:state_out_of_domain')
      return 'init.proceed'
    },
  })
}
