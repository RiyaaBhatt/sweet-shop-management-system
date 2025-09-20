import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setTheme } from '@/store/slices/uiSlice';
import Header from './Header';
import Footer from './Footer';
import ToastContainer from '../ui/ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    // Apply theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('sweet_theme') as 'light' | 'dark';
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;