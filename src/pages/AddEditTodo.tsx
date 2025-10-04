import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t } from '../utils/translations';
import { Save, ArrowLeft, Calendar, AlertCircle, Clock, User, Briefcase, ShoppingCart, Heart } from 'lucide-react';
import Button from '../components/Button';

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
    <div className="space-y-6">
      {/* Header avec Hero section */}
      <div className="hero bg-base-200 rounded-box animate-fade-in">
        <div className="hero-content flex-col lg:flex-row justify-between w-full py-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              shape="circle"
              onClick={() => navigate(-1)}
              className="mr-4"
            />
            <div>
              <h1 className="text-4xl font-bold">
                {isEditing ? t('editTask') : t('addNewTaskTitle')}
              </h1>
              <p className="mt-2 text-base-content/60">
                {isEditing ? t('updateTaskDetails') : t('createNewTask')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="card bg-base-100 shadow-xl animate-slide-in">
        <form onSubmit={handleSubmit} className="card-body">
          {/* Titre */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">{t('taskTitle')} *</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('whatNeedsDone')}
              className={`input input-bordered w-full ${
                errors.title ? 'input-error' : ''
              }`}
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title}
                </span>
              </label>
            )}
          </div>

          {/* Description */}
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text font-medium">{t('description')}</span>
              <span className="label-text-alt">{formData.description.length}/500</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('additionalDetails')}
              className={`textarea textarea-bordered w-full ${
                errors.description ? 'textarea-error' : ''
              }`}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </span>
              </label>
            )}
          </div>

          {/* Priorité */}
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text font-medium">{t('priorityLevel')}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {priorityOptions.map(({ value, label, color, icon: Icon }) => (
                <div
                  key={value}
                  className={`card cursor-pointer transition-all duration-300 hover-glow ${
                    formData.priority === value
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200 hover:bg-base-300'
                  }`}
                  onClick={() => handleInputChange('priority', value)}
                >
                  <div className="card-body items-center text-center p-4">
                    {Icon && <Icon className="w-6 h-6 mb-2" />}
                    <span className="font-medium">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catégorie */}
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text font-medium">{t('category')}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categoryOptions.map(({ value, label, color, icon: Icon }) => (
                <div
                  key={value}
                  className={`card cursor-pointer transition-all duration-300 hover-glow ${
                    formData.category === value
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200 hover:bg-base-300'
                  }`}
                  onClick={() => handleInputChange('category', value)}
                >
                  <div className="card-body items-center text-center p-4">
                    {Icon && <Icon className="w-6 h-6 mb-2" />}
                    <span className="font-medium">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date d'échéance */}
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text font-medium">
                {t('dueDate')} {t('optional')}
              </span>
            </label>
            <div className="input-group">
              <span className="btn btn-square btn-ghost">
                <Calendar className="w-5 h-5" />
              </span>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`input input-bordered w-full ${
                  errors.dueDate ? 'input-error' : ''
                }`}
              />
            </div>
            {errors.dueDate && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dueDate}
                </span>
              </label>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="card-actions justify-end mt-8 gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={loading}
              disabled={loading || !formData.title.trim()}
              animation="ripple"
            >
              {loading 
                ? (isEditing ? t('updating') : t('creating'))
                : (isEditing ? t('updateTask') : t('createTask'))
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTodo;