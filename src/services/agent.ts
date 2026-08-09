import pb from '@/lib/pocketbase/client'
import { streamAgentChat, type AgentCitation } from '@/lib/skipAi'

export interface AgentMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: AgentCitation[]
  created: string
}

export interface SendResult {
  conversationId: string
  messageId: string
  content: string
}

export async function sendAgentMessage(
  message: string,
  conversationId: string | null,
  onChunk: (delta: string, full: string) => void,
  signal?: AbortSignal,
): Promise<SendResult> {
  const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: pb.authStore.token || '',
    },
    body: JSON.stringify({ message, conversation_id: conversationId }),
    signal,
  })

  const result = await streamAgentChat(res, {
    onChunk: (delta, full) => onChunk(delta, full),
    signal,
  })

  return {
    conversationId: result.conversation_id,
    messageId: result.message_id,
    content: result.content,
  }
}

export async function getAgentHistory(): Promise<AgentMessage[]> {
  const res = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/chats`, {
    headers: { Authorization: pb.authStore.token || '' },
  })
  if (!res.ok) return []
  const data = await res.json()
  if (!data?.conversations?.length) return []
  const conv = data.conversations[0]
  const msgRes = await fetch(
    `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/chats/${conv.id}/messages`,
    { headers: { Authorization: pb.authStore.token || '' } },
  )
  if (!msgRes.ok) return []
  const msgData = await msgRes.json()
  const { displayableMessages } = await import('@/lib/skipAi')
  return displayableMessages(msgData.messages || [])
}
