'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Trophy, Users, GraduationCap, CheckCircle, Star } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">Med Fellows</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#features">
              <Button variant="ghost">Features</Button>
            </Link>
            <Link href="#about">
              <Button variant="ghost">About</Button>
            </Link>
            {isLoggedIn ? (
              <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push('/login')}>Login</Button>
                <Button onClick={() => router.push('/register')}>Register</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Ace Your <span className="text-blue-600">MDCAT</span> with Confidence
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive test preparation platform for MDCAT, NUMS, NTS, Nursing, and FMGE exams.
            Practice with thousands of MCQs, take mock tests, and track your progress.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/register')} className="bg-blue-600 hover:bg-blue-700">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/tests')}>
              Browse Tests
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Practice Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Mock Tests</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Med Fellows?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-600 transition-colors">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Comprehensive Content</CardTitle>
                <CardDescription>
                  Cover all subjects: Biology, Chemistry, Physics, English, and Logical Reasoning with expert-created content
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-blue-600 transition-colors">
              <CardHeader>
                <Trophy className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Real Exam Experience</CardTitle>
                <CardDescription>
                  Practice with timed mock tests that simulate actual MDCAT exam conditions and difficulty levels
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-blue-600 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Compete & Learn</CardTitle>
                <CardDescription>
                  View leaderboards, compare your performance, and learn from detailed answer explanations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Subjects Covered</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning'].map((subject) => (
              <Card key={subject} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{subject}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Student Benefits</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              'Access to thousands of practice MCQs',
              'Full-length MDCAT mock tests',
              'Detailed performance analytics',
              'Subject-wise progress tracking',
              'Downloadable study materials & notes',
              'Video lectures from expert teachers',
              'Certificates upon test completion',
              'Competitive leaderboards & rankings'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of students preparing for MDCAT and other medical entrance exams</p>
          <Button size="lg" variant="secondary" onClick={() => router.push('/register')}>
            Sign Up Now - It's Free!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Med Fellows
              </h3>
              <p className="text-gray-400">Your trusted partner for medical entrance exam preparation</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tests">Browse Tests</Link></li>
                <li><Link href="/register">Register</Link></li>
                <li><Link href="/login">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Exams</h4>
              <ul className="space-y-2 text-gray-400">
                <li>MDCAT</li>
                <li>NUMS</li>
                <li>NTS</li>
                <li>Nursing</li>
                <li>FMGE</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Email: info@medfellows.com</p>
              <p className="text-gray-400">Phone: +92 XXX XXXXXXX</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Med Fellows. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}