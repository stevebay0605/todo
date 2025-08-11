import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t, formatDateShort } from '../utils/translations';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'text-blue-600 bg-blue-100';
      case 'personal': return 'text-purple-600 bg-purple-100';
      case 'shopping': return 'text-pink-600 bg-pink-100';
      case 'health': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filterOptions = [
    { value: 'all', label: t('allTasks'), count: todos.length },
    { value: 'active', label: t('active'), count: todos.filter(t => !t.completed).length },
    { value: 'completed', label: t('completed'), count: todos.filter(t => t.completed).length },
  ];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('tasks')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('manageTrackTasks')}</p>
          </div>
          <Link
            to="/add"
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('addTask')}
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('searchTasks')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('filters')}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filter === option.value
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                    }`}
                  >
                    {option.label}
                    <span className="ml-2 text-xs opacity-75">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 dark:border-gray-700">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 dark:border-gray-700 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <CheckCircle2 className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No tasks found' : 'No tasks yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm
                ? t('tryAdjusting')
                : t('createFirstTask')}
            </p>
            {!searchTerm && (
              <Link
                to="/add"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t('createFirstTask')}
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-purple-500" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${
                          todo.completed
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className={`mt-1 text-sm ${
                            todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {todo.description}
                          </p>
                        )}
                        
                        {/* Tags */}
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(todo.category)}`}>
                            {t(`categories.${todo.category}`)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                            {todo.priority === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {todo.priority === 'medium' && <Clock className="w-3 h-3 mr-1" />}
                            {t(todo.priority)} {t('priority')}
                          </span>
                          {todo.dueDate && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-indigo-600 bg-indigo-100">
                              {t('due')}: {formatDateShort(todo.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Link
                          to={`/edit/${todo.id}`}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                      {t('created')} {formatDateShort(todo.createdAt)} • 
                      {t('updated')} {formatDateShort(todo.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;