import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, User, HeartPulse, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { sendAgentMessage, getAgentHistory, type AgentMessage } from '@/services/agent'

const quickPrompts = [
  'Como lidar com crises de dor?',
  'Dicas para melhorar meu sono',
  'Exercícios seguros para minha condição',
  'Como manter o ânimo em dias difíceis?',
]

export default function AssistentePage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    getAgentHistory()
      .then((history) => {
        if (history.length > 0) setMessages(history)
      })
      .catch(() => {})
  }, [])

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim()
    if (!message || loading) return

    setInput('')
    setLoading(true)

    const userMsg: AgentMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      created: new Date().toISOString(),
    }
    const assistantMsg: AgentMessage = {
      id: `temp-ai-${Date.now()}`,
      role: 'assistant',
      content: '',
      created: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg, assistantMsg])

    abortRef.current = new AbortController()

    try {
      const result = await sendAgentMessage(
        message,
        conversationId,
        (_delta, full) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: full } : m)),
          )
        },
        abortRef.current.signal,
      )
      setConversationId(result.conversationId)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                id: result.messageId,
                content: result.content || m.content,
              }
            : m,
        ),
      )
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                content:
                  'Desculpe, não foi possível obter uma resposta no momento. Tente novamente.',
              }
            : m,
        ),
      )
      toast.error('Erro ao comunicar com o assistente.')
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Guia de Autocuidado
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assistente especializado em saúde e bem-estar
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <ScrollArea className="flex-1" ref={scrollRef}>
          <CardContent className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center mb-4">
                  <HeartPulse className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Olá! Como posso ajudar?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                  Sou seu guia de autocuidado. Pergunte sobre sintomas, medicamentos, exercícios ou
                  qualquer dúvida sobre sua saúde.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 transition-all text-left text-sm text-slate-700 dark:text-slate-300"
                    >
                      <Sparkles className="w-4 h-4 text-teal-500 shrink-0" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm',
                  )}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Digite sua mensagem..."
              className="min-h-[44px] max-h-32 resize-none text-sm"
              rows={1}
              disabled={loading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              size="icon"
              className="bg-teal-600 hover:bg-teal-700 text-white shrink-0 h-11 w-11 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            Este assistente não substitui orientação médica profissional.
          </p>
        </div>
      </Card>
    </div>
  )
}
