// Système de traduction français
export const translations = {
  // Navigation
  dashboard: 'Tableau de bord',
  tasks: 'Tâches',
  addTask: 'Ajouter une tâche',
  settings: 'Paramètres',
  customizeApp: 'Personnalisez votre expérience',

  // Thème et apparence
  appearance: 'Apparence',
  theme: 'Thème',
  light: 'Clair',
  dark: 'Sombre',
  system: 'Système',
  lightMode: 'Mode clair',
  darkMode: 'Mode sombre',
  accentColor: 'Couleur d\'accent',

  // Dashboard
  welcomeBack: 'Bon retour ! 👋',
  todayActivity: 'Voici ce qui se passe avec vos tâches aujourd\'hui.',
  totalTasks: 'Total des tâches',
  completed: 'Terminées',
  active: 'Actives',
  progressOverview: 'Aperçu des progrès',
  quickActions: 'Actions rapides',
  recentTasks: 'Tâches récentes',
  noTasksYet: 'Aucune tâche pour le moment',
  createFirstTask: 'Créer votre première tâche',
  viewAll: 'Voir tout →',

  // Task List
  manageTrackTasks: 'Gérer et suivre vos tâches',
  searchTasks: 'Rechercher des tâches...',
  filters: 'Filtres',
  allTasks: 'Toutes les tâches',
  noTasksFound: 'Aucune tâche trouvée',
  tryAdjusting: 'Essayez d\'ajuster votre recherche ou vos filtres',

  // Add/Edit Task
  editTask: 'Modifier la tâche',
  addNewTaskTitle: 'Ajouter une nouvelle tâche',
  updateTaskDetails: 'Mettre à jour les détails de votre tâche',
  createNewTask: 'Créer une nouvelle tâche pour rester organisé',
  taskTitle: 'Titre de la tâche',
  whatNeedsDone: 'Que faut-il faire ?',
  description: 'Description',
  additionalDetails: 'Détails supplémentaires (optionnel)',
  priorityLevel: 'Niveau de priorité',
  lowPriority: 'Basse priorité',
  mediumPriority: 'Priorité moyenne',
  highPriority: 'Haute priorité',
  category: 'Catégorie',
  dueDate: 'Date d\'échéance',
  optional: '(Optionnel)',
  cancel: 'Annuler',
  updateTask: 'Mettre à jour la tâche',
  createTask: 'Créer la tâche',
  updating: 'Mise à jour...',
  creating: 'Création...',

  // Settings
  manageAccount: 'Gérer votre compte et les préférences',
  profile: 'Profil',
  preferences: 'Préférences',
  dataPrivacy: 'Données & Confidentialité',
  profileInformation: 'Informations du profil',
  displayName: 'Nom d\'affichage',
  emailAddress: 'Adresse e-mail',
  yourStatistics: 'Vos statistiques',
  completionRate: 'Taux de complétion',
  notificationsBehavior: 'Notifications & Comportement',
  pushNotifications: 'Notifications push',
  notificationDesc: 'Recevez des alertes pour les tâches importantes',
  autoSave: 'Sauvegarde automatique',
  autoSaveDesc: 'Sauvegardez automatiquement vos modifications',
  completionSound: 'Son de complétion',
  completionSoundDesc: 'Jouer un son lors de la complétion d\'une tâche',

  // Data Management
  dataManagement: 'Gestion des données',
  exportData: 'Exporter les données',
  downloadAllData: 'Télécharger toutes vos données',
  importData: 'Importer les données',
  restoreBackup: 'Restaurer une sauvegarde',
  clearAllData: 'Effacer toutes les données',
  permanentlyDelete: 'Supprimer définitivement toutes vos données',
  export: 'Exporter',
  import: 'Importer',
  clearData: 'Effacer',
  confirmClearData: 'Êtes-vous sûr de vouloir effacer toutes vos données ? Cette action est irréversible.',
  dataImportedSuccess: 'Données importées avec succès',
  importError: 'Erreur lors de l\'importation des données',
  settingsSaved: 'Paramètres enregistrés',

  // Privacy
  privacyInformation: 'Informations de confidentialité',
  privacyText: {
    intro: 'Nous prenons votre confidentialité au sérieux. Voici comment nous gérons vos données :',
    points: [
      'Toutes vos données sont stockées localement sur votre appareil',
      'Aucune donnée n\'est envoyée à des serveurs externes',
      'Vos préférences sont sauvegardées dans le stockage local du navigateur',
      'Vous pouvez exporter ou supprimer vos données à tout moment'
    ]
  },

  // Priority and Status
  priority: 'priorité',
  low: 'faible',
  medium: 'moyenne',
  high: 'élevée',
  complete: 'Terminé',
  remaining: 'Restantes',

  // Categories
  categories: {
    personal: 'Personnel',
    work: 'Travail',
    shopping: 'Courses',
    health: 'Santé'
  },

  // Date formatting
  created: 'Créé le',
  updated: 'Mis à jour le',
  due: 'Échéance',

  // Actions
  edit: 'Modifier',
  delete: 'Supprimer',
  save: 'Sauvegarder',

  // Validation messages
  titleRequired: 'Le titre est requis',
  titleTooLong: 'Le titre doit faire moins de 100 caractères',
  descriptionTooLong: 'La description doit faire moins de 500 caractères',
  dueDatePast: 'La date d\'échéance ne peut pas être dans le passé',

  // Version and Updates
  version: 'Version',
  checkUpdates: 'Vérifier les mises à jour'
};

// Fonction utilitaire pour obtenir une traduction
export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

// Formatage des dates en français
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};