routerAdd(
  'GET',
  '/backend/v1/agent-messages/{conversationId}',
  (e) => {
    try {
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('Autenticação necessária')

      const convId = e.request.pathValue('conversationId')
      if (!convId) return e.badRequestError('ID da conversa é obrigatório')

      const history = $ai.agent('self-care-guide').listMessages({
        conversation_id: convId,
        user_id: userId,
      })

      return e.json(200, history)
    } catch (err) {
      if (err instanceof SkipAiAgentsError) {
        const status = err.status || 500
        return e.json(status, { error: status >= 500 ? 'Falha ao buscar histórico' : err.message })
      }
      throw err
    }
  },
  $apis.requireAuth(),
)
