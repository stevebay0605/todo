import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, CheckSquare, Plus, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { t } from '../utils/translations';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton, useMediaQuery, useTheme as useMuiTheme, Container } from '@mui/material';
import { motion } from 'framer-motion';

const DRAWER_WIDTH = 260;

const Layout: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('lg'));

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: t('dashboard') },
    { path: '/todos', icon: CheckSquare, label: t('tasks') },
    { path: '/add', icon: Plus, label: t('addTask') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)' }}>
      <Box sx={{ p: 3, borderBottom: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 232, 255, 0.5)'}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <CheckSquare style={{ width: 24, height: 24, color: 'white' }} />
            </Box>
            <Box
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TaskFlow
            </Box>
          </motion.div>
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: isDark ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)',
              '&:hover': {
                color: isDark ? 'rgba(196, 181, 253, 1)' : 'rgba(124, 58, 237, 1)',
                bgcolor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 232, 255, 0.5)',
              },
            }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Box>
      </Box>

      <List sx={{ flex: 1, p: 2 }}>
        {navItems.map(({ path, icon: Icon, label }, index) => (
          <motion.div
            key={path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem
              component={Link}
              to={path}
              sx={{
                mb: 1,
                borderRadius: 2,
                background: isActive(path)
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: isActive(path)
                  ? 'white'
                  : isDark
                  ? 'rgba(229, 231, 235, 1)'
                  : 'rgba(55, 65, 81, 1)',
                '&:hover': {
                  bgcolor: isActive(path) ? undefined : isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 232, 255, 0.5)',
                  color: isActive(path) ? 'white' : isDark ? 'rgba(196, 181, 253, 1)' : 'rgba(109, 40, 217, 1)',
                },
                boxShadow: isActive(path) ? '0 4px 14px 0 rgba(102, 126, 234, 0.4)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.div>
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontWeight: isActive(path) ? 600 : 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 50%, #c5cae9 100%)',
        transition: 'background 0.3s ease',
      }}
    >
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              background: 'transparent',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            top: 'auto',
            bottom: 0,
            bgcolor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            borderTop: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 232, 255, 0.5)'}`,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-around', py: 1 }}>
            {navItems.map(({ path, icon: Icon, label }) => (
              <motion.div key={path} whileTap={{ scale: 0.9 }}>
                <IconButton
                  component={Link}
                  to={path}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    color: isActive(path)
                      ? isDark
                        ? 'rgba(196, 181, 253, 1)'
                        : 'rgba(124, 58, 237, 1)'
                      : isDark
                      ? 'rgba(156, 163, 175, 1)'
                      : 'rgba(107, 114, 128, 1)',
                    '&:hover': {
                      color: isDark ? 'rgba(196, 181, 253, 1)' : 'rgba(124, 58, 237, 1)',
                    },
                  }}
                >
                  <Icon size={20} />
                  <Box sx={{ fontSize: '0.65rem', mt: 0.5 }}>{label}</Box>
                </IconButton>
              </motion.div>
            ))}
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
          mb: isMobile ? 8 : 0,
          minHeight: '100vh',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout;
