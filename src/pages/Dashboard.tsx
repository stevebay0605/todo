import React from 'react';
import { Link } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t, formatDateShort } from '../utils/translations';
import { CheckCircle2, Clock, AlertCircle, Plus, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { todos, getStats } = useTodos();
  const stats = getStats();

  const recentTodos = todos
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const categoryStats = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('welcomeBack')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{t('todayActivity')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalTasks')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('completed')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('active')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('highPriority')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('progressOverview')}</h3>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {completionRate}% {t('complete')}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{t('progressOverview')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('completedToday')}</p>
                  <p className="text-xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('remaining')}</p>
                  <p className="text-xl font-bold text-orange-600">{stats.active}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('quickActions')}</h3>
            <div className="space-y-3">
              <Link
                to="/add"
                className="flex items-center p-3 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-200 group"
              >
                <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{t('addNewTask')}</span>
              </Link>
              <Link
                to="/todos"
                className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <CheckCircle2 className="h-5 w-5 mr-3" />
                <span className="font-medium">{t('viewAllTasks')}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recentTasks')}</h3>
            <Link
              to="/todos"
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              {t('viewAll')}
            </Link>
          </div>
          {recentTodos.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <CheckCircle2 className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('noTasksYet')}</p>
              <Link
                to="/add"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('createFirstTask')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 hover:shadow-md"
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      todo.completed ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                  ></div>
                  <div className="flex-grow">
                    <p className={`font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {todo.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {t(`categories.${todo.category}`)} • {t(todo.priority)} {t('priority')}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    {formatDateShort(todo.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;