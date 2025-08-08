# ChatKuy - Real-time Chat Application

A modern, full-stack real-time chat application built to complete the test questions from Qiscus as an intern web developer. This application demonstrates proficiency in Vue.js, Node.js, Socket.io, and PostgreSQL, featuring one-on-one messaging, group chats, typing indicators, user authentication, and file uploads.

![Chat Preview](frontend/public/image/chat-preview.png)

## 🚀 Features

### Core Features
- **Real-time Messaging** - Instant message delivery using Socket.io
- **User Authentication** - Secure JWT-based authentication
- **One-on-One Chat** - Private conversations between users
- **Group Chat** - Create and manage group conversations
- **File Upload** - Share images and files in conversations
- **Typing Indicators** - See when others are typing
- **Message History** - Persistent message storage
- **Responsive Design** - Works on desktop and mobile devices

### User Management
- User registration and login
- Profile management with avatar support
- User search and discovery
- Online status indicators

### Group Features
- Create and manage groups
- Add/remove participants
- Admin and member roles
- Group info editing
- Leave group functionality

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Vue Router** - Client-side routing
- **PrimeVue** - UI component library
- **SweetAlert2** - Beautiful alerts and modals

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **Socket.io** - Real-time bidirectional communication
- **Prisma** - Modern database toolkit
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v13 or higher)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/asesmen-qiscus.git
cd asesmen-qiscus
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Open Prisma Studio to manage database
npm run db:studio
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The backend server will run on `http://localhost:3000`

### 3. Frontend Setup

#### Navigate to frontend directory (in a new terminal)
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# For production, use your backend domain:
# VITE_API_URL=https://your-backend-domain.com
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variable: `VITE_API_URL=https://your-backend-domain.com`
   - Deploy

### Backend Deployment

#### Option 1: Railway/Heroku
1. Create a new project
2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT`
4. Deploy

#### Option 2: VPS with nginx
1. **Install dependencies on server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   ```

2. **Setup project**
   ```bash
   git clone https://github.com/your-username/asesmen-qiscus.git
   cd asesmen-qiscus/backend
   npm install
   npm run build
   ```

3. **Configure nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Setup SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## 📱 Usage

### Getting Started
1. **Register a new account** or **login** with existing credentials
2. **Start a conversation** by searching for users by their ID
3. **Create a group** by clicking the "+" button and selecting "Make a Group"
4. **Send messages, files, and images** in real-time
5. **Manage groups** by adding/removing participants and updating group info

### User Roles
- **Admin (0)**: Can manage group settings, add/remove members, update roles
- **Member (2)**: Can send messages and view group information

## 🔌 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile/detail` - Get user profile
- `PUT /profile/update` - Update user profile

### Conversations
- `GET /conversations` - Get user conversations
- `POST /conversations` - Start new conversation
- `POST /groups` - Create new group
- `PUT /conversations/:id` - Update group information
- `DELETE /conversations/:id` - Delete group

### Participants
- `GET /conversations/:id/participants` - Get group participants
- `POST /conversations/:id/participants` - Add participant to group
- `DELETE /conversations/:id/participants/:participantId` - Remove participant
- `PUT /conversations/:id/participants/:participantId/role` - Update participant role

### Messages (Socket.io Events)
- `send_message` - Send a message
- `get_messages` - Get conversation messages
- `typing_start` - Start typing indicator
- `typing_end` - Stop typing indicator
- `join_conversation` - Join conversation room

## 🎨 Project Structure

```
asesmen-qiscus/
├── backend/
│   ├── src/
│   │   ├── controller/          # Request handlers
│   │   ├── middleware/          # Authentication & file upload
│   │   ├── model/              # Database operations
│   │   ├── routes/             # API routes
│   │   ├── sockets/            # Socket.io handlers
│   │   ├── utils/              # Utility functions
│   │   └── index.ts            # Main server file
│   ├── prisma/                 # Database schema & migrations
│   └── uploads/                # Uploaded files
├── frontend/
│   ├── src/
│   │   ├── components/         # Vue components
│   │   ├── molecules/          # Reusable UI components
│   │   ├── page/              # Page components
│   │   ├── helpers/           # Helper functions
│   │   ├── utils/             # Utility functions
│   │   └── routes/            # Router configuration
│   └── public/                # Static assets
└── README.md
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- File upload size is limited to 10MB
- Group member limit is not enforced
- Mobile responsiveness can be improved in some areas

## 🔮 Future Enhancements

- [ ] Voice messages
- [ ] Video calls
- [ ] Message reactions
- [ ] Message search
- [ ] Dark mode
- [ ] Push notifications
- [ ] Message encryption
- [ ] File preview
- [ ] User blocking
- [ ] Message forwarding

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) for the amazing frontend framework
- [Socket.io](https://socket.io/) for real-time communication
- [Prisma](https://www.prisma.io/) for the excellent database toolkit
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework