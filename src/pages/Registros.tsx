import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getSymptomLogs,
  createSymptomLog,
  deleteSymptomLog,
  getMoodLogs,
  createMoodLog,
  deleteMoodLog,
  getSleepLogs,
  createSleepLog,
  deleteSleepLog,
  getExerciseLogs,
  createExerciseLog,
  deleteExerciseLog,
  getNutritionLogs,
  createNutritionLog,
  deleteNutritionLog,
} from '@/services/health-data'
import type { SymptomLog, MoodLog, SleepLog, ExerciseLog, NutritionLog } from '@/types/health'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import {
  HeartPulse,
  Smile,
  Moon,
  Activity,
  Utensils,
  Trash2,
  Plus,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

export default function Registros() {
  const { user } = useAuth()

  const [symptoms, setSymptoms] = useState<SymptomLog[]>([])
  const [moods, setMoods] = useState<MoodLog[]>([])
  const [sleeps, setSleeps] = useState<SleepLog[]>([])
  const [exercises, setExercises] = useState<ExerciseLog[]>([])
  const [nutritions, setNutritions] = useState<NutritionLog[]>([])

  // Symptom Form
  const [symptomType, setSymptomType] = useState<any>('Dor')
  const [intensity, setIntensity] = useState(3)
  const [duration, setDuration] = useState('')
  const [isCrisis, setIsCrisis] = useState(false)
  const [symptomNotes, setSymptomNotes] = useState('')

  // Mood Form
  const [mood, setMood] = useState<any>('Bom')
  const [fatigue, setFatigue] = useState(3)
  const [moodNotes, setMoodNotes] = useState('')

  // Sleep Form
  const [sleepHours, setSleepHours] = useState('7.5')
  const [sleepQuality, setSleepQuality] = useState(4)
  const [sleepNotes, setSleepNotes] = useState('')

  // Exercise Form
  const [exerciseType, setExerciseType] = useState<any>('Caminhada')
  const [exerciseMins, setExerciseMins] = useState('30')
  const [exerciseIntensity, setExerciseIntensity] = useState<any>('Moderada')
  const [exerciseNotes, setExerciseNotes] = useState('')

  // Nutrition Form
  const [meal, setMeal] = useState<any>('Almoço')
  const [mealDesc, setMealDesc] = useState('')
  const [hydration, setHydration] = useState('4')
  const [nutritionNotes, setNutritionNotes] = useState('')

  const loadAll = async () => {
    if (!user) return
    try {
      const [sRes, mRes, slRes, eRes, nRes] = await Promise.all([
        getSymptomLogs(user.id),
        getMoodLogs(user.id),
        getSleepLogs(user.id),
        getExerciseLogs(user.id),
        getNutritionLogs(user.id),
      ])
      setSymptoms(sRes.items)
      setMoods(mRes.items)
      setSleeps(slRes.items)
      setExercises(eRes.items)
      setNutritions(nRes.items)
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    loadAll()
  }, [user])

  useRealtime('symptom_log', loadAll)
  useRealtime('mood_log', loadAll)
  useRealtime('sleep_log', loadAll)
  useRealtime('exercise_log', loadAll)
  useRealtime('nutrition_log', loadAll)

  // Submit Symptom
  const handleAddSymptom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      await createSymptomLog({
        user: user.id,
        date: new Date().toISOString(),
        symptom_type: symptomType,
        intensity,
        duration: duration || 'Não informada',
        is_crisis: isCrisis,
        notes: symptomNotes,
      })
      toast.success('Sintoma registrado!')
      setDuration('')
      setSymptomNotes('')
      setIsCrisis(false)
      loadAll()
    } catch (_) {
      toast.error('Erro ao registrar sintoma.')
    }
  }

  // Submit Mood
  const handleAddMood = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      await createMoodLog({
        user: user.id,
        date: new Date().toISOString(),
        mood,
        fatigue_level: fatigue,
        notes: moodNotes,
      })
      toast.success('Humor/Fadiga registrado!')
      setMoodNotes('')
      loadAll()
    } catch (_) {
      toast.error('Erro ao registrar humor.')
    }
  }

  // Submit Sleep
  const handleAddSleep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      await createSleepLog({
        user: user.id,
        date: new Date().toISOString(),
        hours: parseFloat(sleepHours) || 7,
        quality: sleepQuality,
        notes: sleepNotes,
      })
      toast.success('Sono registrado!')
      setSleepNotes('')
      loadAll()
    } catch (_) {
      toast.error('Erro ao registrar sono.')
    }
  }

  // Submit Exercise
  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      await createExerciseLog({
        user: user.id,
        date: new Date().toISOString(),
        activity_type: exerciseType,
        duration_minutes: parseInt(exerciseMins, 10) || 30,
        intensity: exerciseIntensity,
        notes: exerciseNotes,
      })
      toast.success('Exercício registrado!')
      setExerciseNotes('')
      loadAll()
    } catch (_) {
      toast.error('Erro ao registrar exercício.')
    }
  }

  // Submit Nutrition
  const handleAddNutrition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      await createNutritionLog({
        user: user.id,
        date: new Date().toISOString(),
        meal,
        description: mealDesc,
        hydration: parseInt(hydration, 10) || 0,
        notes: nutritionNotes,
      })
      toast.success('Alimentação registrada!')
      setMealDesc('')
      setNutritionNotes('')
      loadAll()
    } catch (_) {
      toast.error('Erro ao registrar alimentação.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Registros Diários</h2>
        <p className="text-sm text-slate-500">
          Lançamento de sintomas, humor, sono, exercícios e refeições.
        </p>
      </div>

      <Tabs defaultValue="sintomas" className="w-full">
        <TabsList className="grid grid-cols-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger value="sintomas" className="text-xs sm:text-sm gap-1.5">
            <HeartPulse className="w-4 h-4 text-purple-600" />{' '}
            <span className="hidden sm:inline">Sintomas</span>
          </TabsTrigger>
          <TabsTrigger value="humor" className="text-xs sm:text-sm gap-1.5">
            <Smile className="w-4 h-4 text-teal-600" />{' '}
            <span className="hidden sm:inline">Humor</span>
          </TabsTrigger>
          <TabsTrigger value="sono" className="text-xs sm:text-sm gap-1.5">
            <Moon className="w-4 h-4 text-blue-600" />{' '}
            <span className="hidden sm:inline">Sono</span>
          </TabsTrigger>
          <TabsTrigger value="exercicios" className="text-xs sm:text-sm gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />{' '}
            <span className="hidden sm:inline">Exercícios</span>
          </TabsTrigger>
          <TabsTrigger value="alimentacao" className="text-xs sm:text-sm gap-1.5">
            <Utensils className="w-4 h-4 text-amber-600" />{' '}
            <span className="hidden sm:inline">Comida</span>
          </TabsTrigger>
        </TabsList>

        {/* Sintomas Tab */}
        <TabsContent value="sintomas" className="space-y-6 pt-4">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
                Novo Registro de Sintoma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSymptom} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Tipo de Sintoma</Label>
                  <Select value={symptomType} onValueChange={(v) => setSymptomType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dor">Dor</SelectItem>
                      <SelectItem value="Crise">Crise</SelectItem>
                      <SelectItem value="Falta de ar">Falta de ar</SelectItem>
                      <SelectItem value="Tontura">Tontura</SelectItem>
                      <SelectItem value="Náusea">Náusea</SelectItem>
                      <SelectItem value="Fadiga">Fadiga</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <Label>Intensidade ({intensity})</Label>
                  </div>
                  <Slider
                    min={0}
                    max={10}
                    value={[intensity]}
                    onValueChange={(v) => setIntensity(v[0])}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Duração</Label>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ex: 30 minutos"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="crisisTab"
                    checked={isCrisis}
                    onCheckedChange={(c) => setIsCrisis(!!c)}
                  />
                  <Label htmlFor="crisisTab" className="cursor-pointer font-medium">
                    Foi uma crise intensa?
                  </Label>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label>Notas</Label>
                  <Textarea
                    value={symptomNotes}
                    onChange={(e) => setSymptomNotes(e.target.value)}
                    placeholder="Gatilhos ou contexto..."
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white gap-1">
                    <Plus className="w-4 h-4" /> Salvar Sintoma
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Histórico de Sintomas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {symptoms.length === 0 && (
                  <p className="text-sm text-slate-400 py-4">Nenhum sintoma registrado.</p>
                )}
                {symptoms.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {item.symptom_type}
                        {item.is_crisis && (
                          <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                            CRISE
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        Intensidade: {item.intensity}/10 | Duração: {item.duration}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-slate-600 italic mt-0.5">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSymptomLog(item.id).then(loadAll)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Humor Tab */}
        <TabsContent value="humor" className="space-y-6 pt-4">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Novo Registro de Humor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMood} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Humor</Label>
                  <Select value={mood} onValueChange={(v) => setMood(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Muito bom">😊 Muito bom</SelectItem>
                      <SelectItem value="Bom">😌 Bom</SelectItem>
                      <SelectItem value="Neutro">😐 Neutro</SelectItem>
                      <SelectItem value="Ruim">😟 Ruim</SelectItem>
                      <SelectItem value="Muito ruim">😢 Muito ruim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Nível de Fadiga ({fatigue})</Label>
                  <Slider
                    min={0}
                    max={10}
                    value={[fatigue]}
                    onValueChange={(v) => setFatigue(v[0])}
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label>Notas</Label>
                  <Textarea
                    value={moodNotes}
                    onChange={(e) => setMoodNotes(e.target.value)}
                    placeholder="Como se sentiu ao longo do dia?..."
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white gap-1">
                    <Plus className="w-4 h-4" /> Salvar Humor
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Histórico de Humor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {moods.length === 0 && (
                  <p className="text-sm text-slate-400 py-4">Nenhum registro de humor.</p>
                )}
                {moods.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.mood}
                      </p>
                      <p className="text-xs text-slate-500">Fadiga: {item.fatigue_level}/10</p>
                      {item.notes && (
                        <p className="text-xs text-slate-600 italic mt-0.5">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMoodLog(item.id).then(loadAll)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sono Tab */}
        <TabsContent value="sono" className="space-y-6 pt-4">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Novo Registro de Sono</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSleep} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Horas de Sono</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Qualidade do Sono ({sleepQuality} ⭐)</Label>
                  <Slider
                    min={1}
                    max={5}
                    value={[sleepQuality]}
                    onValueChange={(v) => setSleepQuality(v[0])}
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label>Notas</Label>
                  <Textarea
                    value={sleepNotes}
                    onChange={(e) => setSleepNotes(e.target.value)}
                    placeholder="Detalhes sobre a noite de sono..."
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white gap-1">
                    <Plus className="w-4 h-4" /> Salvar Sono
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Histórico de Sono</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sleeps.length === 0 && (
                  <p className="text-sm text-slate-400 py-4">Nenhum registro de sono.</p>
                )}
                {sleeps.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.hours} horas de sono ({item.quality}⭐)
                      </p>
                      {item.notes && (
                        <p className="text-xs text-slate-600 italic mt-0.5">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSleepLog(item.id).then(loadAll)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercícios Tab */}
        <TabsContent value="exercicios" className="space-y-6 pt-4">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Novo Registro de Exercício</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExercise} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Atividade</Label>
                  <Select value={exerciseType} onValueChange={(v) => setExerciseType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Caminhada">Caminhada</SelectItem>
                      <SelectItem value="Alongamento">Alongamento</SelectItem>
                      <SelectItem value="Musculação">Musculação</SelectItem>
                      <SelectItem value="Natação">Natação</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                      <SelectItem value="Bicicleta">Bicicleta</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Duração (minutos)</Label>
                  <Input
                    type="number"
                    value={exerciseMins}
                    onChange={(e) => setExerciseMins(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Intensidade</Label>
                  <Select
                    value={exerciseIntensity}
                    onValueChange={(v) => setExerciseIntensity(v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leve">Leve</SelectItem>
                      <SelectItem value="Moderada">Moderada</SelectItem>
                      <SelectItem value="Intensa">Intensa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <Label>Observações</Label>
                  <Textarea
                    value={exerciseNotes}
                    onChange={(e) => setExerciseNotes(e.target.value)}
                    placeholder="Como foi o treino..."
                    rows={2}
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white gap-1">
                    <Plus className="w-4 h-4" /> Salvar Exercício
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Histórico de Exercícios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {exercises.length === 0 && (
                  <p className="text-sm text-slate-400 py-4">Nenhum exercício registrado.</p>
                )}
                {exercises.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.activity_type} - {item.duration_minutes} min ({item.intensity})
                      </p>
                      {item.notes && (
                        <p className="text-xs text-slate-600 italic mt-0.5">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExerciseLog(item.id).then(loadAll)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alimentação Tab */}
        <TabsContent value="alimentacao" className="space-y-6 pt-4">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Novo Registro de Alimentação</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNutrition} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Refeição</Label>
                  <Select value={meal} onValueChange={(v) => setMeal(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Café da manhã">Café da manhã</SelectItem>
                      <SelectItem value="Almoço">Almoço</SelectItem>
                      <SelectItem value="Jantar">Jantar</SelectItem>
                      <SelectItem value="Lanche">Lanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Copos de Água (Hidratação)</Label>
                  <Input
                    type="number"
                    value={hydration}
                    onChange={(e) => setHydration(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label>Descrição dos Alimentos</Label>
                  <Textarea
                    value={mealDesc}
                    onChange={(e) => setMealDesc(e.target.value)}
                    placeholder="O que comeu?..."
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white gap-1">
                    <Plus className="w-4 h-4" /> Salvar Alimentação
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Histórico de Alimentação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {nutritions.length === 0 && (
                  <p className="text-sm text-slate-400 py-4">Nenhuma refeição registrada.</p>
                )}
                {nutritions.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.meal}
                      </p>
                      <p className="text-xs text-slate-600">{item.description}</p>
                      <p className="text-xs text-teal-600 font-medium mt-0.5">
                        💧 {item.hydration} copos de água
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNutritionLog(item.id).then(loadAll)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
