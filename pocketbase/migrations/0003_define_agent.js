migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'self-care-guide',
      name: 'Guia de Autocuidado',
      description: 'Assistente especializado em autocuidado para pessoas com doenças crônicas.',
      systemPrompt:
        "Você é o 'Guia de Autocuidado', um assistente virtual empático, acolhedor e altamente didático em português do Brasil (pt-BR). Seu objetivo é educar e apoiar pessoas com condições crônicas (como diabetes, hipertensão, asma, DPOC, artrite, insuficiência cardíaca, doença renal, fibromialgia, lúpus e esclerose múltipla) no gerenciamento da saúde, no manejo de sintomas, na adesão ao tratamento e na preparação para consultas médicas. IMPORTANTE: Suas respostas são educativas e explicativas. Você JAMAIS deve fornecer diagnósticos ou alterar prescrições médicas. Sempre reforce amigavelmente que suas orientações não substituem o acompanhamento com profissionais de saúde. Ao utilizar dados do histórico do usuário (sintomas, medicamentos, rotina), cite as informações relevantes com carinho e clareza.",
      tier: 'fast',
      tools: [
        { collection: 'self_care_plan', perms: { list: true, read: true } },
        { collection: 'symptom_log', perms: { list: true, read: true } },
        { collection: 'mood_log', perms: { list: true, read: true } },
        { collection: 'sleep_log', perms: { list: true, read: true } },
        { collection: 'exercise_log', perms: { list: true, read: true } },
        { collection: 'nutrition_log', perms: { list: true, read: true } },
        { collection: 'medication', perms: { list: true, read: true } },
        { collection: 'exam', perms: { list: true, read: true } },
        { collection: 'consultation', perms: { list: true, read: true } },
        { collection: 'vaccination', perms: { list: true, read: true } },
      ],
      memory: [
        {
          type: 'faq',
          payload: {
            qa: [
              {
                question: 'Como se preparar para uma consulta médica?',
                answer:
                  'Anote seus sintomas recentes, frequência, intensidade e dúvidas em um papel ou no aplicativo. Leve a lista de medicamentos em uso com dosagens e horários. Informe ao médico sobre mudanças na rotina ou efeitos colaterais.',
              },
              {
                question: 'O que fazer em caso de crise ou sinal de alerta?',
                answer:
                  'Identifique os sinais de alerta específicos da sua condição (ex: falta de ar grave na asma, tontura/visão turva na hipertensão, tremores/suor frio na hipoglicemia). Mantenha contatos de emergência e siga o plano de ação acordado com seu médico. Em casos graves, busque atendimento imediato.',
              },
              {
                question: 'Como melhorar a adesão aos medicamentos?',
                answer:
                  'Associe a tomada do remédio a hábitos diários (como escovar os dentes ou tomar café). Utilize alarmes no celular ou organizadores de comprimidos. Mantenha os medicamentos em local visível e seguro.',
              },
            ],
          },
        },
        {
          type: 'text',
          payload: {
            text: 'O autocuidado em doenças crônicas envolve quatro pilares fundamentais: 1. Conhecimento sobre a própria condição; 2. Monitoramento regular de sintomas e sinais vitais; 3. Estilo de vida saudável (alimentação equilibrada, hidratação, atividade física adaptada e qualidade de sono); 4. Adesão ao tratamento medicamentoso e acompanhamento médico contínuo.',
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'self-care-guide')
    } catch (_) {}
  },
)
