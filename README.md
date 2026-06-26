# Med Fellows - MDCAT Preparation Platform

A comprehensive full-stack educational platform for MDCAT and other medical entrance exam preparation.

## 🎯 Features Implemented

### Core Features (MVP)
- ✅ **Multi-role Authentication**: Student, Teacher, and Admin roles with email/password
- ✅ **Online Test System**: 
  - MCQ-based tests with multiple subjects
  - Timed and Practice modes
  - Real-time timer for timed tests
  - Question navigation
  - Auto-submit when time expires
- ✅ **Results & Analytics**:
  - Detailed test results with score percentage
  - Answer review with explanations
  - Correct/incorrect answer highlighting
- ✅ **Student Dashboard**:
  - Test history
  - Performance analytics
  - Subject-wise performance tracking
  - Average score calculation
- ✅ **Teacher Tools**:
  - Create tests with custom questions
  - Add MCQs with 4 options
  - Set correct answers and explanations
  - Configure test duration and pricing
- ✅ **Leaderboard System**: Rankings based on scores and time
- ✅ **Responsive Design**: Professional coaching-style UI with Tailwind CSS + shadcn/ui

### Subjects Covered
- Biology
- Chemistry
- Physics
- English
- Logical Reasoning

### Exam Types Supported (Architecture ready)
- MDCAT Sindh,Punjab, KPK, Fedral, Balochistan (Primary focus)
- NUMS
- AMC 
- Agha khan entrance test
- NTS
- STS IBA
- BS Nursing
- DPT
- MLT
- 

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with React 18
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React

## 📁 Project Structure

```
/app/
├── app/
│   ├── page.js                      # Landing page
│   ├── login/page.js                # Login page
│   ├── register/page.js             # Registration page
│   ├── dashboard/page.js            # Student/Teacher dashboard
│   ├── tests/page.js                # Browse tests
│   ├── test/[id]/page.js           # Take test
│   ├── teacher/create-test/page.js # Create test (Teacher only)
│   └── api/[[...path]]/route.js    # All backend APIs
├── components/ui/                   # shadcn/ui components
├── lib/
│   ├── db.js                       # MongoDB connection
│   ├── auth.js                     # Authentication helpers
│   └── constants.js                # App constants
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get test by ID
- `POST /api/tests` - Create test (Teacher/Admin only)
- `POST /api/tests/:id/submit` - Submit test answers

### Dashboard
- `GET /api/attempts` - Get user's test attempts
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/leaderboard` - Get leaderboard

### Payments (Structure Ready)
- `POST /api/payments` - Create payment

## 🗃️ Database Schema

### Users Collection
```javascript
{
  id: String (UUID),
  name: String,
  email: String,
  password: String (hashed),
  role: String (student/teacher/admin),
  phone: String,
  avatar: String,
  paidContent: Array,
  token: String,
  createdAt: String
}
```

### Tests Collection
```javascript
{
  id: String (UUID),
  title: String,
  subject: String,
  type: String,
  duration: Number (minutes),
  price: Number,
  isFree: Boolean,
  questions: Array,
  createdBy: String (user ID),
  createdAt: String
}
```

### Test Attempts Collection
```javascript
{
  id: String (UUID),
  userId: String,
  testId: String,
  testTitle: String,
  answers: Array,
  results: Array,
  score: Number,
  correctAnswers: Number,
  totalQuestions: Number,
  mode: String (timed/practice),
  timeTaken: Number (seconds),
  completedAt: String
}
```

### Leaderboard Collection
```javascript
{
  id: String (UUID),
  userId: String,
  userName: String,
  testId: String,
  testTitle: String,
  score: Number,
  timeTaken: Number,
  completedAt: String
}
```

## 🎨 User Roles

### Student
- Browse and take tests
- View test results with explanations
- Track performance analytics
- View leaderboard rankings
- Access free and paid content

### Teacher
- All student features
- Create new tests
- Add questions with explanations
- View student performance

### Admin
- All teacher features
- Set test pricing (free/paid)
- User management (future)
- Platform analytics (future)
- Content moderation (future)

## 🔜 Ready for Integration (Pending Credentials)

### Payment Integration - JazzCash
Structure is ready. Need:
- Merchant ID
- Password/Secret Key
- Integrity Salt

### Future Enhancements
1. **Authentication**:
   - Google OAuth
   - Phone OTP verification
   
2. **Additional Payment Methods**:
   - Easypaisa
   - Debit/Credit cards
   - Bank transfer
   
3. **Content Management**:
   - Notes/PDF uploads
   - Video lecture embedding
   - Flashcards system
   
4. **Communication**:
   - WhatsApp integration
   - Email notifications
   - In-app notifications
   
5. **Advanced Features**:
   - Blog/news system
   - Contact form
   - Admin analytics dashboard
   - Certificate generation (PDF)
   - Advanced leaderboard filtering

## 🧪 Testing

Sample test accounts created:
- **Student**: student@test.com / test123
- **Teacher**: teacher@test.com / test123

Sample tests available:
- MDCAT Biology Sample Test (3 questions)
- MDCAT Chemistry Practice Test (4 questions)
- Physics Fundamentals - MDCAT (3 questions)

## 🌐 Live URL

Access the platform at: https://f936aac6-d324-448c-908d-7da4a1425efc.preview.emergentagent.com

## 💻 Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 🔐 Environment Variables

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=medfellows
NEXT_PUBLIC_BASE_URL=https://your-domain.com
CORS_ORIGINS=*
```

## 📝 Notes

- Authentication uses simple token-based system (production should use JWT with proper encryption)
- Passwords are base64 encoded (production should use bcrypt or similar)
- MongoDB ObjectIDs are avoided in favor of UUIDs for easier JSON serialization
- All test data is stored with explanations for learning purposes
- Platform architecture supports future exam types and features

## 🎓 Sample Usage Flow

1. **Student Registration**: Register with email and select "Student" role
2. **Browse Tests**: Navigate to "Browse Tests" to see available tests
3. **Take Test**: Click "Start Test" and choose mode (Timed/Practice)
4. **Complete Test**: Answer questions and submit
5. **Review Results**: See score, correct/incorrect answers, and explanations
6. **View Dashboard**: Check performance analytics and test history
7. **Check Leaderboard**: See rankings (for timed mode tests)

## 🛠️ Future Development

The platform is architected to easily add:
- More subjects and exam types
- Advanced analytics with charts
- Social features (study groups, discussions)
- Gamification (badges, achievements)
- Mobile app (React Native)
- AI-powered question recommendations
- Adaptive learning paths

---

Built with ❤️ for medical entrance exam aspirants
