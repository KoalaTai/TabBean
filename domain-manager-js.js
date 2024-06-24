const domains = {
  'audit.coach': {
    name: 'Audit Coach',
    theme: 'blue',
    features: ['auditPlanning', 'checklistGeneration', 'realTimeScribing']
  },
  'auditprep.pro': {
    name: 'Audit Prep Pro',
    theme: 'green',
    features: ['regulatoryDatabase', 'auditSimulation', 'documentReview']
  },
  '2htkidneycare.ai': {
    name: '2HT Kidney Care AI',
    theme: 'purple',
    features: ['medicalDeviceRegulations', 'kidneySpecificAudits', 'patientDataAnalysis']
  },
  'chatalz.ai': {
    name: 'Chat ALZ AI',
    theme: 'orange',
    features: ['conversationalAI', 'medicalKnowledgeBase', 'patientInteractionSimulation']
  },
  'houseofbot.ai': {
    name: 'House of Bot AI',
    theme: 'red',
    features: ['aiAssistant', 'multiModelIntegration', 'customAITraining']
  }
  // Add other domains as needed
};

export const getCurrentDomain = () => {
  const hostname = window.location.hostname;
  return domains[hostname] || domains['audit.coach']; // Default to audit.coach if domain not found
};

export const getFeatures = () => {
  const currentDomain = getCurrentDomain();
  return currentDomain.features;
};

export const getTheme = () => {
  const currentDomain = getCurrentDomain();
  return currentDomain.theme;
};
