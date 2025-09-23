# 🚕 Online Taxi Booking System

A modern, responsive online taxi booking platform built with Next.js 15, featuring comprehensive admin panel, user authentication, booking management, and seamless deployment capabilities.

## ✨ Features

### 🏠 **Frontend Features**
- **Responsive Design**: Mobile-first approach with perfect responsiveness across all devices
- **Modern UI/UX**: Beautiful gradient designs, smooth animations, and intuitive navigation
- **Booking System**: Real-time booking with form validation and instant confirmations
- **User Authentication**: Secure login/signup with OTP verification
- **Admin Panel**: Complete dashboard for managing bookings, users, and content
- **Image Uploads**: Cloudinary integration for seamless image management
- **WhatsApp Integration**: Direct booking via WhatsApp

### 🔧 **Backend Features**
- **API Routes**: RESTful APIs for all functionalities
- **Database Integration**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication
- **Email System**: OTP and notification emails via Nodemailer
- **File Uploads**: Secure image uploads with validation
- **Admin Management**: Role-based access control

### 📱 **Pages & Components**
- **Home Page**: Hero section, services, testimonials
- **About Page**: Company information and team details
- **Contact Page**: Contact forms and location information
- **Booking Pages**: Interactive booking forms and confirmations
- **Admin Dashboard**: Complete management interface
- **User Profile**: Personal account management
- **Authentication Pages**: Login, signup, and verification

## 🚀 **Deployment Status: READY FOR VERCEL**

### ✅ **Fixed Issues for Vercel Deployment**
1. **ES Modules Compatibility**: Converted CommonJS `require()` to ES6 `import` statements
2. **Cloudinary Configuration**: Updated to use proper ES module syntax
3. **Vercel Configuration**: Added `vercel.json` with proper settings
4. **Environment Variables**: Created `.env.example` with all required variables
5. **Build Optimization**: Configured for standalone output

### ⚠️ **Required Environment Variables**
Copy `.env.example` to `.env.local` and fill in your actual values:

```bash
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taxi-app

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for OTP and notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
EMAIL_FROM=your-email@gmail.com

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password
```

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js 18.x or higher
- MongoDB database
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-taxi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Production Build**
```bash
npm run build
npm start
```

## 🚀 **Deploy on Vercel**

### **Automatic Deployment**
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add all variables from `.env.example`
   - **Important**: Mark sensitive variables as encrypted

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your site will be live at `your-project.vercel.app`

### **Manual Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add MONGO_URI
vercel env add CLOUDINARY_CLOUD_NAME
# ... add all other variables

# Redeploy
vercel --prod
```

## 📁 **Project Structure**

```
online-taxi/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── components/    # React components
│   │   ├── admin/         # Admin pages
│   │   ├── (auth)/        # Authentication pages
│   │   └── ...            # Other pages
│   ├── models/            # Database models
│   └── lib/               # Utility libraries
├── public/                # Static assets
├── scripts/               # Setup scripts
├── .env.example          # Environment variables template
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## 🔧 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🧪 **Testing**

### **Mobile Responsiveness**
- ✅ All pages tested on mobile devices
- ✅ No content cutoff or overflow
- ✅ Touch-friendly interface
- ✅ Responsive breakpoints: 320px, 768px, 1024px, 1200px+

### **Browser Compatibility**
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛡️ **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **File Upload Validation**: Type and size validation
- **CORS Protection**: Configured for API security
- **Environment Variables**: Sensitive data protected

## 📞 **Support**

For issues or questions:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Check Cloudinary configuration

## 📄 **License**

This project is licensed under the MIT License.

---

**🎉 Ready for Production Deployment on Vercel!**
