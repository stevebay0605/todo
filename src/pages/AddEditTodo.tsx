import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t } from '../utils/translations';
import { Save, ArrowLeft, Calendar, AlertCircle, Clock, User, Briefcase, ShoppingCart, Heart } from 'lucide-react';

const AddEditTodo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { todos, addTodo, updateTodo } = useTodos();

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

      // Simulate API delay for loading state
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const priorityOptions = [
    { value: 'low', label: t('lowPriority'), color: 'text-green-600 bg-green-100', icon: null },
    { value: 'medium', label: t('mediumPriority'), color: 'text-orange-600 bg-orange-100', icon: Clock },
    { value: 'high', label: t('highPriority'), color: 'text-red-600 bg-red-100', icon: AlertCircle },
  ];

  const categoryOptions = [
    { value: 'personal', label: t('personal'), color: 'text-purple-600 bg-purple-100', icon: User },
    { value: 'work', label: t('work'), color: 'text-blue-600 bg-blue-100', icon: Briefcase },
    { value: 'shopping', label: t('shopping'), color: 'text-pink-600 bg-pink-100', icon: ShoppingCart },
    { value: 'health', label: t('health'), color: 'text-green-600 bg-green-100', icon: Heart },
  ];

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {isEditing ? t('editTask') : t('addNewTaskTitle')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {isEditing ? t('updateTaskDetails') : t('createNewTask')}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('taskTitle')} *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={t('whatNeedsDone')}
                className={`block w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 ${
                  errors.title
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('description')}
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('additionalDetails')}
                className={`block w-full px-4 py-3 rounded-xl border-2 resize-none transition-colors duration-200 ${
                  errors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('priorityLevel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {priorityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('priority', option.value)}
                      className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.priority === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${option.color}`}>
                        {Icon ? <Icon className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                      {formData.priority === option.value && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('category')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categoryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('category', option.value)}
                      className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.category === option.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${option.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                      {formData.category === option.value && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dueDate')} {t('optional')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`block w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors duration-200 ${
                    errors.dueDate
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1`}
                />
              </div>
              {errors.dueDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                disabled={loading}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {isEditing ? t('updating') : t('creating')}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {isEditing ? t('updateTask') : t('createTask')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditTodo;