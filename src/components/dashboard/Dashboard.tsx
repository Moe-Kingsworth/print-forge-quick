import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  FileText, 
  Settings, 
  Users, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';

interface DashboardProps {
  userRole: 'admin' | 'staff';
  onNavigate: (page: 'new-quote' | 'my-quotes' | 'admin' | 'settings') => void;
}

export function Dashboard({ userRole, onNavigate }: DashboardProps) {
  // Mock data - replace with real data from Supabase
  const stats = {
    todayQuotes: 12,
    weekQuotes: 48,
    monthQuotes: 187,
    avgValue: 125000,
    activeStaff: 5
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Generate quotes quickly and efficiently.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Quotes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayQuotes}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weekQuotes}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.avgValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStaff}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access the most common tasks and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              size="lg" 
              className="h-24 flex flex-col gap-2"
              onClick={() => onNavigate('new-quote')}
            >
              <Calculator className="w-6 h-6" />
              New Quote
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="h-24 flex flex-col gap-2"
              onClick={() => onNavigate('my-quotes')}
            >
              <FileText className="w-6 h-6" />
              My Quotes
            </Button>

            {userRole === 'admin' && (
              <Button 
                variant="outline" 
                size="lg" 
                className="h-24 flex flex-col gap-2"
                onClick={() => onNavigate('admin')}
              >
                <Users className="w-6 h-6" />
                Admin Panel
              </Button>
            )}

            <Button 
              variant="outline" 
              size="lg" 
              className="h-24 flex flex-col gap-2"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-6 h-6" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
          <CardDescription>
            Your latest quotation activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock recent quotes - replace with real data */}
            <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="font-medium">A4 Book - 200 pages</p>
                <p className="text-sm text-muted-foreground">Today, 2:30 PM</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦89,500</p>
                <p className="text-sm text-muted-foreground">500 copies</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="font-medium">A5 Book - 150 pages</p>
                <p className="text-sm text-muted-foreground">Today, 11:15 AM</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦67,200</p>
                <p className="text-sm text-muted-foreground">300 copies</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">6x9 Book - 250 pages</p>
                <p className="text-sm text-muted-foreground">Yesterday, 4:45 PM</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦156,800</p>
                <p className="text-sm text-muted-foreground">200 copies</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}