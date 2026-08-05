import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, HeartPulse } from 'lucide-react'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    pb.collection('users')
      .confirmVerification(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
          <HeartPulse className="w-8 h-8" />
        </div>

        {status === 'loading' && (
          <p className="text-slate-600 dark:text-slate-300">Confirmando seu e-mail...</p>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              E-mail Verificado!
            </h2>
            <p className="text-sm text-slate-500">
              Sua conta foi ativada com sucesso. Agora você pode entrar e utilizar todos os recursos
              da plataforma.
            </p>
            <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              <Link to="/">Ir para Login</Link>
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Falha na Verificação
            </h2>
            <p className="text-sm text-slate-500">O link de verificação é inválido ou expirou.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Voltar ao Início</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
