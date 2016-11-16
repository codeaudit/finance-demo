'use strict'

module.exports = (client, sharedState) => {
  return client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      let currentGoalStream = client.getConversationState().currentGoalStream
      if (currentGoalStream) {
        console.log('Returning to previous goal stream:', currentGoalStream)
        return currentGoalStream
      }

      return 'init.proceed'
    },
  })
}
