'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Clock, BookOpen, Lock } from 'lucide-react'

const SUBJECTS = ['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning']

export default function Tests() {
  const router = useRouter()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests')
      const data = await response.json()
      setTests(data.tests || [])
    } catch (error) {
      console.error('Failed to fetch tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTests = selectedSubject === 'all'
    ? tests
    : tests.filter(test => test.subject === selectedSubject)

  const handleStartTest = (testId, isFree) => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push(`/test/${testId}`)
  }

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
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Tests</h1>
          <p className="text-gray-600">Choose a test to start practicing for your exam</p>
        </div>

        {/* Subject Filter */}
        <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Subjects</TabsTrigger>
            {SUBJECTS.map(subject => (
              <TabsTrigger key={subject} value={subject}>{subject}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Tests Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tests...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tests available yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{test.title}</CardTitle>
                      <CardDescription>{test.subject}</CardDescription>
                    </div>
                    {test.isFree ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      <Badge variant="default">Rs. {test.price}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{test.questions?.length || 0} questions</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleStartTest(test.id, test.isFree)}
                    disabled={!test.isFree && !user?.paidContent?.includes(test.id)}
                  >
                    {test.isFree || user?.paidContent?.includes(test.id) ? (
                      'Start Test'
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Purchase to Unlock
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}