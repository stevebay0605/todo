import React, { useState, useEffect } from 'react';
import { useTodos } from '../contexts/TodoContext';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import { t } from '../utils/translations';
import { Download, Upload, Trash2, User, Bell, Palette, Moon, Sun, Check } from 'lucide-react';
import { Box, Container, Typography, Card, CardContent, TextField, Button, IconButton, Avatar, Tabs, Tab, Switch, Alert, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { theme, setTheme, isDark } = useAppTheme();
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

  const [activeTab, setActiveTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const themeOptions = [
    { value: 'light', label: t('light'), icon: Sun },
    { value: 'dark', label: t('dark'), icon: Moon },
    { value: 'system', label: t('system'), icon: Palette },
  ];

  const behaviorSettings = [
    { key: 'notifications', label: t('pushNotifications'), description: t('notificationDesc') },
    { key: 'autoSave', label: t('autoSave'), description: t('autoSaveDesc') },
    { key: 'completionSound', label: t('completionSound'), description: t('completionSoundDesc') },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 1 }}>
              {t('settings')}
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)' }}>
              {t('manageAccount')}
            </Typography>
          </Box>
        </motion.div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}
            >
              <Alert
                icon={<Check size={20} />}
                severity="success"
                sx={{
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
                  borderRadius: 3,
                }}
              >
                {t('settingsSaved')}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card
            sx={{
              bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: 4,
              border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 232, 255, 0.5)'}`,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}`,
                px: 3,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  minHeight: 60,
                },
                '& .Mui-selected': {
                  color: '#667eea',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                  height: 3,
                },
              }}
            >
              <Tab icon={<User size={18} />} iconPosition="start" label={t('profile')} />
              <Tab icon={<Palette size={18} />} iconPosition="start" label={t('preferences')} />
              <Tab icon={<Download size={18} />} iconPosition="start" label={t('dataPrivacy')} />
            </Tabs>

            <CardContent sx={{ p: 4 }}>
              {activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
                    <Box sx={{ position: 'relative', alignSelf: 'center' }}>
                      <Avatar
                        src={profile.avatar}
                        alt="Profile"
                        sx={{ width: 100, height: 100, border: `4px solid ${isDark ? '#764ba2' : '#c5cae9'}` }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: '#667eea',
                          color: 'white',
                          width: 36,
                          height: 36,
                          '&:hover': {
                            bgcolor: '#5a67d8',
                          },
                        }}
                      >
                        <User size={18} />
                      </IconButton>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 2 }}>
                        {t('profileInformation')}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)', mb: 1 }}>
                            {t('displayName')}
                          </Typography>
                          <TextField
                            fullWidth
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            onBlur={() => saveProfile(profile)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)', mb: 1 }}>
                            {t('emailAddress')}
                          </Typography>
                          <TextField
                            fullWidth
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            onBlur={() => saveProfile(profile)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  <Box sx={{ pt: 3, borderTop: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}` }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 3 }}>
                      {t('yourStatistics')}
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        { label: t('totalTasks'), value: stats.total, color: '#3b82f6', bg: '#dbeafe' },
                        { label: t('completed'), value: stats.completed, color: '#10b981', bg: '#d1fae5' },
                        { label: t('active'), value: stats.active, color: '#f59e0b', bg: '#fed7aa' },
                        { label: t('completionRate'), value: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`, color: '#a855f7', bg: '#e9d5ff' },
                      ].map((stat, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: isDark ? `${stat.color}20` : stat.bg,
                                textAlign: 'center',
                              }}
                            >
                              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                                {stat.value}
                              </Typography>
                              <Typography variant="caption" sx={{ color: isDark ? 'rgba(209, 213, 219, 1)' : 'rgba(55, 65, 81, 1)', fontWeight: 500 }}>
                                {stat.label}
                              </Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 3 }}>
                      {t('theme')}
                    </Typography>
                    <Grid container spacing={2}>
                      {themeOptions.map((option, index) => {
                        const Icon = option.icon;
                        return (
                          <Grid item xs={12} sm={4} key={option.value}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Button
                                fullWidth
                                variant={theme === option.value ? 'contained' : 'outlined'}
                                startIcon={<Icon size={20} />}
                                onClick={() => {
                                  setTheme(option.value as any);
                                  saveAppSettings({ ...settings, theme: option.value as any });
                                }}
                                sx={{
                                  borderRadius: 3,
                                  py: 2,
                                  borderWidth: 2,
                                  background: theme === option.value ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                  borderColor: theme === option.value ? '#667eea' : isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)',
                                  color: theme === option.value ? 'white' : isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)',
                                  '&:hover': {
                                    borderWidth: 2,
                                    borderColor: '#667eea',
                                  },
                                }}
                                endIcon={theme === option.value ? <Check size={18} /> : null}
                              >
                                {option.label}
                              </Button>
                            </motion.div>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>

                  <Box sx={{ pt: 3, borderTop: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}` }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 3 }}>
                      {t('notificationsBehavior')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {behaviorSettings.map((setting, index) => (
                        <motion.div
                          key={setting.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 2.5,
                              borderRadius: 3,
                              border: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#667eea',
                              },
                            }}
                          >
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 0.5 }}>
                                {setting.label}
                              </Typography>
                              <Typography variant="body2" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)' }}>
                                {setting.description}
                              </Typography>
                            </Box>
                            <Switch
                              checked={settings[setting.key as keyof AppSettings] as boolean}
                              onChange={() => saveAppSettings({ ...settings, [setting.key]: !settings[setting.key as keyof AppSettings] })}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#667eea',
                                  '& + .MuiSwitch-track': {
                                    backgroundColor: '#667eea',
                                  },
                                },
                              }}
                            />
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 3 }}>
                      {t('dataManagement')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <motion.div whileHover={{ x: 5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2.5,
                            borderRadius: 3,
                            border: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#667eea',
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 0.5 }}>
                              {t('exportData')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)' }}>
                              {t('downloadAllData')}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<Download size={18} />}
                            onClick={exportData}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              borderColor: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(209, 213, 219, 1)',
                              color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)',
                            }}
                          >
                            {t('export')}
                          </Button>
                        </Box>
                      </motion.div>

                      <motion.div whileHover={{ x: 5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2.5,
                            borderRadius: 3,
                            border: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#667eea',
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 0.5 }}>
                              {t('importData')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)' }}>
                              {t('restoreBackup')}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<Upload size={18} />}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              borderColor: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(209, 213, 219, 1)',
                              color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)',
                            }}
                          >
                            {t('import')}
                            <input type="file" accept=".json" onChange={importData} hidden />
                          </Button>
                        </Box>
                      </motion.div>

                      <motion.div whileHover={{ x: 5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2.5,
                            borderRadius: 3,
                            border: `2px solid ${isDark ? 'rgba(220, 38, 38, 0.3)' : 'rgba(254, 226, 226, 1)'}`,
                            bgcolor: isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgba(254, 242, 242, 1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#ef4444',
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#ef4444', mb: 0.5 }}>
                              {t('clearAllData')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(254, 202, 202, 1)' : 'rgba(185, 28, 28, 1)' }}>
                              {t('permanentlyDelete')}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<Trash2 size={18} />}
                            onClick={clearAllData}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              '&:hover': {
                                borderColor: '#dc2626',
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                              },
                            }}
                          >
                            {t('clearData')}
                          </Button>
                        </Box>
                      </motion.div>
                    </Box>
                  </Box>

                  <Box sx={{ pt: 3, borderTop: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}` }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 2 }}>
                      {t('privacyInformation')}
                    </Typography>
                    <Box sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)' }}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {t('privacyText.intro')}
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                        {t('privacyText.points').map((point: string, index: number) => (
                          <li key={index}>
                            <Typography variant="body2">{point}</Typography>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Settings;
