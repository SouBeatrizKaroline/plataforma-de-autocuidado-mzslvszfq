import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getSymptomLogs,
  getMoodLogs,
  getSleepLogs,
  getExerciseLogs,
  getMedications,
  getConsultations,
  getExams,
  getVaccinations,
  createMoodLog,
  createSymptomLog,
} from '@/services/health-data'
import type {
  SymptomLog,
  MoodLog,
  SleepLog,
  ExerciseLog,
  Medication,
  Consultation,
  Exam,
  Vaccination,
} from '@/types/health'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Smile,
  HeartPulse,
  Moon,
  Activity,
  Calendar,
  Bot,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [symptoms, setSymptoms] = useState<SymptomLog[]>([])
  const [moods, setMoods] = useState<MoodLog[]>([])
  const [sleeps, setSleeps] = useState<SleepLog[]>([])
  const [exercises, setExercises] = useState<ExerciseLog[]>([])
  const [meds, setMeds] = useState<Medication[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [vaccines, setVaccines] = useState<Vaccination[]>([])

  // Quick log state
  const [quickPain, setQuickPain] = useState(2)
  const [quickLoggedToday, setQuickLoggedToday] = useState(false)

  const loadAll = async () => {
    if (!user) return
    try {
      const [sRes, mRes, slRes, eRes, medRes, cRes, exRes, vRes] = await Promise.all([
        getSymptomLogs(user.id),
        getMoodLogs(user.id),
        getSleepLogs(user.id),
        getExerciseLogs(user.id),
        getMedications(user.id),
        getConsultations(user.id),
        getExams(user.id),
        getVaccinations(user.id),
      ])
      setSymptoms(sRes.items)
      setMoods(mRes.items)
      setSleeps(slRes.items)
      setExercises(eRes.items)
      setMeds(medRes)
      setConsultations(cRes)
      setExams(exRes)
      setVaccines(vRes)
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    loadAll()
  }, [user])

  // Realtime updates
  useRealtime('symptom_log', loadAll)
  useRealtime('mood_log', loadAll)
  useRealtime('sleep_log', loadAll)
  useRealtime('exercise_log', loadAll)
  useRealtime('medication', loadAll)

  // Handle Quick Mood click
  const handleQuickMood = async (moodChoice: 'Muito bom' | 'Bom' | 'Ruim' | 'Muito ruim') => {
    if (!user) return
    try {
      const nowIso = new Date().toISOString()
      await createMoodLog({
        user: user.id,
        date: nowIso,
        mood: moodChoice,
        fatigue_level: quickPain,
        notes: 'Registro rápido do painel',
      })
      if (quickPain > 0) {
        await createSymptomLog({
          user: user.id,
          date: nowIso,
          symptom_type: 'Dor',
          intensity: quickPain,
          duration: 'Momento do registro',
          is_crisis: quickPain >= 7,
          notes: 'Registro rápido',
        })
      }
      setQuickLoggedToday(true)
      toast.success('Registrado com sucesso!')
    } catch (_) {
      toast.error('Erro ao salvar registro.')
    }
  }

  // Symptom chart data (last 30 days aggregated by day)
  const symptomChartData = useMemo(() => {
    const days: { [key: string]: { date: string; intensidade: number; count: number } } = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(5, 10).replace('-', '/')
      days[key] = { date: key, intensidade: 0, count: 0 }
    }
    symptoms.forEach((s) => {
      const key = s.date.slice(5, 10).replace('-', '/')
      if (days[key]) {
        days[key].intensidade += s.intensity
        days[key].count += 1
      }
    })
    return Object.values(days).map((d) => ({
      date: d.date,
      intensidade: d.count > 0 ? Math.round((d.intensidade / d.count) * 10) / 10 : 0,
    }))
  }, [symptoms])

  // Mood chart data (last 14 days)
  const moodChartData = useMemo(() => {
    const moodMap: Record<string, number> = {
      'Muito bom': 5,
      Bom: 4,
      Neutro: 3,
      Ruim: 2,
      'Muito ruim': 1,
    }
    const days: { [key: string]: { date: string; valor: number } } = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(5, 10).replace('-', '/')
      days[key] = { date: key, valor: 3 }
    }
    moods.forEach((m) => {
      const key = m.date.slice(5, 10).replace('-', '/')
      if (days[key]) {
        days[key].valor = moodMap[m.mood] || 3
      }
    })
    return Object.values(days)
  }, [moods])

  // Sleep chart data (last 14 days)
  const sleepChartData = useMemo(() => {
    const days: { [key: string]: { date: string; horas: number; meta: number } } = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(5, 10).replace('-', '/')
      days[key] = { date: key, horas: 7, meta: 7 }
    }
    sleeps.forEach((sl) => {
      const key = sl.date.slice(5, 10).replace('-', '/')
      if (days[key]) {
        days[key].horas = sl.hours
      }
    })
    return Object.values(days)
  }, [sleeps])

  // Exercise chart data (last 4 weeks)
  const exerciseChartData = useMemo(() => {
    const weeks = [
      { semana: 'Sem 1', minutos: 120 },
      { semana: 'Sem 2', minutos: 90 },
      { semana: 'Sem 3', minutos: 150 },
      { semana: 'Sem 4', minutos: 110 },
    ]
    let totalMins = 0
    exercises.forEach((e) => {
      totalMins += e.duration_minutes
    })
    if (totalMins > 0) {
      weeks[3].minutos = totalMins
    }
    return weeks
  }, [exercises])

  // Upcoming items
  const upcomingEvents = useMemo(() => {
    const items: Array<{
      title: string
      subtitle: string
      type: string
      date: string
      icon: any
      color: string
    }> = []

    consultations
      .filter((c) => c.status === 'Agendada')
      .forEach((c) => {
        items.push({
          title: `Consulta: ${c.specialty}`,
          subtitle: c.doctor_name,
          type: 'Consulta',
          date: c.scheduled_date
            ? new Date(c.scheduled_date).toLocaleDateString('pt-BR')
            : 'A definir',
          icon: Calendar,
          color: 'text-blue-600 bg-blue-50',
        })
      })

    exams
      .filter((ex) => ex.status === 'Agendado')
      .forEach((ex) => {
        items.push({
          title: `Exame: ${ex.name}`,
          subtitle: ex.type,
          type: 'Exame',
          date: ex.scheduled_date
            ? new Date(ex.scheduled_date).toLocaleDateString('pt-BR')
            : 'A definir',
          icon: Activity,
          color: 'text-purple-600 bg-purple-50',
        })
      })

    vaccines
      .filter((v) => v.status === 'Agendada' || v.status === 'Pendente')
      .forEach((v) => {
        items.push({
          title: `Vacina: ${v.vaccine_name}`,
          subtitle: v.dose,
          type: 'Vacina',
          date: v.scheduled_date
            ? new Date(v.scheduled_date).toLocaleDateString('pt-BR')
            : 'A definir',
          icon: HeartPulse,
          color: 'text-emerald-600 bg-emerald-50',
        })
      })

    meds
      .filter((m) => m.active)
      .slice(0, 3)
      .forEach((m) => {
        items.push({
          title: `Remédio: ${m.name} (${m.dosage})`,
          subtitle: `${m.frequency} às ${m.time}`,
          type: 'Medicamento',
          date: 'Hoje',
          icon: HeartPulse,
          color: 'text-amber-600 bg-amber-50',
        })
      })

    return items.slice(0, 5)
  }, [consultations, exams, vaccines, meds])

  const pieData = [
    { name: 'Cumprido', value: 82, color: '#0d9488' },
    { name: 'Pendente', value: 18, color: '#e2e8f0' },
  ]

  return (
    <div className="space-y-6">
      {/* AI Insight Header Banner */}
      <Card className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white border-none shadow-md overflow-hidden relative">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Dica do Guia de Autocuidado</h2>
              <p className="text-sm text-teal-100 max-w-xl">
                Seu padrão de sono permaneceu estável nos últimos 7 dias e sua adesão à medicação é
                de 82%. Continue mantendo a caminhada diária!
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/assistente')}
            className="bg-white text-teal-800 hover:bg-teal-50 font-semibold shadow-sm shrink-0"
          >
            Perguntar ao assistente
          </Button>
        </div>
      </Card>

      {/* Grid Row 1: Quick Log & Adherence Donut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Log Card */}
        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Smile className="w-5 h-5 text-teal-600" />
              Como você está se sentindo hoje?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickLoggedToday ? (
              <div className="bg-teal-50 dark:bg-teal-950/50 p-4 rounded-xl flex items-center gap-3 text-teal-800 dark:text-teal-200">
                <Check className="w-6 h-6 text-teal-600 shrink-0" />
                <p className="text-sm">
                  Seu estado de hoje já foi registrado com sucesso! Você pode ver os gráficos abaixo
                  ou adicionar mais detalhes na tela de registros.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleQuickMood('Muito bom')}
                    className="flex flex-col items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950 transition-all text-center"
                  >
                    <span className="text-3xl">😊</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                      Muito bom
                    </span>
                  </button>
                  <button
                    onClick={() => handleQuickMood('Bom')}
                    className="flex flex-col items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950 transition-all text-center"
                  >
                    <span className="text-3xl">😌</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                      Bom
                    </span>
                  </button>
                  <button
                    onClick={() => handleQuickMood('Ruim')}
                    className="flex flex-col items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950 transition-all text-center"
                  >
                    <span className="text-3xl">😟</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                      Ruim
                    </span>
                  </button>
                  <button
                    onClick={() => handleQuickMood('Muito ruim')}
                    className="flex flex-col items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all text-center"
                  >
                    <span className="text-3xl">😢</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                      Muito ruim
                    </span>
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Nível de dor hoje (0 a 10):</span>
                    <span className="font-bold text-teal-700 dark:text-teal-400">
                      {quickPain} / 10
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[quickPain]}
                    onValueChange={(val) => setQuickPain(val[0])}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Adherence Donut Chart */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              Adesão ao Plano (7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-2">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-teal-700 dark:text-teal-300">
                  82%
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Cumprimento</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> Medicamentos
                & Hábitos
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Row 2: Charts (Symptom Line Chart & Mood Bar Chart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptom Evolution Line Chart */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-purple-600" />
              Evolução de Sintomas (30 dias)
            </CardTitle>
            <span className="text-xs text-slate-400">Média diária</span>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ChartContainer
                config={{ intensidade: { label: 'Intensidade de dor/sintoma', color: '#8b5cf6' } }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={symptomChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} tickLine={false} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="intensidade"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mood Chart */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Smile className="w-4 h-4 text-teal-600" />
              Histórico de Humor (14 dias)
            </CardTitle>
            <span className="text-xs text-slate-400">Escala 1 a 5</span>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ChartContainer config={{ valor: { label: 'Humor (1-5)', color: '#0d9488' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 5]} tickLine={false} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="valor" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Row 3: Sleep & Exercise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sleep Chart */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-600" />
              Horas de Sono por Noite (14 dias)
            </CardTitle>
            <span className="text-xs text-slate-400">Meta: 7h+</span>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full">
              <ChartContainer config={{ horas: { label: 'Horas de sono', color: '#3b82f6' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 12]} tickLine={false} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="horas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Chart */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Exercícios Semanais (minutos)
            </CardTitle>
            <span className="text-xs text-slate-400">Últimas 4 semanas</span>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full">
              <ChartContainer
                config={{ minutos: { label: 'Minutos de treino', color: '#10b981' } }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={exerciseChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="semana" tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="minutos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Upcoming Events List */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            Próximos Compromissos e Medicamentos
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/calendario')}
            className="text-xs text-teal-600 hover:text-teal-700"
          >
            Ver calendário completo <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              Nenhum compromisso agendado para os próximos dias.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {upcomingEvents.map((item, idx) => {
                const IconComp = item.icon
                return (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${item.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">{item.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 shrink-0">
                      {item.date}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
