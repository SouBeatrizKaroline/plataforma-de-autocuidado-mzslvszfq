import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HeartPulse, Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await requestPasswordReset(email)
    setLoading(false)
    setSent(true)
    toast.success('Se o e-mail existir, enviamos o link de recuperação.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-teal-100 dark:border-slate-800">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Recuperar Senha</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Digite seu e-mail para receber as instruções
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Verifique sua caixa de entrada no e-mail <strong>{email}</strong> e siga as instruções
              para redefinir sua senha.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Voltar ao Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail cadastrado</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg shadow-sm"
            >
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar ao Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
