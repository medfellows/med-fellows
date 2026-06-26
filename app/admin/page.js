'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, Users, BookOpen, DollarSign, TrendingUp, FileText } from 'lucide-react'

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    
    setUser(parsedUser)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">Med Fellows Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded font-medium">Admin</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,234</div>
              <p className="text-xs text-muted-foreground">+180 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">542</div>
              <p className="text-xs text-muted-foreground">+32 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. 45,231</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Tests taken today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>Key metrics and performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Student Users</span>
                    <span className="font-semibold">4,892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Teacher Users</span>
                    <span className="font-semibold">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Test Attempts</span>
                    <span className="font-semibold">12,543</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Test Score</span>
                    <span className="font-semibold">72.3%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">New user registered</p>
                        <p className="text-gray-600 text-xs">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">New test created</p>
                        <p className="text-gray-600 text-xs">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payment received</p>
                        <p className="text-gray-600 text-xs">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>Average scores across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning'].map((subject, index) => {
                    const scores = [78, 71, 69, 75, 73]
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{subject}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-48 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${scores[index]}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">{scores[index]}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">User management features coming soon:</p>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>View all users with filters</li>
                  <li>Edit user roles and permissions</li>
                  <li>Suspend/activate accounts</li>
                  <li>View user activity logs</li>
                  <li>Export user data</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage tests, questions, and study materials</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Content management features:</p>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Review and approve teacher-submitted tests</li>
                  <li>Moderate questions and explanations</li>
                  <li>Upload study materials (PDFs, videos)</li>
                  <li>Create flashcard sets</li>
                  <li>Manage content pricing</li>
                </ul>
                <div className="mt-6">
                  <Link href="/teacher/create-test">
                    <Button>Create New Test</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Track revenue and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
                      <p className="text-2xl font-bold">Rs. 3,240</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">This Month</p>
                      <p className="text-2xl font-bold">Rs. 45,231</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold">Rs. 234,567</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Payment Gateway Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                        <span>JazzCash</span>
                        <span className="text-yellow-600 font-medium">Pending Setup</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span>Easypaisa</span>
                        <span className="text-gray-600">Not Configured</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span>Card Payments</span>
                        <span className="text-gray-600">Not Configured</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> JazzCash integration is ready. Please provide merchant credentials to activate payment processing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
