'use strict'

module.exports = (client, sharedState) => {
  return client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      const baseClassification = client.getMessagePart().classification.base_type.value
      if (baseClassification === 'reject_answer') {
        console.log('in getHelp because of reject answer')
        client.addResponse('app:response:name:error/request_polite_rephrase')
      } else {
        console.log('in getHelp')
        client.addResponse('app:response:name:provide_help/overview')
      }
      return client.done()
    },
  })
}
