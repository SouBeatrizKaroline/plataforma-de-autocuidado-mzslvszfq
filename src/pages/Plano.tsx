import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getSelfCarePlan,
  createOrUpdateSelfCarePlan,
  getChronicConditions,
} from '@/services/health-data'
import type { ChronicCondition, SelfCarePlan } from '@/types/health'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Target,
  Repeat,
  AlertTriangle,
  ShieldCheck,
  HeartPulse,
  Save,
  Activity,
} from 'lucide-react'
import { toast } from 'sonner'

export default function PlanoPage() {
  const { user } = useAuth()

  const [plan, setPlan] = useState<SelfCarePlan | null>(null)
  const [conditions, setConditions] = useState<ChronicCondition[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [goals, setGoals] = useState('')
  const [dailyRoutine, setDailyRoutine] = useState('')
  const [triggers, setTriggers] = useState('')
  const [preventionNotes, setPreventionNotes] = useState('')

  const loadPlan = async () => {
    if (!user) return
    try {
      const [planRes, condRes] = await Promise.all([
        getSelfCarePlan(user.id),
        getChronicConditions(),
      ])
      setConditions(condRes.items || [])
      const existing = planRes.items?.[0] || null
      setPlan(existing)
      if (existing) {
        setGoals(existing.goals || '')
        setDailyRoutine(existing.daily_routine || '')
        setTriggers(existing.triggers || '')
        setPreventionNotes(existing.prevention_notes || '')
      }
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlan()
  }, [user])

  useRealtime('self_care_plan', loadPlan)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      await createOrUpdateSelfCarePlan({
        id: plan?.id,
        user: user.id,
        condition: plan?.condition || [],
        goals,
        daily_routine: dailyRoutine,
        triggers,
        prevention_notes: preventionNotes,
      })
      toast.success('Plano de autocuidado salvo!')
      loadPlan()
    } catch {
      toast.error('Erro ao salvar plano.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Plano de Autocuidado
          </h2>
          <p className="text-sm text-slate-500">Defina metas, rotina e estratégias de prevenção.</p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Plano de Autocuidado
        </h2>
        <p className="text-sm text-slate-500">
          Defina metas, rotina diária e estratégias de prevenção personalizadas.
        </p>
      </div>

      {conditions.length > 0 && (
        <Card className="border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20">
          <CardHeader>
            <CardTitle className="text-base font-bold text-teal-800 dark:text-teal-300 flex items-center gap-2">
              <HeartPulse className="w-5 h-5" />
              Condições Crônicas
            </CardTitle>
            <CardDescription className="text-teal-700 dark:text-teal-400">
              Condições associadas ao seu plano de cuidado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <Badge
                  key={c.id}
                  variant="secondary"
                  className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 text-sm py-1.5 px-3"
                >
                  {c.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Metas e Objetivos
            </CardTitle>
            <CardDescription>O que você quer alcançar com seu autocuidado?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Ex: Reduzir crises em 50%, manter glicemia controlada, caminhar 30 min por dia..."
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Repeat className="w-5 h-5 text-blue-600" />
              Rotina Diária
            </CardTitle>
            <CardDescription>Sua rotina de cuidados do dia a dia.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={dailyRoutine}
              onChange={(e) => setDailyRoutine(e.target.value)}
              placeholder="Ex: Manhã - medicação e café da manhã. Tarde - caminhada. Noite - alongamento e medicação..."
              rows={5}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Gatilhos e Fatores de Risco
            </CardTitle>
            <CardDescription>O que desencadeia sintomas ou crises?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              placeholder="Ex: Estresse, mudanças de temperatura, alimentos específicos, falta de sono..."
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Estratégias de Prevenção
            </CardTitle>
            <CardDescription>Medidas para evitar complicações e manter a saúde.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={preventionNotes}
              onChange={(e) => setPreventionNotes(e.target.value)}
              placeholder="Ex: Beber 2L de água, evitar esforço excessivo, monitorar pressão 2x ao dia..."
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2 rounded-lg shadow-sm"
          >
            {saving ? (
              <>
                <Activity className="w-4 h-4 animate-pulse" /> Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Salvar Plano
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
