import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './contexts/TodoContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TodoList from './pages/TodoList';
import AddEditTodo from './pages/AddEditTodo';
import Settings from './pages/Settings';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TodoProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="todos" element={<TodoList />} />
                <Route path="add" element={<AddEditTodo />} />
                <Route path="edit/:id" element={<AddEditTodo />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </TodoProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;