import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { ROLES } from '@/lib/constants';

// Helper function to get user from token
async function getUserFromToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const usersCollection = await getCollection('users');
  const user = await usersCollection.findOne({ token });
  return user;
}

// POST /api/auth/register
async function handleRegister(request) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (![ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);
    const token = generateToken();

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || '',
      avatar: '',
      paidContent: [],
      createdAt: new Date().toISOString()
    };

    await usersCollection.insertOne(newUser);

    const userResponse = { ...newUser };
    delete userResponse.password;
    userResponse.token = token;

    await usersCollection.updateOne(
      { id: newUser.id },
      { $set: { token } }
    );

    return NextResponse.json({ user: userResponse, token }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

// POST /api/auth/login
async function handleLogin(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ email });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken();
    await usersCollection.updateOne(
      { id: user.id },
      { $set: { token } }
    );

    const userResponse = { ...user };
    delete userResponse.password;
    userResponse.token = token;

    return NextResponse.json({ user: userResponse, token }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

// GET /api/auth/me
async function handleMe(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userResponse = { ...user };
    delete userResponse.password;

    return NextResponse.json({ user: userResponse }, { status: 200 });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}

// GET /api/tests
async function handleGetTests(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const isFree = searchParams.get('isFree');

    const testsCollection = await getCollection('tests');
    const query = {};
    
    if (subject) query.subject = subject;
    if (isFree !== null) query.isFree = isFree === 'true';

    const tests = await testsCollection.find(query).toArray();
    return NextResponse.json({ tests }, { status: 200 });
  } catch (error) {
    console.error('Get tests error:', error);
    return NextResponse.json({ error: 'Failed to get tests' }, { status: 500 });
  }
}

// POST /api/tests
async function handleCreateTest(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user || (user.role !== ROLES.TEACHER && user.role !== ROLES.ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title, subject, type, duration, price, isFree, questions } = body;

    if (!title || !subject || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const testsCollection = await getCollection('tests');
    const newTest = {
      id: uuidv4(),
      title,
      subject,
      type: type || 'MDCAT',
      duration: duration || 60,
      price: price || 0,
      isFree: isFree !== false,
      questions,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    await testsCollection.insertOne(newTest);
    return NextResponse.json({ test: newTest }, { status: 201 });
  } catch (error) {
    console.error('Create test error:', error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}

// GET /api/tests/:id
async function handleGetTestById(request, testId) {
  try {
    const testsCollection = await getCollection('tests');
    const test = await testsCollection.findOne({ id: testId });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json({ test }, { status: 200 });
  } catch (error) {
    console.error('Get test error:', error);
    return NextResponse.json({ error: 'Failed to get test' }, { status: 500 });
  }
}

// POST /api/tests/:id/submit
async function handleSubmitTest(request, testId) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { answers, mode, timeTaken } = body;

    const testsCollection = await getCollection('tests');
    const test = await testsCollection.findOne({ id: testId });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = test.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = (correctAnswers / test.questions.length) * 100;

    const attemptsCollection = await getCollection('test_attempts');
    const attempt = {
      id: uuidv4(),
      userId: user.id,
      testId: test.id,
      testTitle: test.title,
      answers,
      results,
      score,
      correctAnswers,
      totalQuestions: test.questions.length,
      mode: mode || 'practice',
      timeTaken: timeTaken || 0,
      completedAt: new Date().toISOString()
    };

    await attemptsCollection.insertOne(attempt);

    // Update leaderboard if timed mode
    if (mode === 'timed') {
      const leaderboardCollection = await getCollection('leaderboard');
      await leaderboardCollection.insertOne({
        id: uuidv4(),
        userId: user.id,
        userName: user.name,
        testId: test.id,
        testTitle: test.title,
        score,
        timeTaken,
        completedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ attempt }, { status: 201 });
  } catch (error) {
    console.error('Submit test error:', error);
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
  }
}

// GET /api/attempts
async function handleGetAttempts(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attemptsCollection = await getCollection('test_attempts');
    const attempts = await attemptsCollection
      .find({ userId: user.id })
      .sort({ completedAt: -1 })
      .toArray();

    return NextResponse.json({ attempts }, { status: 200 });
  } catch (error) {
    console.error('Get attempts error:', error);
    return NextResponse.json({ error: 'Failed to get attempts' }, { status: 500 });
  }
}

// GET /api/leaderboard
async function handleGetLeaderboard(request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    const leaderboardCollection = await getCollection('leaderboard');
    const query = testId ? { testId } : {};

    const leaderboard = await leaderboardCollection
      .find(query)
      .sort({ score: -1, timeTaken: 1 })
      .limit(100)
      .toArray();

    // Add ranks
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    return NextResponse.json({ leaderboard: rankedLeaderboard }, { status: 200 });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 });
  }
}

