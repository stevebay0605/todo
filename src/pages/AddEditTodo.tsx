import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t } from '../utils/translations';
import { Save, ArrowLeft, Calendar, AlertCircle, Clock, User, Briefcase, ShoppingCart, Heart } from 'lucide-react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, IconButton, Alert, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const AddEditTodo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { todos, addTodo, updateTodo } = useTodos();
  const { isDark } = useTheme();

  const isEditing = Boolean(id);
  const existingTodo = isEditing ? todos.find(todo => todo.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'personal' as 'personal' | 'work' | 'shopping' | 'health',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingTodo) {
      setFormData({
        title: existingTodo.title,
        description: existingTodo.description,
        priority: existingTodo.priority,
        category: existingTodo.category,
        dueDate: existingTodo.dueDate || '',
      });
    }
  }, [existingTodo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate || undefined,
        completed: existingTodo?.completed || false,
      };

      if (isEditing && existingTodo) {
        updateTodo(existingTodo.id, todoData);
      } else {
        addTodo(todoData);
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      navigate('/todos');
    } catch (error) {
      console.error('Error saving todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const priorityOptions = [
    { value: 'low', label: t('lowPriority'), icon: null, color: '#10b981' },
    { value: 'medium', label: t('mediumPriority'), icon: Clock, color: '#f59e0b' },
    { value: 'high', label: t('highPriority'), icon: AlertCircle, color: '#ef4444' },
  ];

  const categoryOptions = [
    { value: 'personal', label: t('personal'), icon: User, color: '#a855f7' },
    { value: 'work', label: t('work'), icon: Briefcase, color: '#3b82f6' },
    { value: 'shopping', label: t('shopping'), icon: ShoppingCart, color: '#ec4899' },
    { value: 'health', label: t('health'), icon: Heart, color: '#10b981' },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 6 } }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                mr: 2,
                color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)',
                },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: isDark ? 'white' : 'rgba(17, 24, 39, 1)' }}>
                {isEditing ? t('editTask') : t('addNewTaskTitle')}
              </Typography>
              <Typography variant="body1" sx={{ color: isDark ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)', mt: 0.5 }}>
                {isEditing ? t('updateTaskDetails') : t('createNewTask')}
              </Typography>
            </Box>
          </Box>
        </motion.div>

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
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)', mb: 1 }}>
                      {t('taskTitle')} *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder={t('whatNeedsDone')}
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      error={!!errors.title}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
                        },
                      }}
                    />
                    {errors.title && (
                      <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                        {errors.title}
                      </Alert>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)', mb: 1 }}>
                      {t('description')}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder={t('additionalDetails')}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      error={!!errors.description}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      {errors.description && (
                        <Alert severity="error" sx={{ py: 0, flex: 1, mr: 2 }}>
                          {errors.description}
                        </Alert>
                      )}
                      <Typography variant="caption" sx={{ color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)', ml: 'auto' }}>
                        {formData.description.length}/500
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)', mb: 2 }}>
                      {t('priorityLevel')}
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                      {priorityOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <motion.div key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              fullWidth
                              variant={formData.priority === option.value ? 'contained' : 'outlined'}
                              onClick={() => handleInputChange('priority', option.value)}
                              sx={{
                                borderRadius: 3,
                                py: 2,
                                borderWidth: 2,
                                borderColor: formData.priority === option.value ? option.color : isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)',
                                bgcolor: formData.priority === option.value ? option.color : 'transparent',
                                color: formData.priority === option.value ? 'white' : isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)',
                                '&:hover': {
                                  borderWidth: 2,
                                  borderColor: option.color,
                                  bgcolor: formData.priority === option.value ? option.color : isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {Icon && <Icon size={18} />}
                                {!Icon && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'currentColor' }} />}
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {option.label}
                                </Typography>
                              </Box>
                            </Button>
                          </motion.div>
                        );
                      })}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)', mb: 2 }}>
                      {t('category')}
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                      {categoryOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <motion.div key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              fullWidth
                              variant={formData.category === option.value ? 'contained' : 'outlined'}
                              onClick={() => handleInputChange('category', option.value)}
                              sx={{
                                borderRadius: 3,
                                py: 2,
                                borderWidth: 2,
                                borderColor: formData.category === option.value ? option.color : isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)',
                                bgcolor: formData.category === option.value ? option.color : 'transparent',
                                color: formData.category === option.value ? 'white' : isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)',
                                '&:hover': {
                                  borderWidth: 2,
                                  borderColor: option.color,
                                  bgcolor: formData.category === option.value ? option.color : isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 1)',
                                },
                                flexDirection: 'column',
                                gap: 1,
                              }}
                            >
                              <Icon size={24} />
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {option.label}
                              </Typography>
                            </Button>
                          </motion.div>
                        );
                      })}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)', mb: 1 }}>
                      {t('dueDate')} {t('optional')}
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      error={!!errors.dueDate}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'white',
                        },
                      }}
                    />
                    {errors.dueDate && (
                      <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                        {errors.dueDate}
                      </Alert>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2, borderTop: `1px solid ${isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(229, 231, 235, 1)'}` }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: isDark ? 'rgba(107, 114, 128, 1)' : 'rgba(209, 213, 219, 1)',
                        color: isDark ? 'rgba(229, 231, 235, 1)' : 'rgba(55, 65, 81, 1)',
                      }}
                    >
                      {t('cancel')}
                    </Button>
                    <motion.div whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !formData.title.trim()}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save size={20} />}
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                          },
                          '&:disabled': {
                            opacity: 0.5,
                          },
                        }}
                      >
                        {loading ? (isEditing ? t('updating') : t('creating')) : (isEditing ? t('updateTask') : t('createTask'))}
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AddEditTodo;
