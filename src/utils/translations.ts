// Système de traduction français
export const translations = {
  // Navigation
  dashboard: 'Tableau de bord',
  tasks: 'Tâches',
  addTask: 'Ajouter une tâche',
  settings: 'Paramètres',

  // Dashboard
  welcomeBack: 'Bon retour ! 👋',
  todayActivity: 'Voici ce qui se passe avec vos tâches aujourd\'hui.',
  totalTasks: 'Total des tâches',
  completed: 'Terminées',
  active: 'Actives',
  highPriority: 'Priorité élevée',
  progressOverview: 'Aperçu des progrès',
  complete: 'Terminé',
  completedToday: 'Terminées aujourd\'hui',
  remaining: 'Restantes',
  quickActions: 'Actions rapides',
  addNewTask: 'Ajouter une nouvelle tâche',
  viewAllTasks: 'Voir toutes les tâches',
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
  additionalDetails: 'Ajouter des détails supplémentaires...',
  priorityLevel: 'Niveau de priorité',
  lowPriority: 'Priorité faible',
  mediumPriority: 'Priorité moyenne',

  category: 'Catégorie',
  personal: 'Personnel',
  work: 'Travail',
  shopping: 'Courses',
  health: 'Santé',
  dueDate: 'Date d\'échéance',
  optional: '(Optionnel)',
  assignedTo: 'Assigné à',
  assignToSomeone: 'Nom de la personne...',
  cancel: 'Annuler',
  updateTask: 'Mettre à jour la tâche',
  createTask: 'Créer la tâche',
  updating: 'Mise à jour...',
  creating: 'Création...',

  // Settings
  manageAccount: 'Gérer votre compte et les préférences de l\'application',
  profile: 'Profil',
  preferences: 'Préférences',
  dataPrivacy: 'Données et confidentialité',
  profileInformation: 'Informations du profil',
  displayName: 'Nom d\'affichage',
  emailAddress: 'Adresse e-mail',
  yourStatistics: 'Vos statistiques',
  completionRate: 'Taux de réussite',
  theme: 'Thème',
  light: 'Clair',
  dark: 'Sombre',
  system: 'Système',
  notificationsBehavior: 'Notifications et comportement',
  pushNotifications: 'Notifications push',
  notificationDesc: 'Être notifié des dates d\'échéance et des rappels',
  autoSave: 'Sauvegarde automatique',
  autoSaveDesc: 'Sauvegarder automatiquement les modifications lors de la saisie',
  completionSound: 'Son de completion',
  completionSoundDesc: 'Jouer un son lors de la completion des tâches',
  dataManagement: 'Gestion des données',
  exportData: 'Exporter les données',
  downloadAllData: 'Télécharger toutes vos tâches et paramètres',
  export: 'Exporter',
  importData: 'Importer les données',
  restoreBackup: 'Restaurer à partir d\'une sauvegarde précédente',
  import: 'Importer',
  clearAllData: 'Effacer toutes les données',
  permanentlyDelete: 'Supprimer définitivement toutes les tâches et paramètres',
  clearData: 'Effacer les données',
  privacyInformation: 'Informations sur la confidentialité',
  settingsSaved: 'Paramètres sauvegardés avec succès !',

  // Priority labels
  priority: 'priorité',
  low: 'faible',
  medium: 'moyenne',
  high: 'élevée',

  // Categories
  categories: {
    personal: 'personnel',
    work: 'travail',
    shopping: 'courses',
    health: 'santé'
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

  // Confirmation messages
  confirmClearData: 'Êtes-vous sûr de vouloir effacer toutes les données ? Cette action ne peut pas être annulée.',
  dataImportedSuccess: 'Données importées avec succès ! Veuillez actualiser la page pour voir les tâches importées.',
  importError: 'Erreur lors de l\'importation des données. Veuillez vérifier le format du fichier.',

  // Privacy text
  privacyText: {
    intro: 'Vos données sont stockées localement dans votre navigateur et ne sont envoyées à aucun serveur externe. Nous ne collectons, ne stockons ni ne partageons aucune information personnelle.',
    points: [
      'Toutes les tâches et paramètres sont stockés dans le localStorage de votre navigateur',
      'Aucune inscription ou connexion de compte requise',
      'L\'export/import de données vous permet de sauvegarder et transférer vos données',
      'Effacer les données du navigateur supprimera toutes les tâches et paramètres'
    ]
  },

  // Messages d'erreur
  errorOccurred: 'Une erreur est survenue',
  errorMessage: 'Nous sommes désolés, une erreur inattendue s\'est produite. Veuillez rafraîchir la page pour réessayer.',
  refreshPage: 'Rafraîchir la page',
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