import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
import { useAuth } from '@/hooks/use-auth'
import {
  createSymptomLog,
  createMoodLog,
  createSleepLog,
  createExerciseLog,
  createNutritionLog,
} from '@/services/health-data'
import { toast } from 'sonner'
import { HeartPulse, Smile, Moon, Activity, Utensils } from 'lucide-react'

interface QuickLogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickLogModal({ open, onOpenChange }: QuickLogModalProps) {
  const { user } = useAuth()
  const [activeType, setActiveType] = useState<
    'symptom' | 'mood' | 'sleep' | 'exercise' | 'nutrition'
  >('symptom')
  const [submitting, setSubmitting] = useState(false)

  // Symptom fields
  const [symptomType, setSymptomType] = useState<any>('Dor')
  const [intensity, setIntensity] = useState(3)
  const [duration, setDuration] = useState('')
  const [isCrisis, setIsCrisis] = useState(false)
  const [symptomNotes, setSymptomNotes] = useState('')

  // Mood fields
  const [mood, setMood] = useState<any>('Bom')
  const [fatigue, setFatigue] = useState(3)
  const [moodNotes, setMoodNotes] = useState('')

  // Sleep fields
  const [hours, setHours] = useState('7.5')
  const [quality, setQuality] = useState(4)
  const [sleepNotes, setSleepNotes] = useState('')

  // Exercise fields
  const [exerciseType, setExerciseType] = useState<any>('Caminhada')
  const [durationMins, setDurationMins] = useState('30')
  const [exerciseIntensity, setExerciseIntensity] = useState<any>('Moderada')

  // Nutrition fields
  const [meal, setMeal] = useState<any>('Almoço')
  const [description, setDescription] = useState('')
  const [hydration, setHydration] = useState('4')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    const nowIso = new Date().toISOString()

