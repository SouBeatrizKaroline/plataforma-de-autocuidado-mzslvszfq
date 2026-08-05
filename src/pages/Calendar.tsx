import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { getConsultations, getExams, getVaccinations } from '@/services/health-data'
import type { Consultation, Exam, Vaccination } from '@/types/health'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Stethoscope, FileSpreadsheet, Syringe } from 'lucide-react'
import { format, parseISO, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CalendarEvent {
  id: string
  title: string
  subtitle: string
  date: Date
  type: 'consulta' | 'exame' | 'vacina'
  status: string
}

const typeConfig = {
  consulta: { icon: Stethoscope, color: 'text-blue-600 bg-blue-50', label: 'Consulta' },
  exame: { icon: FileSpreadsheet, color: 'text-purple-600 bg-purple-50', label: 'Exame' },
  vacina: { icon: Syringe, color: 'text-emerald-600 bg-emerald-50', label: 'Vacina' },
}

export default function CalendarPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [vaccines, setVaccines] = useState<Vaccination[]>([])

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      const [c, e, v] = await Promise.all([
        getConsultations(user.id),
        getExams(user.id),
        getVaccinations(user.id),
      ])
      setConsultations(c as Consultation[])
      setExams(e as Exam[])
      setVaccines(v as Vaccination[])
    } catch {
      /* intentionally ignored */
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('consultation', loadData)
  useRealtime('exam', loadData)
  useRealtime('vaccination', loadData)

  const allEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = []
    consultations.forEach((c) => {
      if (c.scheduled_date)
        events.push({
          id: c.id,
          title: c.specialty || 'Consulta',
          subtitle: c.doctor_name || '',
          date: parseISO(c.scheduled_date),
          type: 'consulta',
          status: c.status,
        })
    })
    exams.forEach((e) => {
      if (e.scheduled_date)
        events.push({
          id: e.id,
          title: e.name,
          subtitle: e.type,
          date: parseISO(e.scheduled_date),
          type: 'exame',
          status: e.status,
        })
    })
    vaccines.forEach((v) => {
      if (v.scheduled_date)
        events.push({
          id: v.id,
          title: v.vaccine_name,
          subtitle: v.dose || '',
          date: parseISO(v.scheduled_date),
          type: 'vacina',
          status: v.status,
        })
    })
    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [consultations, exams, vaccines])

  const selectedDayEvents = useMemo(
    () => allEvents.filter((e) => isSameDay(e.date, selectedDate)),
    [allEvents, selectedDate],
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              Eventos de {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                Nenhum evento agendado para esta data.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {selectedDayEvents.map((event) => {
                  const config = typeConfig[event.type]
                  const Icon = config.icon
                  return (
                    <div
                      key={`${event.type}-${event.id}`}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl shrink-0 ${config.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {event.title}
                          </p>
                          <p className="text-xs text-slate-500">{event.subtitle}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {event.status}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allEvents.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">Nenhum evento agendado.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {allEvents.slice(0, 10).map((event) => {
                const config = typeConfig[event.type]
                const Icon = config.icon
                return (
                  <div
                    key={`${event.type}-${event.id}`}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {config.label} • {event.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {format(event.date, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {event.status}
                      </Badge>
                    </div>
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
