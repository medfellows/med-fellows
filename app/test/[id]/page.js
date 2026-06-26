'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TakeTest() {
  const router = useRouter()
  const params = useParams()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [mode, setMode] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [results, setResults] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchTest()
  }, [params.id])

  useEffect(() => {
    let timer
    if (testStarted && !testCompleted && mode === 'timed' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [testStarted, testCompleted, mode, timeLeft])

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/${params.id}`)
      const data = await response.json()
      
      if (data.test) {
        setTest(data.test)
        setAnswers(new Array(data.test.questions.length).fill(null))
        setTimeLeft(data.test.duration * 60)
      }
    } catch (error) {
      console.error('Failed to fetch test:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTest = (selectedMode) => {
    setMode(selectedMode)
    setTestStarted(true)
  }

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const timeTaken = mode === 'timed' ? (test.duration * 60 - timeLeft) : 0

    try {
      const response = await fetch(`/api/tests/${params.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers,
          mode,
          timeTaken
        })
      })

      const data = await response.json()
      
      if (data.attempt) {
        setResults(data.attempt)
        setTestCompleted(true)
      }
    } catch (error) {
      console.error('Failed to submit test:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-gray-600 mb-4">Test not found</p>
            <Link href="/tests">
              <Button>Back to Tests</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mode Selection Screen
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{test.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600"><strong>Subject:</strong> {test.subject}</p>
              <p className="text-gray-600"><strong>Questions:</strong> {test.questions.length}</p>
              <p className="text-gray-600"><strong>Duration:</strong> {test.duration} minutes</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Select Test Mode:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:border-blue-600 transition-colors" onClick={() => startTest('timed')}>
                  <CardContent className="pt-6">
                    <Clock className="h-8 w-8 text-blue-600 mb-2" />
                    <h4 className="font-semibold mb-2">Timed Mode</h4>
                    <p className="text-sm text-gray-600">Test with time limit. Your score will be added to leaderboard.</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-blue-600 transition-colors" onClick={() => startTest('practice')}>
                  <CardContent className="pt-6">
                    <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                    <h4 className="font-semibold mb-2">Practice Mode</h4>
                    <p className="text-sm text-gray-600">No time limit. Perfect for learning and practice.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/tests" className="flex-1">
                <Button variant="outline" className="w-full">Cancel</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results Screen
  if (testCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">Med Fellows</span>
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-blue-600 mb-2">{Math.round(results.score)}%</div>
                <p className="text-gray-600">{results.correctAnswers} out of {results.totalQuestions} correct</p>
                {mode === 'timed' && (
                  <p className="text-sm text-gray-500 mt-2">Time taken: {formatTime(results.timeTaken)}</p>
                )}
              </div>

              {results.score >= 70 && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Congratulations! You passed this test. A certificate is available in your dashboard.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Answer Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {results.results.map((result, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-3 mb-2">
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">Q{index + 1}. {result.question}</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <strong>Your answer:</strong> <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>{result.userAnswer || 'Not answered'}</span>
                        </p>
                        {!result.isCorrect && (
                          <p className="text-green-600">
                            <strong>Correct answer:</strong> {result.correctAnswer}
                          </p>
                        )}
                        {result.explanation && (
                          <p className="text-gray-700 mt-2">
                            <strong>Explanation:</strong> {result.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-6">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
            <Link href="/tests" className="flex-1">
              <Button variant="outline" className="w-full">Take Another Test</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Test Taking Screen
  const question = test.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / test.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="font-semibold">{test.title}</h2>
                <p className="text-sm text-gray-600">{test.subject}</p>
              </div>
            </div>
            {mode === 'timed' && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className={`font-mono text-lg font-semibold ${timeLeft < 60 ? 'text-red-600' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {test.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Q{currentQuestion + 1}. {question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[currentQuestion] || ''} onValueChange={handleAnswerChange}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            {answers.filter(a => a !== null).length} / {test.questions.length} answered
          </div>

          {currentQuestion === test.questions.length - 1 ? (
            <Button onClick={handleSubmit}>
              Submit Test
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Navigation Grid */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {test.questions.map((_, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={currentQuestion === index ? 'default' : answers[index] ? 'secondary' : 'outline'}
                  onClick={() => setCurrentQuestion(index)}
                  className="w-full"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}