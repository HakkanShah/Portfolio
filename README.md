# 🚀 Hakkan Shah's Portfolio

A modern, interactive portfolio website built with Next.js 15, featuring stunning animations, interactive mini games, and a beautiful dark/light theme.

**🌐 [Live Preview →](https://hakkan.is-a.dev)**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.2-pink?style=flat-square)](https://www.framer.com/motion/)

## ✨ Features

### 🎨 Visual Excellence
- **Stunning Animations** - Smooth, professional animations powered by Framer Motion
- **Interactive Background** - Dynamic floating elements with parallax effects
- **Dark/Light Theme** - Seamless theme switching with system preference detection
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices

### 📱 Sections
- **Hero** - Eye-catching introduction with animated terminal
- **About** - Professional background and expertise
- **Skills** - Comprehensive technical skill showcase with interactive effects
- **Experience** - Detailed work history with unique perspectives
- **Projects** - Portfolio of featured projects with live demos
- **Education** - Academic background
- **Certifications** - Professional certifications
- **Contact** - Get in touch via integrated form

> **🐣 Easter Eggs**: This portfolio contains several delightful easter eggs and interactive surprises. Explore and discover them yourself!

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: [Next.js 15.3](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Animations**: [Framer Motion 11.2](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)

### Additional Libraries
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Email**: [Resend](https://resend.com/)
- **Backend**: [Firebase](https://firebase.google.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HakkanShah/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
 
3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # 📧 Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key
   # 👾 Discord Webhook (Visitor Notifications)
   DISCORD_WEBHOOK_URL=your_discord_webhook_url
   # 🔥 Firebase Configuration (Visitor Counter)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:9002](http://localhost:9002)

## 🛠️ Setup Guide

### 👾 Discord Notifications
1. Create a server (or use an existing one) on Discord.
2. Go to **Server Settings** > **Integrations** > **Webhooks**.
3. Click **New Webhook**, give it a name (e.g., "Portfolio Bot"), and copy the **Webhook URL**.
4. Paste it into your `.env.local` as `DISCORD_WEBHOOK_URL`.

### 🔥 Firebase Visitor Counter
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Navigate to **Firestore Database** and create a database (Start in production mode).
3. Go to **Project Settings** > **General** > **Your apps** > **Web app** (</> icon).
4. Register the app and copy the `firebaseConfig` object values to your `.env.local`.
5. **Important**: Set Firestore Rules to allow read/write for the counter:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /site_stats/visitors {
         allow read, write: if true;
       }
     }
   }
   ```

## 💡 Features & Usage

### 🔗 Source Tracking
Track where your visitors are coming from by adding a `?ref=` parameter to your URL.
- **LinkedIn**: `your-site.com/?ref=linkedin`
- **Twitter**: `your-site.com/?ref=twitter`
- **Instagram**: `your-site.com/?ref=instagram`

The Discord notification will show **"🔗 Source: linkedin"**.

### Available Scripts

```bash
# Development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run typecheck
```

## 📦 Project Structure

```
portfolio/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── globals.css   # Global styles and animations
│   │   ├── layout.tsx    # Root layout with theme provider
│   │   ├── page.tsx      # Home page
│   │   └── sitemap.ts    # Dynamic sitemap generation
│   ├── components/       # React components
│   │   ├── games/        # Interactive mini-games
│   │   ├── ui/           # shadcn/ui components
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── skills-section.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities and data
│       ├── data.ts       # Portfolio content data
│       ├── sound.ts      # Audio utilities
│       └── utils.ts      # Helper functions
├── public/               # Static assets
├── .gitignore
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json
```

## 🎨 Customization

### Update Portfolio Content

Edit `src/lib/data.ts` to customize:
- Personal information
- Skills and expertise
- Work experience
- Projects
- Education
- Certifications

### Modify Theme Colors

Update `tailwind.config.ts` to change color scheme:
```typescript
theme: {
  extend: {
    colors: {
      // Customize your colors here
    }
  }
}
```

### Configure Animations

Adjust animation settings in `src/app/globals.css`:
```css
@keyframes your-animation {
  /* Custom animation keyframes */
}
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/HakkanShah/Portfolio)

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy!

### Deploy to Firebase Hosting

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Connect

- **Portfolio**: [hakkan.is-a.dev](https://hakkan.is-a.dev)
- **LinkedIn**: [Hakkan](https://www.linkedin.com/in/Hakkan)
- **GitHub**: [@HakkanShah](https://github.com/HakkanShah)
- **Email**: [hakkanparbej@gamil.com](mailto:hakkanparbej@gamil.com)

## 🙏 Acknowledgments

- [Framer Motion](https://www.framer.com/motion/) for the incredible animation library
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon set
- [Vercel](https://vercel.com/) for Next.js and hosting platform

---

<div align="center">
  <p>Built with ❤️ by Hakkan Shah</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div 
