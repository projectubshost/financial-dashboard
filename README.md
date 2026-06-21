# 💼 Financial Dashboard

A modern, full-stack financial management system built with Next.js 15, TypeScript, and Supabase. Track sales, expenses, employees, and generate comprehensive reports with an intuitive dashboard interface.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?style=flat-square&logo=supabase)

## ✨ Features

### 📊 Dashboard Overview
- Real-time revenue and expense tracking
- Interactive charts and visualizations with Recharts
- Recent transactions feed
- Expense breakdown by category
- Key performance indicators (KPIs)

### 💰 Sales Management
- Create, edit, and delete sales records
- Track revenue by date and category
- Sales analytics and reporting
- Search and filter capabilities

### 💳 Expense Tracking
- Comprehensive expense management
- Category-based organization
- Date range filtering
- Expense analytics with visual charts

### 👥 Employee Management
- Employee directory with full CRUD operations
- Role and department tracking
- Salary information management
- Employee status monitoring

### 📈 Reports & Analytics
- Generate custom financial reports
- Export data for analysis
- Visual data representation
- Period-based comparisons

### 🔐 Authentication & Security
- Secure user authentication with Supabase Auth
- Row-level security (RLS) policies
- Protected routes and middleware
- Role-based access control

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15.2.4 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4.1.9
- **UI Components:** Radix UI primitives
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Theme:** next-themes for dark/light mode

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage

### Developer Tools
- **Type Safety:** TypeScript with strict mode
- **Code Quality:** ESLint
- **Formatting:** Prettier (via ESLint)
- **Package Manager:** npm

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/projectubshost/financial-dashboard.git
   cd financial-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Get these values from your [Supabase Dashboard](https://app.supabase.com) under Project Settings → API.

4. **Set up the database**
   
   Run the SQL scripts in order from the `scripts/` folder in your Supabase SQL Editor:
   - `001_create_schema.sql` - Creates tables and schema
   - `002_create_profile_trigger.sql` - Sets up user profiles
   - `003_fix_rls_policies.sql` - Configures security policies
   - (Continue with remaining scripts as needed)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Tables
- **profiles** - User profiles and roles
- **sales** - Sales transactions
- **expenses** - Expense records
- **employees** - Employee information

### Key Features
- Row-Level Security (RLS) enabled on all tables
- Automatic profile creation on user signup
- Foreign key relationships for data integrity
- Indexed columns for optimal query performance

## 🎨 UI Components

Built with a comprehensive component library including:
- Accordion, Alert Dialog, Avatar
- Button, Card, Checkbox, Dialog
- Dropdown Menu, Form, Input, Label
- Select, Sheet, Table, Tabs, Toast
- And 50+ more reusable components

All components are fully typed, accessible (WCAG compliant), and themeable.

## 📱 Screenshots

### Dashboard
![Dashboard Overview](public/placeholder.svg)

### Sales Management
![Sales Page](public/placeholder.svg)

### Expense Tracking
![Expenses Page](public/placeholder.svg)

## 🚦 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📂 Project Structure

```
financial-dashboard/
├── app/                        # Next.js App Router pages
│   ├── auth/                   # Authentication pages
│   ├── dashboard/              # Dashboard page
│   ├── employees/              # Employee management
│   ├── expenses/               # Expense tracking
│   ├── sales/                  # Sales management
│   └── reports/                # Reports and analytics
├── components/                 # React components
│   ├── dashboard/              # Dashboard-specific components
│   ├── employees/              # Employee components
│   ├── expenses/               # Expense components
│   ├── sales/                  # Sales components
│   ├── layout/                 # Layout components
│   └── ui/                     # Reusable UI components
├── lib/                        # Utility functions
│   ├── supabase/               # Supabase client configuration
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Helper functions
├── hooks/                      # Custom React hooks
├── public/                     # Static assets
├── scripts/                    # Database setup scripts
└── styles/                     # Global styles
```

## 🔧 Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - UI components configuration
- `.env.local` - Environment variables (create this)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Other Platforms
- **Netlify:** Connect GitHub repo and set environment variables
- **Railway:** Deploy with automatic HTTPS
- **DigitalOcean App Platform:** One-click deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Recharts](https://recharts.org/) - Charting library
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📞 Support

For support, email project.ubs.host@gmail.com or open an issue on GitHub.

## 🔗 Links

- **Live Demo:** [Coming Soon]
- **Documentation:** [GitHub Wiki](https://github.com/projectubshost/financial-dashboard/wiki)
- **Issues:** [Report a Bug](https://github.com/projectubshost/financial-dashboard/issues)

---

**Made with ❤️ by [projectubshost](https://github.com/projectubshost)**
