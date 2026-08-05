import pb from '@/lib/pocketbase/client'
import type {
  ChronicCondition,
  SelfCarePlan,
  SymptomLog,
  MoodLog,
  SleepLog,
  ExerciseLog,
  NutritionLog,
  Medication,
  Exam,
  Consultation,
  Vaccination,
} from '@/types/health'

// Chronic Conditions
export const getChronicConditions = () =>
  pb.collection<ChronicCondition>('chronic_condition').getFullList({ sort: 'name' })

// Self Care Plan
export const getSelfCarePlan = (userId: string) =>
  pb
    .collection<SelfCarePlan>('self_care_plan')
    .getFirstListItem(`user = "${userId}"`, { expand: 'condition' })
    .catch(() => null)

export const createOrUpdateSelfCarePlan = async (
  userId: string,
  data: Partial<SelfCarePlan>,
  planId?: string,
) => {
  if (planId) {
    return pb.collection<SelfCarePlan>('self_care_plan').update(planId, data)
  } else {
    return pb.collection<SelfCarePlan>('self_care_plan').create({ ...data, user: userId })
  }
}

// Symptom Logs
export const getSymptomLogs = (userId: string, limit = 50) =>
  pb.collection<SymptomLog>('symptom_log').getList(1, limit, {
    filter: `user = "${userId}"`,
    sort: '-date',
  })

export const createSymptomLog = (data: Omit<SymptomLog, 'id' | 'created' | 'updated'>) =>
  pb.collection<SymptomLog>('symptom_log').create(data)

export const deleteSymptomLog = (id: string) => pb.collection<SymptomLog>('symptom_log').delete(id)

// Mood Logs
export const getMoodLogs = (userId: string, limit = 50) =>
  pb.collection<MoodLog>('mood_log').getList(1, limit, {
    filter: `user = "${userId}"`,
    sort: '-date',
  })

export const createMoodLog = (data: Omit<MoodLog, 'id' | 'created' | 'updated'>) =>
  pb.collection<MoodLog>('mood_log').create(data)

export const deleteMoodLog = (id: string) => pb.collection<MoodLog>('mood_log').delete(id)

// Sleep Logs
export const getSleepLogs = (userId: string, limit = 50) =>
  pb.collection<SleepLog>('sleep_log').getList(1, limit, {
    filter: `user = "${userId}"`,
    sort: '-date',
  })

export const createSleepLog = (data: Omit<SleepLog, 'id' | 'created' | 'updated'>) =>
  pb.collection<SleepLog>('sleep_log').create(data)

export const deleteSleepLog = (id: string) => pb.collection<SleepLog>('sleep_log').delete(id)

// Exercise Logs
export const getExerciseLogs = (userId: string, limit = 50) =>
  pb.collection<ExerciseLog>('exercise_log').getList(1, limit, {
    filter: `user = "${userId}"`,
    sort: '-date',
  })

export const createExerciseLog = (data: Omit<ExerciseLog, 'id' | 'created' | 'updated'>) =>
  pb.collection<ExerciseLog>('exercise_log').create(data)

export const deleteExerciseLog = (id: string) =>
  pb.collection<ExerciseLog>('exercise_log').delete(id)

// Nutrition Logs
export const getNutritionLogs = (userId: string, limit = 50) =>
  pb.collection<NutritionLog>('nutrition_log').getList(1, limit, {
    filter: `user = "${userId}"`,
    sort: '-date',
  })

export const createNutritionLog = (data: Omit<NutritionLog, 'id' | 'created' | 'updated'>) =>
  pb.collection<NutritionLog>('nutrition_log').create(data)

export const deleteNutritionLog = (id: string) =>
  pb.collection<NutritionLog>('nutrition_log').delete(id)

// Medications
export const getMedications = (userId: string) =>
  pb.collection<Medication>('medication').getFullList({
    filter: `user = "${userId}"`,
    sort: '-active,name',
  })

export const createMedication = (data: Omit<Medication, 'id' | 'created' | 'updated'>) =>
  pb.collection<Medication>('medication').create(data)

export const updateMedication = (id: string, data: Partial<Medication>) =>
  pb.collection<Medication>('medication').update(id, data)

export const deleteMedication = (id: string) => pb.collection<Medication>('medication').delete(id)

// Exams
export const getExams = (userId: string) =>
  pb.collection<Exam>('exam').getFullList({
    filter: `user = "${userId}"`,
    sort: '-scheduled_date',
  })

export const createExam = (data: Omit<Exam, 'id' | 'created' | 'updated'>) =>
  pb.collection<Exam>('exam').create(data)

export const updateExam = (id: string, data: Partial<Exam>) =>
  pb.collection<Exam>('exam').update(id, data)

export const deleteExam = (id: string) => pb.collection<Exam>('exam').delete(id)

// Consultations
export const getConsultations = (userId: string) =>
  pb.collection<Consultation>('consultation').getFullList({
    filter: `user = "${userId}"`,
    sort: '-scheduled_date',
  })

export const createConsultation = (data: Omit<Consultation, 'id' | 'created' | 'updated'>) =>
  pb.collection<Consultation>('consultation').create(data)

export const updateConsultation = (id: string, data: Partial<Consultation>) =>
  pb.collection<Consultation>('consultation').update(id, data)

export const deleteConsultation = (id: string) =>
  pb.collection<Consultation>('consultation').delete(id)

// Vaccinations
export const getVaccinations = (userId: string) =>
  pb.collection<Vaccination>('vaccination').getFullList({
    filter: `user = "${userId}"`,
    sort: '-scheduled_date',
  })

export const createVaccination = (data: Omit<Vaccination, 'id' | 'created' | 'updated'>) =>
  pb.collection<Vaccination>('vaccination').create(data)

export const updateVaccination = (id: string, data: Partial<Vaccination>) =>
  pb.collection<Vaccination>('vaccination').update(id, data)

export const deleteVaccination = (id: string) =>
  pb.collection<Vaccination>('vaccination').delete(id)
