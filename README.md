# Scripta ⚡

Scripta is a powerful platform for creating, organizing, and managing content scripts. From idea to posting, Scripta helps you craft viral content with ease. Built for content creators who want to streamline their scriptwriting workflow.

## Features

✨ **Script Management**
- Create and edit scripts with dedicated full-page editors
- Organize scripts by status: Idea, Drafting, Ready, Shot, Posted
- Add rich content fields: Hook, CTA, Instagram links, and filming locations
- Search and filter scripts in real-time

👤 **User Authentication**
- Secure signup and login with JWT tokens
- Email verification system
- Resend verification emails anytime
- Password reset functionality

⚙️ **Profile Management**
- Edit username and password with validation
- View and manage email verification status
- Secure password change with old password verification
- Email can't be changed (security measure)

🎨 **User Experience**
- Beautiful dark mode support
- Mobile-responsive design
- Masonry layout for script grid
- Real-time search across all scripts
- Toast notifications for user feedback
- Profile dropdown menu in navbar

📧 **Email System**
- Professional HTML email templates
- Verification emails with secure tokens
- Password reset emails
- Powered by Mailtrap

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database
- Mailtrap account (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # JWT
   TOKEN_SECRET=your_jwt_secret_key

   # Email Configuration
   EMAIL_USER=your_mailtrap_username
   EMAIL_PASSWORD=your_mailtrap_password
   EMAIL_FROM=noreply@scripta.dev

   # API
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use Scripta

### 1. Getting Started
- Visit the app and sign up with your email
- Verify your email through the verification link
- Log in to your account

### 2. Creating Scripts
- Click the **"New Script"** button on the scripts page
- Fill in the script details:
  - **Title**: Give your script a catchy name
  - **Hook**: The opening line that grabs attention
  - **Content**: The main script content
  - **CTA**: Call-to-action message
  - **Status**: Track where your script is in the workflow
  - **Instagram Link**: Reference Instagram content
  - **Locations**: Add multiple filming locations

### 3. Managing Scripts
- **Edit**: Click the pencil icon on any script to edit
- **Delete**: Click the trash icon to remove scripts
- **Search**: Use the search bar to find scripts by title or content
- **Status Tracking**: Filter scripts by their current production status

### 4. Profile Settings
- Click your avatar in the navbar to access the profile menu
- Select **"Profile Settings"** to:
  - Update your username
  - Change your password (with old password verification)
  - Check email verification status
  - Resend verification emails if needed

### 5. Theme Preferences
- Click your profile avatar and toggle between **Light Mode** and **Dark Mode**
- Your preference is automatically saved

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── login/
│   │       ├── signup/
│   │       ├── me/
│   │       ├── updateprofile/
│   │       ├── resendverification/
│   │       └── ...
│   ├── profile/
│   │   └── page.tsx          # Profile settings page
│   ├── scripts/
│   │   ├── page.tsx          # Scripts grid view
│   │   └── edit/
│   │       ├── page.tsx      # Create new script
│   │       └── [id]/
│   │           └── page.tsx  # Edit existing script
│   └── login/, signup/        # Auth pages
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── ScriptForm.tsx        # Reusable script form
│   └── Note.tsx
├── context/
│   └── UserContext.tsx       # Global user state
├── models/
│   ├── userModel.js          # User schema
│   └── scriptModel.js        # Script schema
├── helpers/
│   ├── auth.ts               # JWT token utilities
│   └── mailer.ts             # Email sending
└── dbConfig/
    └── dbConfig.ts           # Database connection
```

## Tech Stack

- **Framework**: Next.js 16.2.10 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose v8.24.1
- **Authentication**: JWT with jsonwebtoken v9.0.3
- **Password Hashing**: bcryptjs v2.4.3
- **Email**: Nodemailer v9.0.3 with Mailtrap
- **UI Icons**: lucide-react v1.23.0
- **Notifications**: react-hot-toast v2.6.0
- **HTTP Client**: axios v1.18.1

## Key Functionality

### Authentication Flow
1. User signs up with email and password
2. Password is hashed with bcrypt
3. Verification email is sent
4. User verifies email via link
5. User can log in and access scripts

### Script Management
- Scripts are stored with userId reference
- Search uses regex pattern matching
- Status workflow helps organize content
- Multiple locations can be added per script

### Security Features
- JWT tokens stored in HTTP-only cookies
- Route protection via middleware
- Old password verification for password changes
- Email tokens with expiration
- Password validation on updates

## Development

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Lint code
```bash
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Email not sending?
- Verify Mailtrap credentials in `.env.local`
- Check email configuration in `src/helpers/mailer.ts`
- Ensure TLS settings are correct

### Scripts not loading?
- Check MongoDB connection string
- Verify user is logged in
- Check browser console for API errors

### Password change failed?
- Ensure old password is entered correctly
- New password must be at least 6 characters
- New password must be different from old password

## Future Enhancements

- [ ] View only mode for scripts
- [ ] Autosave feature for scripts
- [ ] Add bin feature
- [ ] Add pinned scripts
- [ ] Make a copy feature
- [ ] Multiple delete scripts
- [ ] Archive feature
- [ ] Integrate AI assistant for script suggestions
- [ ] AI-powered suggestions
- [ ] Export scripts in multiple formats
- [ ] Add character dialogue support
- [ ] Reel viral score/analytics

## Contributing

Feel free to fork, create a branch, and submit pull requests for any improvements!

## License

This project is open source and available under the MIT License.
