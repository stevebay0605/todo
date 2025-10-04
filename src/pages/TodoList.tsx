import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t, formatDateShort } from '../utils/translations';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';

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

  const [showFilters, setShowFilters] = useState(false);
  const filteredTodos = getFilteredTodos();

  const filterOptions = [
    { value: 'all', label: t('allTasks'), count: todos.length },
    { value: 'active', label: t('active'), count: todos.filter(t => !t.completed).length },
    { value: 'completed', label: t('completed'), count: todos.filter(t => t.completed).length },
  ];

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteTodo(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="hero bg-base-200 rounded-box">
        <div className="hero-content flex-col lg:flex-row justify-between w-full">
          <div>
            <h1 className="text-4xl font-bold">{t('tasks')}</h1>
            <p className="py-2 text-base-content/80">{t('manageTrackTasks')}</p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            animation="gradient"
            onClick={() => window.location.assign('/add')}
          >
            {t('addTask')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="join w-full">
        <div className="join-item flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/60">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder={t('searchTasks')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-12"
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'ghost'}
          icon={Filter}
          className="join-item"
          onClick={() => setShowFilters(!showFilters)}
        >
          {t('filters')}
        </Button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="card bg-base-200 shadow-sm animate-fade-in">
          <div className="card-body">
            <div className="join">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`join-item btn ${filter === option.value ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {option.label}
                  <div className="badge ml-2">{option.count}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {filteredTodos.length === 0 ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center py-16">
            <div className="avatar placeholder mb-4">
              <div className="bg-primary/10 text-primary rounded-full w-16">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2">
              {searchTerm ? t('noTasksFound') : t('noTasksYet')}
            </h3>
            <p className="text-base-content/60 mb-6">
              {searchTerm ? t('tryAdjusting') : t('createFirstTask')}
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                icon={Plus}
                animation="gradient"
                onClick={() => window.location.assign('/add')}
              >
                {t('createFirstTask')}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="card-body p-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="btn btn-circle btn-ghost btn-sm"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-base-content/60" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold ${
                      todo.completed ? 'line-through text-base-content/50' : ''
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`mt-1 text-sm ${
                        todo.completed ? 'text-base-content/40' : 'text-base-content/60'
                      }`}>
                        {todo.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className={`badge ${getCategoryBadgeClass(todo.category)}`}>
                        {t(`categories.${todo.category}`)}
                      </div>
                      <div className={`badge ${getPriorityBadgeClass(todo.priority)}`}>
                        {todo.priority === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {todo.priority === 'medium' && <Clock className="w-3 h-3 mr-1" />}
                        {t(todo.priority)} {t('priority')}
                      </div>
                      {todo.dueDate && (
                        <div className="badge badge-ghost">
                          {t('due')}: {formatDateShort(todo.dueDate)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/edit/${todo.id}`}
                      className="btn btn-circle btn-ghost btn-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="btn btn-circle btn-ghost btn-sm text-error hover:bg-error/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-base-300">
                  <div className="text-xs text-base-content/40 flex gap-2">
                    <span>{t('created')} {formatDateShort(todo.createdAt)}</span>
                    <span>•</span>
                    <span>{t('updated')} {formatDateShort(todo.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'work': return 'badge-info';
    case 'personal': return 'badge-primary';
    case 'shopping': return 'badge-secondary';
    case 'health': return 'badge-success';
    default: return 'badge-ghost';
  }
};

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'high': return 'badge-error';
    case 'medium': return 'badge-warning';
    case 'low': return 'badge-success';
    default: return 'badge-ghost';
  }
};

export default TodoList;