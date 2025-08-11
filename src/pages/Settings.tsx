import React, { useState, useEffect } from 'react';
import { useTodos } from '../contexts/TodoContext';
import { useTheme } from '../contexts/ThemeContext';
import { t } from '../utils/translations';
import { Download, Upload, Trash2, User, Bell, Palette, Moon, Sun, Check } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoSave: boolean;
  completionSound: boolean;
}

const Settings: React.FC = () => {
  const { todos, getStats } = useTodos();
  const { theme, setTheme } = useTheme();
  const stats = getStats();

  const [profile, setProfile] = useState<UserProfile>({
    name: 'TaskFlow User',
    email: 'user@taskflow.com',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  });

  const [settings, setSettings] = useState<AppSettings>({
    theme: theme,
    notifications: true,
    autoSave: true,
    completionSound: false,
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data'>('profile');
  const [showSuccess, setShowSuccess] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveAppSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    showSuccessMessage();
  };

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    showSuccessMessage();
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const exportData = () => {
    const data = {
      todos,
      profile,
      settings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccessMessage();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (importedData.settings) {
          saveAppSettings(importedData.settings);
        }
        if (importedData.profile) {
          saveProfile(importedData.profile);
        }
        
        // Note: In a real app, you'd also import todos through the context
        alert(t('dataImportedSuccess'));
      } catch (error) {
        alert(t('importError'));
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm(t('confirmClearData'))) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'preferences', label: t('preferences'), icon: Palette },
    { id: 'data', label: t('dataPrivacy'), icon: Download },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('settings')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('manageAccount')}</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center animate-slide-in">
            <Check className="h-5 w-5 mr-2" />
            {t('settingsSaved')}
          </div>
        )}

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-600">
            <nav className="flex space-x-8 px-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center ${
                    activeTab === id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 dark:border-purple-800"
                    />
                    <div className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-2 cursor-pointer hover:bg-purple-600 transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('profileInformation')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('displayName')}
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          onBlur={() => saveProfile(profile)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('emailAddress')}
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          onBlur={() => saveProfile(profile)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('yourStatistics')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">{t('totalTasks')}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                      <p className="text-sm text-green-700 dark:text-green-400">{t('completed')}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{stats.active}</p>
                      <p className="text-sm text-orange-700 dark:text-orange-400">{t('active')}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-400">{t('completionRate')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('theme')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: t('light'), icon: Sun },
                      { value: 'dark', label: t('dark'), icon: Moon },
                      { value: 'system', label: t('system'), icon: Palette },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setTheme(value as any);
                          saveAppSettings({ ...settings, theme: value as any });
                        }}
                        className={`flex items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                          theme === value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                        {theme === value && (
                          <Check className="h-4 w-4 ml-auto text-purple-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('notificationsBehavior')}</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'notifications', label: t('pushNotifications'), description: t('notificationDesc') },
                      { key: 'autoSave', label: t('autoSave'), description: t('autoSaveDesc') },
                      { key: 'completionSound', label: t('completionSound'), description: t('completionSoundDesc') },
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                        </div>
                        <button
                          onClick={() => saveAppSettings({ ...settings, [key]: !settings[key as keyof AppSettings] })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                            settings[key as keyof AppSettings] ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings[key as keyof AppSettings] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('dataManagement')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{t('exportData')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('downloadAllData')}</p>
                      </div>
                      <button
                        onClick={exportData}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('export')}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{t('importData')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('restoreBackup')}</p>
                      </div>
                      <label className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('import')}
                        <input
                          type="file"
                          accept=".json"
                          onChange={importData}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30">
                      <div>
                        <h4 className="font-medium text-red-900 dark:text-red-400">{t('clearAllData')}</h4>
                        <p className="text-sm text-red-700 dark:text-red-400">{t('permanentlyDelete')}</p>
                      </div>
                      <button
                        onClick={clearAllData}
                        className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('clearData')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('privacyInformation')}</h3>
                  <div className="prose prose-sm text-gray-600 dark:text-gray-400">
                    <p>
                      {t('privacyText.intro')}
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      {t('privacyText.points').map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;