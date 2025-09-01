import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Download, 
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';

interface AdminPanelProps {
  onBack?: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with Supabase data
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@glitquote.com', role: 'staff', status: 'active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@glitquote.com', role: 'admin', status: 'active', lastLogin: '1 day ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@glitquote.com', role: 'staff', status: 'inactive', lastLogin: '1 week ago' },
  ];

  const mockQuotes = [
    { id: 1, staff: 'John Doe', client: 'ABC Publishing', amount: 89500, date: '2024-01-15', status: 'completed' },
    { id: 2, staff: 'Jane Smith', client: 'XYZ Books', amount: 156800, date: '2024-01-15', status: 'pending' },
    { id: 3, staff: 'John Doe', client: 'DEF Publishers', amount: 67200, date: '2024-01-14', status: 'completed' },
  ];

  const mockLookupTables = {
    paperCosts: [
      { size: 'A4', type: 'Cream 100gsm', cost: 12 },
      { size: 'A5', type: 'Cream 100gsm', cost: 8 },
      { size: 'A6', type: 'Cream 100gsm', cost: 5 },
    ],
    profitBrackets: [
      { min: 0, max: 100, percentage: 30 },
      { min: 101, max: 500, percentage: 25 },
      { min: 501, max: 1000, percentage: 20 },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, quotes, and system settings
          </p>
        </div>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="quotes">All Quotes</TabsTrigger>
          <TabsTrigger value="lookup">Lookup Tables</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">487</div>
                <p className="text-xs text-muted-foreground">+23 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦2.4M</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Quote Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦125K</div>
                <p className="text-xs text-muted-foreground">+5% this month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Quotations</h2>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>#{quote.id}</TableCell>
                      <TableCell className="font-medium">{quote.staff}</TableCell>
                      <TableCell>{quote.client}</TableCell>
                      <TableCell className="font-medium">₦{quote.amount.toLocaleString()}</TableCell>
                      <TableCell>{quote.date}</TableCell>
                      <TableCell>
                        <Badge variant={quote.status === 'completed' ? 'success' : 'warning'}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lookup" className="space-y-6">
          <h2 className="text-xl font-semibold">Lookup Tables Management</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paper Costs</CardTitle>
                <CardDescription>Manage paper cost per page by size and type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLookupTables.paperCosts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <span className="font-medium">{item.size} - {item.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>₦{item.cost}</span>
                        <Button size="sm" variant="outline">
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Paper Cost
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Brackets</CardTitle>
                <CardDescription>Manage profit percentages by copy quantity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLookupTables.profitBrackets.map((bracket, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <span className="font-medium">{bracket.min}-{bracket.max} copies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{bracket.percentage}%</span>
                        <Button size="sm" variant="outline">
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bracket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}