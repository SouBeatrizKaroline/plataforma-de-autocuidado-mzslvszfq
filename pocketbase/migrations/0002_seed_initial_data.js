migrate(
  (app) => {
    const conditions = [
      {
        name: 'Diabetes',
        description: 'Monitoramento de glicemia, dieta equilibrada e exercícios.',
        icon: 'Activity',
        color: '#f59e0b',
      },
      {
        name: 'Hipertensão',
        description: 'Controle da pressão arterial, redução de sódio e rotina de sono.',
        icon: 'Heart',
        color: '#ef4444',
      },
      {
        name: 'Asma',
        description: 'Prevenção de gatilhos respiratórios e uso de broncodilatadores.',
        icon: 'Wind',
        color: '#3b82f6',
      },
      {
        name: 'DPOC',
        description: 'Cuidados pulmonares, reabilitação respiratória e exercícios leves.',
        icon: 'Lungs',
        color: '#0284c7',
      },
      {
        name: 'Artrite',
        description: 'Proteção articular, mobilidade diária e manejo de dor inflamatória.',
        icon: 'Bone',
        color: '#8b5cf6',
      },
      {
        name: 'Insuficiência Cardíaca',
        description: 'Monitoramento de peso, edema e balanço hídrico.',
        icon: 'HeartPulse',
        color: '#ec4899',
      },
      {
        name: 'Doença Renal Crônica',
        description: 'Acompanhamento da função renal, hidratação e restrição de potássio.',
        icon: 'ShieldAlert',
        color: '#10b981',
      },
      {
        name: 'Fibromialgia',
        description: 'Manejo da dor crônica, fadiga, higiene do sono e atividade física adaptada.',
        icon: 'Zap',
        color: '#a855f7',
      },
      {
        name: 'Lúpus',
        description: 'Controle autoimune, proteção solar e prevenção de surtos.',
        icon: 'Sun',
        color: '#eab308',
      },
      {
        name: 'Esclerose Múltipla',
        description: 'Conservação de energia, fisioterapia e gerenciamento de fadiga.',
        icon: 'Brain',
        color: '#0d9488',
      },
    ]

    const ccCol = app.findCollectionByNameOrId('chronic_condition')
    const seededCCs = []
    for (const item of conditions) {
      try {
        const existing = app.findFirstRecordByData('chronic_condition', 'name', item.name)
        seededCCs.push(existing)
      } catch (_) {
        const rec = new Record(ccCol)
        rec.set('name', item.name)
        rec.set('description', item.description)
        rec.set('icon', item.icon)
        rec.set('color', item.color)
        app.save(rec)
        seededCCs.push(rec)
      }
    }

    // Seed user
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    let seedUser
    try {
      seedUser = app.findAuthRecordByEmail('_pb_users_auth_', '1aspiraqualquer@gmail.com')
    } catch (_) {
      seedUser = new Record(usersCol)
      seedUser.setEmail('1aspiraqualquer@gmail.com')
      seedUser.setPassword('Skip@Pass')
      seedUser.setVerified(true)
      seedUser.set('name', 'Maria Silva')
      app.save(seedUser)
    }

    // Seed self care plan
    try {
      app.findFirstRecordByData('self_care_plan', 'user', seedUser.id)
    } catch (_) {
      const scpCol = app.findCollectionByNameOrId('self_care_plan')
      const plan = new Record(scpCol)
      plan.set('user', seedUser.id)
      plan.set('condition', [seededCCs[0].id, seededCCs[1].id])
      plan.set(
        'goals',
        'Manter glicemia em jejum abaixo de 110 mg/dL e pressão arterial em 120x80 mmHg. Realizar 30 min de caminhada 5x por semana.',
      )
      plan.set(
        'daily_routine',
        '07:00 - Tomar medicação da manhã e medir pressão\n12:30 - Almoço saudável com salada\n18:00 - Caminhada leve\n22:00 - Higiene do sono',
      )
      plan.set(
        'triggers',
        'Estresse elevado, noites mal dormidas, excesso de sal/açúcar nas refeições, dias muito quentes.',
      )
      plan.set(
        'prevention_notes',
        'Beber no mínimo 2 litros de água por dia. Evitar alimentos ultraprocessados. Medir glicemia 2x ao dia.',
      )
      app.save(plan)
    }

    // Seed logs (symptoms, mood, sleep, exercise, nutrition)
    const now = new Date()
    const formatIsoDate = (daysAgo) => {
      const d = new Date(now)
      d.setDate(d.getDate() - daysAgo)
      return d.toISOString()
    }

    // Symptom logs
    const sympCol = app.findCollectionByNameOrId('symptom_log')
    const sampleSymptoms = [
      {
        daysAgo: 0,
        type: 'Dor',
        intensity: 3,
        duration: '30 min',
        crisis: false,
        notes: 'Leve dor articular pela manhã.',
      },
      {
        daysAgo: 1,
        type: 'Fadiga',
        intensity: 4,
        duration: 'Manhã inteira',
        crisis: false,
        notes: 'Sensação de cansaço após dia estressante.',
      },
      {
        daysAgo: 3,
        type: 'Tontura',
        intensity: 2,
        duration: '10 min',
        crisis: false,
        notes: 'Tontura rápida ao levantar.',
      },
      {
        daysAgo: 5,
        type: 'Dor',
        intensity: 6,
        duration: '2 horas',
        crisis: true,
        notes: 'Dor de cabeça moderada a forte.',
      },
    ]
    for (const s of sampleSymptoms) {
      try {
        const rec = new Record(sympCol)
        rec.set('user', seedUser.id)
        rec.set('date', formatIsoDate(s.daysAgo))
        rec.set('symptom_type', s.type)
        rec.set('intensity', s.intensity)
        rec.set('duration', s.duration)
        rec.set('is_crisis', s.crisis)
        rec.set('notes', s.notes)
        app.save(rec)
      } catch (_) {}
    }

    // Mood logs
    const moodCol = app.findCollectionByNameOrId('mood_log')
    const sampleMoods = [
      { daysAgo: 0, mood: 'Bom', fatigue: 3, notes: 'Dia tranquilo e produtivo.' },
      { daysAgo: 1, mood: 'Muito bom', fatigue: 2, notes: 'Caminhada matinal me deu energia.' },
      { daysAgo: 2, mood: 'Neutro', fatigue: 5, notes: 'Dia de trabalho corrido.' },
      { daysAgo: 3, mood: 'Ruim', fatigue: 7, notes: 'Pouco sono na noite anterior.' },
      { daysAgo: 4, mood: 'Bom', fatigue: 3, notes: 'Boa recuperação com descanso.' },
    ]
    for (const m of sampleMoods) {
      try {
        const rec = new Record(moodCol)
        rec.set('user', seedUser.id)
        rec.set('date', formatIsoDate(m.daysAgo))
        rec.set('mood', m.mood)
        rec.set('fatigue_level', m.fatigue)
        rec.set('notes', m.notes)
        app.save(rec)
      } catch (_) {}
    }

    // Sleep logs
    const sleepCol = app.findCollectionByNameOrId('sleep_log')
    const sampleSleep = [
      { daysAgo: 0, hours: 7.5, quality: 4, notes: 'Acordei descansada.' },
      { daysAgo: 1, hours: 8, quality: 5, notes: 'Sono profundo e contínuo.' },
      { daysAgo: 2, hours: 6, quality: 3, notes: 'Demorei a pegar no sono.' },
      { daysAgo: 3, hours: 5.5, quality: 2, notes: 'Acordei no meio da noite.' },
    ]
    for (const sl of sampleSleep) {
      try {
        const rec = new Record(sleepCol)
        rec.set('user', seedUser.id)
        rec.set('date', formatIsoDate(sl.daysAgo))
        rec.set('hours', sl.hours)
        rec.set('quality', sl.quality)
        rec.set('notes', sl.notes)
        app.save(rec)
      } catch (_) {}
    }

    // Exercise logs
    const exCol = app.findCollectionByNameOrId('exercise_log')
    const sampleEx = [
      {
        daysAgo: 0,
        type: 'Caminhada',
        mins: 30,
        int: 'Moderada',
        notes: 'No parque perto de casa.',
      },
      { daysAgo: 2, type: 'Alongamento', mins: 20, int: 'Leve', notes: 'Foco em coluna e ombros.' },
      {
        daysAgo: 4,
        type: 'Yoga',
        mins: 45,
        int: 'Moderada',
        notes: 'Sessão de relaxamento guiadada.',
      },
    ]
    for (const e of sampleEx) {
      try {
        const rec = new Record(exCol)
        rec.set('user', seedUser.id)
        rec.set('date', formatIsoDate(e.daysAgo))
        rec.set('activity_type', e.type)
        rec.set('duration_minutes', e.mins)
        rec.set('intensity', e.int)
        rec.set('notes', e.notes)
        app.save(rec)
      } catch (_) {}
    }

    // Nutrition logs
    const nutCol = app.findCollectionByNameOrId('nutrition_log')
    const sampleNut = [
      {
        daysAgo: 0,
        meal: 'Café da manhã',
        desc: 'Mamão, aveia e café com leite desnatado.',
        hydr: 2,
        notes: 'Sem açúcar adicionado.',
      },
      {
        daysAgo: 0,
        meal: 'Almoço',
        desc: 'Arroz integral, feijão, frango grelhado e salada verde.',
        hydr: 5,
        notes: 'Boa saciedade.',
      },
    ]
    for (const n of sampleNut) {
      try {
        const rec = new Record(nutCol)
        rec.set('user', seedUser.id)
        rec.set('date', formatIsoDate(n.daysAgo))
        rec.set('meal', n.meal)
        rec.set('description', n.desc)
        rec.set('hydration', n.hydr)
        rec.set('notes', n.notes)
        app.save(rec)
      } catch (_) {}
    }

    // Medications
    const medCol = app.findCollectionByNameOrId('medication')
    const sampleMeds = [
      { name: 'Losartana', dosage: '50mg', freq: 'Uma vez ao dia', time: '08:00', active: true },
      {
        name: 'Metformina',
        dosage: '850mg',
        freq: 'Duas vezes ao dia',
        time: '12:00, 20:00',
        active: true,
      },
      { name: 'Omeprazol', dosage: '20mg', freq: 'Uma vez ao dia', time: '07:00', active: false },
    ]
    for (const m of sampleMeds) {
      try {
        const rec = new Record(medCol)
        rec.set('user', seedUser.id)
        rec.set('name', m.name)
        rec.set('dosage', m.dosage)
        rec.set('frequency', m.freq)
        rec.set('time', m.time)
        rec.set('start_date', formatIsoDate(30))
        rec.set('active', m.active)
        app.save(rec)
      } catch (_) {}
    }

    // Exams
    const examCol = app.findCollectionByNameOrId('exam')
    const sampleExams = [
      {
        name: 'Hemoglobina Glicada (HbA1c)',
        type: 'Sangue',
        date: formatIsoDate(-7),
        status: 'Agendado',
        result: '',
      },
      {
        name: 'Perfil Lipídico Completo',
        type: 'Sangue',
        date: formatIsoDate(14),
        status: 'Resultado disponível',
        result: 'Colesterol total: 185 mg/dL, HDL: 52 mg/dL, Triglicerídeos: 130 mg/dL',
      },
      {
        name: 'Ultrassom Abdominal',
        type: 'Imagem',
        date: formatIsoDate(45),
        status: 'Realizado',
        result: 'Exame normal dentro dos padrões esperados.',
      },
    ]
    for (const ex of sampleExams) {
      try {
        const rec = new Record(examCol)
        rec.set('user', seedUser.id)
        rec.set('name', ex.name)
        rec.set('type', ex.type)
        rec.set('scheduled_date', ex.date)
        rec.set('status', ex.status)
        rec.set('result', ex.result)
        app.save(rec)
      } catch (_) {}
    }

    // Consultations
    const consCol = app.findCollectionByNameOrId('consultation')
    const sampleCons = [
      {
        spec: 'Endocrinologia',
        doc: 'Dra. Ana Paula Carvalho',
        date: formatIsoDate(-5),
        loc: 'Clínica Médica Vida - Sala 302',
        status: 'Agendada',
        notes: 'Levar diário de glicemia dos últimos 30 dias.',
      },
      {
        spec: 'Cardiologia',
        doc: 'Dr. Roberto Martins',
        date: formatIsoDate(30),
        loc: 'Hospital São Lucas',
        status: 'Realizada',
        notes: 'Manter dose da Losartana e repetir eletro em 6 meses.',
      },
    ]
    for (const c of sampleCons) {
      try {
        const rec = new Record(consCol)
        rec.set('user', seedUser.id)
        rec.set('specialty', c.spec)
        rec.set('doctor_name', c.doc)
        rec.set('scheduled_date', c.date)
        rec.set('location', c.loc)
        rec.set('status', c.status)
        rec.set('notes', c.notes)
        app.save(rec)
      } catch (_) {}
    }

    // Vaccinations
    const vacCol = app.findCollectionByNameOrId('vaccination')
    const sampleVac = [
      {
        name: 'Influenza (Gripe)',
        dose: 'Dose Anual',
        sched: formatIsoDate(-10),
        admin: '',
        status: 'Agendada',
        notes: 'Campanha de vacinação do ano vigente.',
      },
      {
        name: 'Pneumocócica 23',
        dose: 'Dose Única',
        sched: formatIsoDate(60),
        admin: formatIsoDate(60),
        status: 'Aplicada',
        notes: 'Proteção contra infecções pneumocócicas.',
      },
    ]
    for (const v of sampleVac) {
      try {
        const rec = new Record(vacCol)
        rec.set('user', seedUser.id)
        rec.set('vaccine_name', v.name)
        rec.set('dose', v.dose)
        rec.set('scheduled_date', v.sched)
        if (v.admin) rec.set('administered_date', v.admin)
        rec.set('status', v.status)
        rec.set('notes', v.notes)
        app.save(rec)
      } catch (_) {}
    }
  },
  (app) => {},
)