    try {
      if (activeType === 'symptom') {
        await createSymptomLog({
          user: user.id,
          date: nowIso,
          symptom_type: symptomType,
          intensity,
          duration: duration || 'Não especificada',
          is_crisis: isCrisis,
          notes: symptomNotes,
        })
        toast.success('Sintoma registrado com sucesso!')
      } else if (activeType === 'mood') {
        await createMoodLog({
          user: user.id,
          date: nowIso,
          mood,
          fatigue_level: fatigue,
          notes: moodNotes,
        })
        toast.success('Humor e fadiga registrados!')
      } else if (activeType === 'sleep') {
        await createSleepLog({
          user: user.id,
          date: nowIso,
          hours: parseFloat(hours) || 7,
          quality,
          notes: sleepNotes,
        })
        toast.success('Registro de sono salvo!')
      } else if (activeType === 'exercise') {
        await createExerciseLog({
          user: user.id,
          date: nowIso,
          activity_type: exerciseType,
          duration_minutes: parseInt(durationMins, 10) || 30,
          intensity: exerciseIntensity,
          notes: '',
        })
        toast.success('Atividade física registrada!')
      } else if (activeType === 'nutrition') {
        await createNutritionLog({
          user: user.id,
          date: nowIso,
          meal,
          description: description || 'Refeição balanceada',
          hydration: parseInt(hydration, 10) || 0,
          notes: '',
        })
        toast.success('Alimentação registrada!')
      }
      onOpenChange(false)
    } catch (err: any) {
      toast.error('Erro ao salvar registro.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-teal-800 dark:text-teal-300">
            Registro Rápido de Autocuidado
          </DialogTitle>
          <DialogDescription>Escolha a categoria e lance seu registro de hoje.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto my-2">
          <Button
            type="button"
            variant={activeType === 'symptom' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveType('symptom')}
            className={`flex-1 text-xs gap-1 ${
              activeType === 'symptom' ? 'bg-teal-600 text-white hover:bg-teal-700' : ''
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" /> Sintoma
          </Button>
          <Button
            type="button"
            variant={activeType === 'mood' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveType('mood')}
            className={`flex-1 text-xs gap-1 ${
              activeType === 'mood' ? 'bg-teal-600 text-white hover:bg-teal-700' : ''
            }`}
          >
            <Smile className="w-3.5 h-3.5" /> Humor
          </Button>
          <Button
            type="button"
            variant={activeType === 'sleep' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveType('sleep')}
            className={`flex-1 text-xs gap-1 ${
              activeType === 'sleep' ? 'bg-teal-600 text-white hover:bg-teal-700' : ''
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Sono
          </Button>
          <Button
            type="button"
            variant={activeType === 'exercise' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveType('exercise')}
            className={`flex-1 text-xs gap-1 ${
              activeType === 'exercise' ? 'bg-teal-600 text-white hover:bg-teal-700' : ''
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Exercício
          </Button>
          <Button
            type="button"
            variant={activeType === 'nutrition' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveType('nutrition')}
            className={`flex-1 text-xs gap-1 ${
              activeType === 'nutrition' ? 'bg-teal-600 text-white hover:bg-teal-700' : ''
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Comida
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {activeType === 'symptom' && (
            <>
              <div className="space-y-1.5">
                <Label>Tipo de Sintoma</Label>
                <Select value={symptomType} onValueChange={(val) => setSymptomType(val as any)}>
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

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Intensidade (0 a 10)</Label>
                  <span className="font-semibold text-teal-700 dark:text-teal-400">
                    {intensity}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[intensity]}
                  onValueChange={(val) => setIntensity(val[0])}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Duração (ex: 30 min, o dia todo)</Label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 2 horas"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="crisis"
                  checked={isCrisis}
                  onCheckedChange={(c) => setIsCrisis(!!c)}
                />
                <Label htmlFor="crisis" className="text-sm font-normal cursor-pointer">
                  Marcar como crise intensa
                </Label>
              </div>

              <div className="space-y-1.5">
                <Label>Notas</Label>
                <Textarea
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  placeholder="Detalhes ou gatilhos..."
                  rows={2}
                />
              </div>
            </>
          )}

          {activeType === 'mood' && (
            <>
              <div className="space-y-1.5">
                <Label>Como se sente agora?</Label>
                <Select value={mood} onValueChange={(val) => setMood(val as any)}>
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

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Nível de Fadiga (0 a 10)</Label>
                  <span className="font-semibold text-teal-700 dark:text-teal-400">{fatigue}</span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[fatigue]}
                  onValueChange={(val) => setFatigue(val[0])}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Observações</Label>
                <Textarea
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  placeholder="Como foi seu dia..."
                  rows={2}
                />
              </div>
            </>
          )}

          {activeType === 'sleep' && (
            <>
              <div className="space-y-1.5">
                <Label>Horas de sono nesta noite</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Qualidade do Sono (1 a 5 estrelas)</Label>
                  <span className="font-semibold text-teal-700 dark:text-teal-400">
                    {quality} ⭐
                  </span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[quality]}
                  onValueChange={(val) => setQuality(val[0])}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Notas sobre o sono</Label>
                <Textarea
                  value={sleepNotes}
                  onChange={(e) => setSleepNotes(e.target.value)}
                  placeholder="Acordou no meio da noite? Sonhos?..."
                  rows={2}
                />
              </div>
            </>
          )}

          {activeType === 'exercise' && (
            <>
              <div className="space-y-1.5">
                <Label>Atividade</Label>
                <Select value={exerciseType} onValueChange={(val) => setExerciseType(val as any)}>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Duração (minutos)</Label>
                  <Input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Intensidade</Label>
                  <Select
                    value={exerciseIntensity}
                    onValueChange={(val) => setExerciseIntensity(val as any)}
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
              </div>
            </>
          )}

          {activeType === 'nutrition' && (
            <>
              <div className="space-y-1.5">
                <Label>Refeição</Label>
                <Select value={meal} onValueChange={(val) => setMeal(val as any)}>
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
                <Label>Descrição da refeição</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="O que você comeu?..."
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Copos de água tomados hoje</Label>
                <Input
                  type="number"
                  min="0"
                  value={hydration}
                  onChange={(e) => setHydration(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {submitting ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
