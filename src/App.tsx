import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { QuotationForm } from "@/components/quotation/QuotationForm";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { toast } from "@/hooks/use-toast";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type User = {
  email: string;
  role: 'admin' | 'staff';
  name?: string;
};

type AppPage = 'dashboard' | 'new-quote' | 'my-quotes' | 'admin' | 'settings';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Mock authentication - replace with real Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      const mockUser: User = {
        email,
        role: email.includes('admin') ? 'admin' : 'staff',
        name: email.includes('admin') ? 'Admin User' : 'Staff Member'
      };
      
      setUser(mockUser);
      toast({
        title: "Welcome back!",
        description: `Signed in as ${mockUser.role}`,
      });
    } catch (error) {
      setLoginError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleNavigate = (page: AppPage) => {
    if (page === 'admin' && user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this section.",
        variant: "destructive",
      });
      return;
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard userRole={user?.role || 'staff'} onNavigate={handleNavigate} />;
      case 'new-quote':
        return <QuotationForm onBack={() => setCurrentPage('dashboard')} />;
      case 'admin':
        return <AdminPanel onBack={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard userRole={user?.role || 'staff'} onNavigate={handleNavigate} />;
    }
  };

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginForm 
            onLogin={handleLogin}
            isLoading={isLoading}
            error={loginError}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={renderPage()} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
