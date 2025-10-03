import React from 'react';
import { Link } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t, formatDateShort } from '../utils/translations';
import { CheckCircle2, Clock, AlertCircle, Plus, TrendingUp } from 'lucide-react';
import { Box, Container, Typography, Card, CardContent, Grid, LinearProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard: React.FC = () => {
  const { todos, getStats } = useTodos();
  const { isDark } = useTheme();
  const stats = getStats();

  const recentTodos = todos
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statsCards = [
    { title: t('totalTasks'), value: stats.total, icon: CheckCircle2, color: '#3b82f6', bgColor: '#dbeafe' },
    { title: t('completed'), value: stats.completed, icon: CheckCircle2, color: '#10b981', bgColor: '#d1fae5' },
    { title: t('active'), value: stats.active, icon: Clock, color: '#f59e0b', bgColor: '#fed7aa' },
    { title: t('highPriority'), value: stats.inProgress, icon: AlertCircle, color: '#ef4444', bgColor: '#fee2e2' },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 6 } }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 1 }}>
              {t('welcomeBack')}
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)' }}>
              {t('todayActivity')}
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card
                  sx={{
                    bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 4,
                    border: `1px solid ${stat.bgColor}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 8px 24px ${stat.color}40`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: stat.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <stat.icon size={24} style={{ color: stat.color }} />
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)', mb: 0.5 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)' }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                sx={{
                  bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 4,
                  border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 232, 255, 0.5)'}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)' }}>
                      {t('progressOverview')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
                      <TrendingUp size={18} style={{ marginRight: 4 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {completionRate}% {t('complete')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)' }}>
                        {t('progressOverview')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)' }}>
                        {completionRate}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={completionRate}
                      sx={{
                        height: 12,
                        borderRadius: 2,
                        bgcolor: isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)', mb: 0.5 }}>
                        {t('completedToday')}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>
                        {stats.completed}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)', mb: 0.5 }}>
                        {t('remaining')}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        {stats.active}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                sx={{
                  bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 4,
                  border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 232, 255, 0.5)'}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 3 }}>
                    {t('quickActions')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        component={Link}
                        to="/add"
                        fullWidth
                        variant="outlined"
                        startIcon={<Plus size={20} />}
                        sx={{
                          borderRadius: 3,
                          borderWidth: 2,
                          borderStyle: 'dashed',
                          borderColor: '#667eea',
                          color: '#667eea',
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: '#5a67d8',
                            bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 232, 255, 0.5)',
                          },
                        }}
                      >
                        {t('addNewTask')}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        component={Link}
                        to="/todos"
                        fullWidth
                        variant="contained"
                        startIcon={<CheckCircle2 size={20} />}
                        sx={{
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                          },
                        }}
                      >
                        {t('viewAllTasks')}
                      </Button>
                    </motion.div>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card
            sx={{
              bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: 4,
              border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 232, 255, 0.5)'}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)' }}>
                  {t('recentTasks')}
                </Typography>
                <Link to="/todos" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', '&:hover': { color: '#5a67d8' } }}>
                    {t('viewAll')}
                  </Typography>
                </Link>
              </Box>

              {recentTodos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle2 size={48} style={{ color: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)', margin: '0 auto 16px' }} />
                  <Typography variant="body1" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)', mb: 2 }}>
                    {t('noTasksYet')}
                  </Typography>
                  <Button
                    component={Link}
                    to="/add"
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                    }}
                  >
                    {t('createFirstTask')}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentTodos.map((todo, index) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 3,
                          border: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#667eea',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: todo.completed ? '#10b981' : '#f59e0b',
                            mr: 2,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 500,
                              color: todo.completed ? (isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)') : (isDark ? 'white' : 'rgba(17, 24, 39, 1)'),
                              textDecoration: todo.completed ? 'line-through' : 'none',
                            }}
                          >
                            {todo.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)' }}>
                            {t(`categories.${todo.category}`)} • {t(todo.priority)} {t('priority')}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)' }}>
                          {formatDateShort(todo.updatedAt)}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;
