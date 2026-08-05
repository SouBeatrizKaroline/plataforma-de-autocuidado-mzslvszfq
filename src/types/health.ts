export interface ChronicCondition {
  id: string
  name: string
  description: string
  icon: string
  color: string
  created: string
  updated: string
}

export interface SelfCarePlan {
  id: string
  user: string
  condition: string[]
  goals: string
  daily_routine: string
  triggers: string
  prevention_notes: string
  created: string
  updated: string
  expand?: {
    condition?: ChronicCondition[]
  }
}

export interface SymptomLog {
  id: string
  user: string
  date: string
  symptom_type: 'Dor' | 'Crise' | 'Falta de ar' | 'Tontura' | 'Náusea' | 'Fadiga' | 'Outro'
  intensity: number
  duration: string
  is_crisis: boolean
  notes: string
  created: string
  updated: string
}

export interface MoodLog {
  id: string
  user: string
  date: string
  mood: 'Muito bom' | 'Bom' | 'Neutro' | 'Ruim' | 'Muito ruim'
  fatigue_level: number
  notes: string
  created: string
  updated: string
}

export interface SleepLog {
  id: string
  user: string
  date: string
  hours: number
  quality: number
  notes: string
  created: string
  updated: string
}

export interface ExerciseLog {
  id: string
  user: string
  date: string
  activity_type:
    | 'Caminhada'
    | 'Alongamento'
    | 'Musculação'
    | 'Natação'
    | 'Yoga'
    | 'Bicicleta'
    | 'Outro'
  duration_minutes: number
  intensity: 'Leve' | 'Moderada' | 'Intensa'
  notes: string
  created: string
  updated: string
}

export interface NutritionLog {
  id: string
  user: string
  date: string
  meal: 'Café da manhã' | 'Almoço' | 'Jantar' | 'Lanche'
  description: string
  hydration: number
  notes: string
  created: string
  updated: string
}

export interface Medication {
  id: string
  user: string
  name: string
  dosage: string
  frequency:
    | 'Uma vez ao dia'
    | 'Duas vezes ao dia'
    | 'Três vezes ao dia'
    | 'Semanal'
    | 'Conforme necessário'
  time: string
  start_date: string
  end_date?: string
  active: boolean
  created: string
  updated: string
}

export interface Exam {
  id: string
  user: string
  name: string
  type: 'Sangue' | 'Imagem' | 'Urina' | 'Outro'
  scheduled_date: string
  status: 'Agendado' | 'Realizado' | 'Resultado disponível'
  result: string
  notes: string
  created: string
  updated: string
}

export interface Consultation {
  id: string
  user: string
  specialty: string
  doctor_name: string
  scheduled_date: string
  location: string
  status: 'Agendada' | 'Realizada' | 'Cancelada'
  notes: string
  created: string
  updated: string
}

export interface Vaccination {
  id: string
  user: string
  vaccine_name: string
  dose: string
  scheduled_date: string
  administered_date?: string
  status: 'Pendente' | 'Agendada' | 'Aplicada'
  notes: string
  created: string
  updated: string
}
