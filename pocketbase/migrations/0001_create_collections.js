migrate(
  (app) => {
    // 1. chronic_condition
    const chronicCondition = new Collection({
      name: 'chronic_condition',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' },
        { name: 'color', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_cc_name ON chronic_condition (name)'],
    })
    app.save(chronicCondition)

    const ccId = app.findCollectionByNameOrId('chronic_condition').id

    // 2. self_care_plan
    const selfCarePlan = new Collection({
      name: 'self_care_plan',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'condition', type: 'relation', collectionId: ccId, maxSelect: 10 },
        { name: 'goals', type: 'text' },
        { name: 'daily_routine', type: 'text' },
        { name: 'triggers', type: 'text' },
        { name: 'prevention_notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_scp_user ON self_care_plan (user)'],
    })
    app.save(selfCarePlan)

    // 3. symptom_log
    const symptomLog = new Collection({
      name: 'symptom_log',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'date', type: 'date', required: true },
        {
          name: 'symptom_type',
          type: 'select',
          required: true,
          values: ['Dor', 'Crise', 'Falta de ar', 'Tontura', 'Náusea', 'Fadiga', 'Outro'],
          maxSelect: 1,
        },
        { name: 'intensity', type: 'number', min: 0, max: 10 },
        { name: 'duration', type: 'text' },
        { name: 'is_crisis', type: 'bool' },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_symptom_user_date ON symptom_log (user, date)'],
    })
    app.save(symptomLog)

    // 4. mood_log
    const moodLog = new Collection({
      name: 'mood_log',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'date', type: 'date', required: true },
        {
          name: 'mood',
          type: 'select',
          required: true,
          values: ['Muito bom', 'Bom', 'Neutro', 'Ruim', 'Muito ruim'],
          maxSelect: 1,
        },
        { name: 'fatigue_level', type: 'number', min: 0, max: 10 },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_mood_user_date ON mood_log (user, date)'],
    })
    app.save(moodLog)

    // 5. sleep_log
    const sleepLog = new Collection({
      name: 'sleep_log',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'date', type: 'date', required: true },
        { name: 'hours', type: 'number', min: 0, max: 24 },
        { name: 'quality', type: 'number', min: 1, max: 5 },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_sleep_user_date ON sleep_log (user, date)'],
    })
    app.save(sleepLog)

    // 6. exercise_log
    const exerciseLog = new Collection({
      name: 'exercise_log',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'date', type: 'date', required: true },
        {
          name: 'activity_type',
          type: 'select',
          required: true,
          values: [
            'Caminhada',
            'Alongamento',
            'Musculação',
            'Natação',
            'Yoga',
            'Bicicleta',
            'Outro',
          ],
          maxSelect: 1,
        },
        { name: 'duration_minutes', type: 'number', min: 0 },
        {
          name: 'intensity',
          type: 'select',
          values: ['Leve', 'Moderada', 'Intensa'],
          maxSelect: 1,
        },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_exercise_user_date ON exercise_log (user, date)'],
    })
    app.save(exerciseLog)

    // 7. nutrition_log
    const nutritionLog = new Collection({
      name: 'nutrition_log',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'date', type: 'date', required: true },
        {
          name: 'meal',
          type: 'select',
          required: true,
          values: ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'],
          maxSelect: 1,
        },
        { name: 'description', type: 'text' },
        { name: 'hydration', type: 'number', min: 0 },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_nutrition_user_date ON nutrition_log (user, date)'],
    })
    app.save(nutritionLog)

    // 8. medication
    const medication = new Collection({
      name: 'medication',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'dosage', type: 'text' },
        {
          name: 'frequency',
          type: 'select',
          required: true,
          values: [
            'Uma vez ao dia',
            'Duas vezes ao dia',
            'Três vezes ao dia',
            'Semanal',
            'Conforme necessário',
          ],
          maxSelect: 1,
        },
        { name: 'time', type: 'text' },
        { name: 'start_date', type: 'date' },
        { name: 'end_date', type: 'date' },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_medication_user_active ON medication (user, active)'],
    })
    app.save(medication)

    // 9. exam
    const exam = new Collection({
      name: 'exam',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['Sangue', 'Imagem', 'Urina', 'Outro'],
          maxSelect: 1,
        },
        { name: 'scheduled_date', type: 'date' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['Agendado', 'Realizado', 'Resultado disponível'],
          maxSelect: 1,
        },
        { name: 'result', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_exam_user_status ON exam (user, status)'],
    })
    app.save(exam)

    // 10. consultation
    const consultation = new Collection({
      name: 'consultation',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'specialty', type: 'text' },
        { name: 'doctor_name', type: 'text' },
        { name: 'scheduled_date', type: 'date' },
        { name: 'location', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['Agendada', 'Realizada', 'Cancelada'],
          maxSelect: 1,
        },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_consultation_user_status ON consultation (user, status)'],
    })
    app.save(consultation)

    // 11. vaccination
    const vaccination = new Collection({
      name: 'vaccination',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'vaccine_name', type: 'text', required: true },
        { name: 'dose', type: 'text' },
        { name: 'scheduled_date', type: 'date' },
        { name: 'administered_date', type: 'date' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['Pendente', 'Agendada', 'Aplicada'],
          maxSelect: 1,
        },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_vaccination_user_status ON vaccination (user, status)'],
    })
    app.save(vaccination)
  },
  (app) => {
    const collections = [
      'vaccination',
      'consultation',
      'exam',
      'medication',
      'nutrition_log',
      'exercise_log',
      'sleep_log',
      'mood_log',
      'symptom_log',
      'self_care_plan',
      'chronic_condition',
    ]
    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
  },
)
