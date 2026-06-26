'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GraduationCap, Plus, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'

const SUBJECTS = ['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning']
const EXAM_TYPES = ['MDCAT', 'NUMS', 'NTS', 'Nursing', 'FMGE']

export default function CreateTest() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState({
    title: '',
    subject: '',
    type: 'MDCAT',
    duration: 60,
    price: 0,
    isFree: true,
    questions: [
      {
        id: '1',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: ''
      }
    ]
  })

  useState(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'teacher' && parsedUser.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    setUser(parsedUser)
  }, [])

  const addQuestion = () => {
    setTestData({
      ...testData,
      questions: [
        ...testData.questions,
        {
          id: String(testData.questions.length + 1),
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: ''
        }
      ]
    })
  }

  const removeQuestion = (index) => {
    const newQuestions = testData.questions.filter((_, i) => i !== index)
    setTestData({ ...testData, questions: newQuestions })
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...testData.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setTestData({ ...testData, questions: newQuestions })
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...testData.questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setTestData({ ...testData, questions: newQuestions })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate
    if (!testData.title || !testData.subject) {
      alert('Please fill in all required fields')
      setLoading(false)
      return
    }

    for (const q of testData.questions) {
      if (!q.question || q.options.some(opt => !opt) || !q.correctAnswer) {
        alert('Please complete all questions, options, and select correct answers')
        setLoading(false)
        return
      }
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test')
      }

      alert('Test created successfully!')
      router.push('/dashboard')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
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
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Create New Test</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Details */}
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>Enter the basic information about the test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., MDCAT Biology Mock Test 1"
                  value={testData.title}
                  onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={testData.subject} onValueChange={(value) => setTestData({ ...testData, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Exam Type</Label>
                  <Select value={testData.type} onValueChange={(value) => setTestData({ ...testData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAM_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={testData.duration}
                    onChange={(e) => setTestData({ ...testData, duration: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rs.)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={testData.price}
                    onChange={(e) => {
                      const price = parseInt(e.target.value)
                      setTestData({ ...testData, price, isFree: price === 0 })
                    }}
                    min="0"
                  />
                  <p className="text-xs text-gray-500">Set to 0 for free test</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Add questions with multiple choice options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {testData.questions.map((question, qIndex) => (
                <div key={qIndex} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Question {qIndex + 1}</h3>
                    {testData.questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text *</Label>
                    <Textarea
                      placeholder="Enter the question"
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options *</Label>
                    {question.options.map((option, oIndex) => (
                      <Input
                        key={oIndex}
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        required
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Correct Answer *</Label>
                    <Select
                      value={question.correctAnswer}
                      onValueChange={(value) => updateQuestion(qIndex, 'correctAnswer', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options.filter(opt => opt).map((option, index) => (
                          <SelectItem key={index} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Explanation (Optional)</Label>
                    <Textarea
                      placeholder="Explain why this is the correct answer"
                      value={question.explanation}
                      onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Test'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}