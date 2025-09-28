# Instagram Clone v2

A modern Instagram clone built with Next.js 15, Node.js, and PostgreSQL, featuring Instagram's 2024 dark theme and comprehensive social media functionality.

## 🚀 Features

### Core Features

- **Authentication**: JWT-based auth with login/register
- **Posts**: Create, view, like, and comment on posts
- **Stories**: Instagram-style stories with 24-hour expiry
- **User Profiles**: Complete user management and profiles
- **Follow System**: Follow/unfollow users
- **Real-time Updates**: Live notifications and interactions
- **Responsive Design**: Mobile-first with desktop sidebar layout

### Technical Features

- **Next.js 15**: App Router with TypeScript
- **Node.js API**: Express server with Prisma ORM
- **Database**: PostgreSQL with comprehensive schema
- **State Management**: React Query + Zustand
- **Styling**: Tailwind CSS with Instagram 2024 dark theme
- **Animations**: Framer Motion for smooth transitions
- **Authentication**: JWT tokens with refresh mechanism
- **Performance**: Optimized images, caching, and code splitting

## 🏗️ Architecture

```
instagram-clone-v2/
├── server/                 # Node.js API server
│   ├── index.js           # Express server with routes
│   └── package.json       # Server dependencies
├── src/                   # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API client
│   └── styles/           # Global styles
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── package.json          # Frontend dependencies
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd instagram-clone-v2

# Install frontend dependencies
pnpm install

# Install server dependencies
cd server
pnpm install
cd ..
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb instagram_clone

# Copy environment file
cp env.example .env

# Update .env with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/instagram_clone?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
```

### 3. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development Servers

```bash
# Terminal 1: Start API server
pnpm run api:dev

# Terminal 2: Start Next.js frontend
pnpm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API Server**: http://localhost:3001
- **Database Studio**: `npx prisma studio`

## 📱 Usage

### Demo Credentials

- **Email**: admin@instagram.com
- **Password**: password

### Key Features to Test

1. **Authentication**: Login/register with validation
2. **Posts**: Create posts with images and captions
3. **Social**: Like posts, follow users
4. **Stories**: View and create stories
5. **Responsive**: Test on mobile and desktop

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Users

- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/:username` - Get user by username
- `POST /api/user/:userId/follow` - Follow/unfollow user

### Posts

- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id/like` - Like/unlike post

## 🎨 Customization

### Theme Colors

Update `src/app/globals.css` to customize the Instagram theme:

```css
:root {
  --background: 0 0% 0%; /* Black background */
  --primary: 210 100% 50%; /* Instagram blue */
  --secondary: 0 0% 15%; /* Dark gray */
}
```

### Adding New Features

1. **Database**: Update `prisma/schema.prisma`
2. **API**: Add routes in `server/index.js`
3. **Frontend**: Create components in `src/components/`
4. **Types**: Update types in `src/lib/api.ts`

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Deploy to Vercel
pnpm run build
vercel --prod
```

### API Server (Railway/Heroku)

```bash
# Set environment variables
DATABASE_URL=your-production-db-url
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-url.vercel.app

# Deploy
pnpm run api:build
pnpm run api:start
```

### Database (Supabase/PlanetScale)

```bash
# Update DATABASE_URL in production
# Run migrations
npx prisma db push
```

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Type checking
pnpm run type-check

# Linting
pnpm run lint
```

## 📊 Performance Optimizations

- **Image Optimization**: Next.js Image component with WebP
- **Code Splitting**: Dynamic imports for heavy components
- **Caching**: React Query for API response caching
- **Bundle Size**: Tree shaking and code splitting
- **SEO**: Meta tags and Open Graph

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Zod schemas
- **CORS**: Proper cross-origin configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Instagram for design inspiration
- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework

---

**Built with ❤️ using Next.js 15, Node.js, and modern web technologies.**
# Fishtechy-web-app
