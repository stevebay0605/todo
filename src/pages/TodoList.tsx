import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t, formatDateShort } from '../utils/translations';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';
import { Box, Container, Typography, Button, TextField, InputAdornment, Card, CardContent, IconButton, Chip, Skeleton, Collapse } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const TodoList: React.FC = () => {
  const {
    todos,
    filter,
    searchTerm,
    setFilter,
    setSearchTerm,
    toggleTodo,
    deleteTodo,
    getFilteredTodos,
    loading
  } = useTodos();

  const { isDark } = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const filteredTodos = getFilteredTodos();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { text: 'error', bg: '#fee2e2' };
      case 'medium': return { text: 'warning', bg: '#fed7aa' };
      case 'low': return { text: 'success', bg: '#d1fae5' };
      default: return { text: 'default', bg: '#f3f4f6' };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'primary';
      case 'personal': return 'secondary';
      case 'shopping': return 'error';
      case 'health': return 'success';
      default: return 'default';
    }
  };

  const filterOptions = [
    { value: 'all', label: t('allTasks'), count: todos.length },
    { value: 'active', label: t('active'), count: todos.filter(t => !t.completed).length },
    { value: 'completed', label: t('completed'), count: todos.filter(t => t.completed).length },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 1 }}>
                {t('tasks')}
              </Typography>
              <Typography variant="body1" sx={{ color: isDark ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)' }}>
                {t('manageTrackTasks')}
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/add"
              variant="contained"
              startIcon={<Plus size={20} />}
              sx={{
                mt: { xs: 2, sm: 0 },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('addTask')}
            </Button>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card
            sx={{
              mb: 3,
              bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: 4,
              border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 232, 255, 0.5)'}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder={t('searchTasks')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Filter size={18} />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    borderColor: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(209, 213, 219, 1)',
                    color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)',
                    minWidth: 120,
                  }}
                >
                  {t('filters')}
                </Button>
              </Box>

              <Collapse in={showFilters}>
                <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 1)'}` }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {filterOptions.map((option) => (
                      <motion.div key={option.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Chip
                          label={`${option.label} (${option.count})`}
                          onClick={() => setFilter(option.value as any)}
                          sx={{
                            bgcolor: filter === option.value ? '#667eea' : isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(243, 244, 246, 1)',
                            color: filter === option.value ? 'white' : isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)',
                            fontWeight: 500,
                            px: 2,
                            py: 2.5,
                            fontSize: '0.875rem',
                            '&:hover': {
                              bgcolor: filter === option.value ? '#5a67d8' : isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(229, 231, 235, 1)',
                            },
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </motion.div>

        {loading ? (
          <Card sx={{ p: 4, bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={30} />
                    <Skeleton variant="text" width="50%" height={20} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        ) : filteredTodos.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <Card sx={{ p: 6, bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: 4, textAlign: 'center' }}>
              <CheckCircle2 size={64} style={{ color: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)', margin: '0 auto 16px' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)', mb: 1 }}>
                {searchTerm ? 'No tasks found' : 'No tasks yet'}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)', mb: 3 }}>
                {searchTerm ? t('tryAdjusting') : t('createFirstTask')}
              </Typography>
              {!searchTerm && (
                <Button
                  component={Link}
                  to="/add"
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 3,
                    py: 1.5,
                  }}
                >
                  {t('createFirstTask')}
                </Button>
              )}
            </Card>
          </motion.div>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AnimatePresence>
              {filteredTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card
                    sx={{
                      bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 4,
                      border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 232, 255, 0.5)'}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <IconButton
                          onClick={() => toggleTodo(todo.id)}
                          sx={{ p: 0.5, mt: 0.5 }}
                        >
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            {todo.completed ? (
                              <CheckCircle2 size={24} style={{ color: '#10b981' }} />
                            ) : (
                              <Circle size={24} style={{ color: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)' }} />
                            )}
                          </motion.div>
                        </IconButton>

                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: todo.completed ? (isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)') : (isDark ? 'white' : 'rgba(17, 24, 39, 1)'),
                                  textDecoration: todo.completed ? 'line-through' : 'none',
                                  mb: 0.5,
                                }}
                              >
                                {todo.title}
                              </Typography>
                              {todo.description && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: todo.completed ? (isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)') : (isDark ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)'),
                                    mb: 1.5,
                                  }}
                                >
                                  {todo.description}
                                </Typography>
                              )}

                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                                <Chip
                                  label={t(`categories.${todo.category}`)}
                                  color={getCategoryColor(todo.category) as any}
                                  size="small"
                                  sx={{ fontWeight: 500 }}
                                />
                                <Chip
                                  icon={todo.priority === 'high' ? <AlertTriangle size={14} /> : todo.priority === 'medium' ? <Clock size={14} /> : undefined}
                                  label={`${t(todo.priority)} ${t('priority')}`}
                                  size="small"
                                  sx={{
                                    bgcolor: getPriorityColor(todo.priority).bg,
                                    fontWeight: 500,
                                  }}
                                />
                                {todo.dueDate && (
                                  <Chip
                                    label={`${t('due')}: ${formatDateShort(todo.dueDate)}`}
                                    size="small"
                                    sx={{ bgcolor: '#e0e7ff', fontWeight: 500 }}
                                  />
                                )}
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton
                                  component={Link}
                                  to={`/edit/${todo.id}`}
                                  size="small"
                                  sx={{
                                    color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)',
                                    '&:hover': {
                                      color: '#667eea',
                                      bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 232, 255, 0.5)',
                                    },
                                  }}
                                >
                                  <Edit2 size={18} />
                                </IconButton>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton
                                  onClick={() => deleteTodo(todo.id)}
                                  size="small"
                                  sx={{
                                    color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)',
                                    '&:hover': {
                                      color: '#ef4444',
                                      bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(254, 242, 242, 0.5)',
                                    },
                                  }}
                                >
                                  <Trash2 size={18} />
                                </IconButton>
                              </motion.div>
                            </Box>
                          </Box>

                          <Typography variant="caption" sx={{ color: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(156, 163, 175, 1)', mt: 1.5, display: 'block' }}>
                            {t('created')} {formatDateShort(todo.createdAt)} • {t('updated')} {formatDateShort(todo.updatedAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TodoList;
