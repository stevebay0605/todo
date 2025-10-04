import React from 'react';
import { Link } from 'react-router-dom';
import { useTodos } from '../contexts/TodoContext';
import { t, formatDateShort } from '../utils/translations';
import { CheckCircle2, Clock, AlertCircle, Plus, TrendingUp, Calendar } from 'lucide-react';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const { todos, getStats } = useTodos();
  const stats = getStats();

  const recentTodos = todos
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header avec Hero section */}
      <div className="hero bg-base-200 rounded-box">
        <div className="hero-content text-center py-8">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold">{t('welcomeBack')}</h1>
            <p className="py-4 text-base-content/80">{t('todayActivity')}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stats shadow-lg bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="stat-title">{t('totalTasks')}</div>
            <div className="stat-value text-primary">{stats.total}</div>
          </div>
        </div>

        <div className="stats shadow-lg bg-base-100">
          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="stat-title">{t('completed')}</div>
            <div className="stat-value text-success">{stats.completed}</div>
          </div>
        </div>

        <div className="stats shadow-lg bg-base-100">
          <div className="stat">
            <div className="stat-figure text-warning">
              <Clock className="w-8 h-8" />
            </div>
            <div className="stat-title">{t('active')}</div>
            <div className="stat-value text-warning">{stats.active}</div>
          </div>
        </div>

        <div className="stats shadow-lg bg-base-100">
          <div className="stat">
            <div className="stat-figure text-error">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">{t('highPriority')}</div>
            <div className="stat-value text-error">{stats.inProgress}</div>
          </div>
        </div>
      </div>

      {/* Progress and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="card bg-base-100 shadow-lg lg:col-span-2">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">{t('progressOverview')}</h3>
              <div className="badge badge-success gap-2">
                <TrendingUp className="w-4 h-4" />
                {completionRate}% {t('complete')}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-base-content/60">{t('progressOverview')}</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <progress 
                  className="progress progress-primary w-full" 
                  value={completionRate} 
                  max="100"
                ></progress>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="stats bg-success/10">
                  <div className="stat">
                    <div className="stat-title text-success">{t('completedToday')}</div>
                    <div className="stat-value text-success text-2xl">{stats.completed}</div>
                  </div>
                </div>
                <div className="stats bg-warning/10">
                  <div className="stat">
                    <div className="stat-title text-warning">{t('remaining')}</div>
                    <div className="stat-value text-warning text-2xl">{stats.active}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">{t('quickActions')}</h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                icon={Plus}
                fullWidth
                onClick={() => window.location.assign('/add')}
                className="btn-outline"
              >
                {t('addNewTask')}
              </Button>
              <Button
                variant="primary"
                icon={CheckCircle2}
                fullWidth
                onClick={() => window.location.assign('/todos')}
                animation="gradient"
              >
                {t('viewAllTasks')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h3 className="card-title">{t('recentTasks')}</h3>
            <Link to="/todos" className="link link-primary">{t('viewAll')}</Link>
          </div>

          {recentTodos.length === 0 ? (
            <div className="text-center py-8">
              <div className="avatar placeholder mb-4">
                <div className="bg-primary/10 text-primary rounded-full w-16">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>
              <p className="text-base-content/60 mb-4">{t('noTasksYet')}</p>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => window.location.assign('/add')}
                animation="gradient"
              >
                {t('createFirstTask')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTodos.map((todo) => (
                <Link
                  to={`/edit/${todo.id}`}
                  key={todo.id}
                  className="block group"
                >
                  <div className="indicator w-full">
                    {todo.priority === 'high' && (
                      <span className="indicator-item badge badge-error animate-pulse"></span>
                    )}
                    <div className="card bg-base-200 hover:bg-base-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-4">
                          <div className={`avatar placeholder ${todo.completed ? 'online' : todo.priority === 'high' ? 'offline pulse' : 'offline'}`}>
                            <div className={`bg-${todo.completed ? 'success' : todo.priority === 'high' ? 'error' : 'primary'}-content/10 text-${todo.completed ? 'success' : todo.priority === 'high' ? 'error' : 'primary'} rounded-full w-10 h-10 flex items-center justify-center`}>
                              {todo.completed ? '✓' : todo.priority === 'high' ? '!' : '○'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-lg mb-1 group-hover:text-primary transition-colors ${todo.completed ? 'line-through opacity-50' : ''}`}>
                              {todo.title}
                            </h4>
                            {todo.description && (
                              <p className="text-base-content/60 text-sm line-clamp-2 mb-2">
                                {todo.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <div className={`badge ${getCategoryBadgeClass(todo.category)} badge-sm`}>
                                {t(`categories.${todo.category}`)}
                              </div>
                              <div className={`badge ${getPriorityBadgeClass(todo.priority)} badge-sm gap-1`}>
                                {todo.priority === 'high' && <AlertCircle className="w-3 h-3" />}
                                {todo.priority === 'medium' && <Clock className="w-3 h-3" />}
                                {t(todo.priority)}
                              </div>
                              {todo.dueDate && (
                                <div className="badge badge-ghost badge-sm gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDateShort(todo.dueDate)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;