// GET /api/dashboard/stats
async function handleGetDashboardStats(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attemptsCollection = await getCollection('test_attempts');
    const attempts = await attemptsCollection.find({ userId: user.id }).toArray();

    const totalTests = attempts.length;
    const averageScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
      : 0;

    // Subject-wise performance - Optimized to avoid N+1 queries
    const testsCollection = await getCollection('tests');
    const subjectStats = {};

    // Extract unique test IDs from attempts
    const testIds = [...new Set(attempts.map(a => a.testId))];
    
    // Fetch all tests in one query
    const tests = await testsCollection.find({ id: { $in: testIds } }).toArray();
    const testsMap = Object.fromEntries(tests.map(t => [t.id, t]));
    
    // Build subject stats using the map
    for (const attempt of attempts) {
      const test = testsMap[attempt.testId];
      if (test) {
        if (!subjectStats[test.subject]) {
          subjectStats[test.subject] = { total: 0, sum: 0 };
        }
        subjectStats[test.subject].total++;
        subjectStats[test.subject].sum += attempt.score;
      }
    }

    const subjectPerformance = Object.keys(subjectStats).map(subject => ({
      subject,
      average: subjectStats[subject].sum / subjectStats[subject].total,
      count: subjectStats[subject].total
    }));

    return NextResponse.json({
      stats: {
        totalTests,
        averageScore: Math.round(averageScore * 10) / 10,
        subjectPerformance,
        recentAttempts: attempts.slice(0, 5)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}

// POST /api/payments
async function handleCreatePayment(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, method, itemId, itemType } = body;

    if (!amount || !method || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const paymentsCollection = await getCollection('payments');
    const payment = {
      id: uuidv4(),
      userId: user.id,
      amount,
      method,
      itemId,
      itemType: itemType || 'test',
      status: 'pending',
      transactionId: '',
      createdAt: new Date().toISOString()
    };

    await paymentsCollection.insertOne(payment);

    // For JazzCash integration (placeholder - will need actual credentials)
    if (method === 'jazzcash') {
      // This will be implemented when credentials are provided
      payment.paymentUrl = '/api/payments/' + payment.id + '/jazzcash';
    }

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}

// Main handler
export async function GET(request) {
  const { pathname } = new URL(request.url);

  // Root endpoint
  if (pathname === '/api' || pathname === '/api/') {
    return NextResponse.json({ message: 'Med Fellows API is running!' }, { status: 200 });
  }

  // Auth endpoints
  if (pathname === '/api/auth/me') {
    return handleMe(request);
  }

  // Tests endpoints
  if (pathname === '/api/tests') {
    return handleGetTests(request);
  }

  // Test by ID
  if (pathname.startsWith('/api/tests/')) {
    const testId = pathname.split('/')[3];
    if (testId && !pathname.includes('/submit')) {
      return handleGetTestById(request, testId);
    }
  }

  // Attempts
  if (pathname === '/api/attempts') {
    return handleGetAttempts(request);
  }

  // Leaderboard
  if (pathname === '/api/leaderboard') {
    return handleGetLeaderboard(request);
  }

  // Dashboard stats
  if (pathname === '/api/dashboard/stats') {
    return handleGetDashboardStats(request);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request) {
  const { pathname } = new URL(request.url);

  // Auth endpoints
  if (pathname === '/api/auth/register') {
    return handleRegister(request);
  }
  if (pathname === '/api/auth/login') {
    return handleLogin(request);
  }

  // Tests
  if (pathname === '/api/tests') {
    return handleCreateTest(request);
  }

  // Submit test
  if (pathname.includes('/submit')) {
    const testId = pathname.split('/')[3];
    return handleSubmitTest(request, testId);
  }

  // Payments
  if (pathname === '/api/payments') {
    return handleCreatePayment(request);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(request) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

export async function DELETE(request) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}