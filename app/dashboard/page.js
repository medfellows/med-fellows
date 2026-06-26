'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Trophy, TrendingUp, GraduationCap, LogOut, User, FileText, Award } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchDashboardData(token)
  }, [])

  const fetchDashboardData = async (token) => {
    try {
      const [statsRes, attemptsRes] = await Promise.all([
        fetch('/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/attempts', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const statsData = await statsRes.json()
      const attemptsData = await attemptsRes.json()

      setStats(statsData.stats)
      setAttempts(attemptsData.attempts || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <span className="text-2xl font-bold text-blue-600">Med Fellows</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tests">
              <Button variant="ghost">Browse Tests</Button>
            </Link>
            {user.role === 'teacher' && (
              <Link href="/teacher/create-test">
                <Button variant="ghost">Create Test</Button>
              </Link>
            )}
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium">{user.name}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{user.role}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Cards */}
        {user.role === 'student' && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalTests || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.averageScore || 0}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rank</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#-</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attempts.filter(a => a.score >= 70).length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
            {user.role === 'student' && <TabsTrigger value="performance">Performance</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back, {user.name}!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {user.role === 'student' && 'Continue your MDCAT preparation journey. Take tests, track your progress, and improve your scores.'}
                  {user.role === 'teacher' && 'Manage your tests, create new questions, and help students succeed.'}
                  {user.role === 'admin' && 'Manage the platform, view analytics, and oversee all operations.'}
                </p>
                <Link href="/tests">
                  <Button>Browse Available Tests</Button>
                </Link>
              </CardContent>
            </Card>

            {user.role === 'student' && stats?.subjectPerformance && (
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.subjectPerformance.map((subject) => (
                    <div key={subject.subject}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-sm text-gray-600">{Math.round(subject.average)}% ({subject.count} tests)</span>
                      </div>
                      <Progress value={subject.average} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                {attempts.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No test attempts yet. Start taking tests to see your history!</p>
                ) : (
                  <div className="space-y-3">
                    {attempts.slice(0, 10).map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-semibold">{attempt.testTitle}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(attempt.completedAt).toLocaleDateString()} • {attempt.mode} mode
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{Math.round(attempt.score)}%</div>
                          <p className="text-sm text-gray-600">{attempt.correctAnswers}/{attempt.totalQuestions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {user.role === 'student' && (
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Overall Progress</h3>
                      <Progress value={stats?.averageScore || 0} className="h-3" />
                      <p className="text-sm text-gray-600 mt-2">{stats?.averageScore || 0}% average score across all tests</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Tests Completed</h3>
                      <p className="text-3xl font-bold text-blue-600">{stats?.totalTests || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}