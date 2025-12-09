# API Data Fetcher

A full-stack web application that fetches and displays data from the JSONPlaceholder API with caching, filtering, and comprehensive error handling.

## 🎯 Features

- **Backend REST API** built with Express.js
- **React Frontend** with premium UI design
- **File-based caching** with configurable TTL (5 minutes default)
- **Advanced filtering** by user ID, limit, and search terms
- **Comprehensive error handling** for network failures, timeouts, and validation
- **Responsive design** optimized for desktop, tablet, and mobile
- **Dark theme** with glassmorphism effects and smooth animations

## 🏗️ Architecture

### Backend (Express API)
- **Express.js** server with CORS support
- **File-based caching** system to reduce API calls
- **Retry logic** with exponential backoff (3 attempts)
- **Timeout handling** (10-second default)
- **Input validation** and error handling middleware

### Frontend (React + Vite)
- **React 18** with functional components and hooks
- **Axios** for API communication
- **Premium UI** with dark theme and glassmorphism
- **Responsive grid layout** for all screen sizes
- **Loading states** with skeleton loaders

## 📁 Project Structure

```
job-assignment/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js         # HTTP client with retry logic
│   │   │   └── endpoints.js      # API endpoint definitions
│   │   ├── cache/
│   │   │   └── fileCache.js      # Caching system
│   │   ├── middleware/
│   │   │   └── errorHandler.js   # Error handling middleware
│   │   ├── routes/
│   │   │   └── posts.js          # API routes
│   │   ├── utils/
│   │   │   └── validator.js      # Input validation
│   │   └── server.js             # Express server
│   ├── cache/                    # Cache storage
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PostList.jsx      # Posts grid view
│   │   │   ├── PostDetail.jsx    # Single post view
│   │   │   ├── FilterBar.jsx     # Filter controls
│   │   │   └── ErrorDisplay.jsx  # Error handling UI
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── App.jsx               # Main component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

#### GET /posts
List posts with optional filtering.

**Query Parameters:**
- `userId` (number, 1-10) - Filter posts by user ID
- `limit` (number, 1-100) - Limit number of results (default: 20)
- `search` (string) - Search in post titles and body

**Example:**
```bash
curl "http://localhost:5000/api/posts?userId=1&limit=5"
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "sunt aut facere...",
      "body": "quia et suscipit..."
    }
  ]
}
```

#### GET /posts/:id
Get a single post with user details.

**Example:**
```bash
curl "http://localhost:5000/api/posts/1"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "sunt aut facere...",
    "body": "quia et suscipit...",
    "author": {
      "id": 1,
      "name": "Leanne Graham",
      "email": "Sincere@april.biz",
      "username": "Bret"
    }
  }
}
```

#### DELETE /cache
Clear all cached data.

**Example:**
```bash
curl -X DELETE "http://localhost:5000/api/posts"
```

**Response:**
```json
{
  "success": true,
  "message": "Cleared 5 cache files",
  "count": 5
}
```

## 🎨 UI Features

### Post List View
- Responsive grid layout
- Skeleton loaders during data fetching
- Hover animations and smooth transitions
- Post ID and user badge
- Truncated body preview with "Read more" link

### Post Detail View
- Full post content
- Author information with avatar
- Glassmorphic card design
- Back navigation button

### Filter Controls
- User ID filter (1-10)
- Result limit (1-100)
- Text search across titles and body
- Reset filters button
- Clear cache button

## ⚠️ Error Handling

The application handles various error scenarios:

1. **Network Failures**
   - Automatic retry with exponential backoff (3 attempts)
   - User-friendly error messages
   - Retry button in UI

2. **Timeouts**
   - 10-second request timeout
   - Clear timeout error messages

3. **Invalid Responses**
   - JSON validation
   - Schema checking for required fields
   - Graceful degradation

4. **Missing Data**
   - Default values for optional fields
   - Empty state handling in UI

5. **Validation Errors**
   - Input parameter validation
   - Clear validation error messages

## 💾 Caching Strategy

- **Storage:** File-based caching in `backend/cache/` directory
- **TTL:** 5 minutes (configurable via `.env`)
- **Cache Keys:** Generated from endpoint and parameters
- **Expiry:** Automatic expiry checking on each request
- **Manual Clear:** DELETE endpoint or UI button

## 🧪 Testing

### Manual Testing

1. **Test Post Listing:**
   - Open the application
   - Verify posts load and display correctly
   - Test pagination/limit controls

2. **Test Filtering:**
   - Filter by User ID (1-10)
   - Set result limit
   - Search for text in posts

3. **Test Post Details:**
   - Click on any post card
   - Verify full content and author info display
   - Test back navigation

4. **Test Caching:**
   - Open browser DevTools Network tab
   - Load posts
   - Reload page within 5 minutes (should be instant)
   - Check `backend/cache/` directory for JSON files

5. **Test Error Handling:**
   - Stop the backend server
   - Refresh frontend (should show connection error)
   - Enter invalid user ID (e.g., 999)
   - Test with slow network connection

### API Testing (Postman/curl)

```bash
# List posts
curl "http://localhost:5000/api/posts"

# Filter by user
curl "http://localhost:5000/api/posts?userId=1&limit=5"

# Search posts
curl "http://localhost:5000/api/posts?search=qui"

# Get post detail
curl "http://localhost:5000/api/posts/1"

# Clear cache
curl -X DELETE "http://localhost:5000/api/cache"
```

## 🌐 External API

**JSONPlaceholder** - https://jsonplaceholder.typicode.com

### Endpoints Used:
- `GET /posts` - Fetch all posts
- `GET /posts/:id` - Fetch single post
- `GET /users/:id` - Fetch user details

## 📝 Assumptions & Notes

1. **API Assumptions:**
   - JSONPlaceholder API is publicly accessible
   - API responses follow the documented schema
   - User IDs range from 1-10
   - Post IDs range from 1-100

2. **Caching:**
   - Cache is stored in local files (not suitable for production at scale)
   - 5-minute TTL balances freshness and performance
   - Cache is cleared on server restart

3. **Error Handling:**
   - Network errors trigger 3 retry attempts
   - Timeout set at 10 seconds (reasonable for public API)
   - All errors return user-friendly messages

4. **UI/UX:**
   - Dark theme chosen for modern aesthetic
   - Responsive breakpoint at 768px
   - Skeleton loaders improve perceived performance
   - Loading states prevent duplicate requests

5. **Performance:**
   - Initial load fetches all posts (100 items)
   - Filtering happens client-side after caching
   - Individual post details are cached separately

## 🔧 Configuration

### Backend (.env)
```properties
PORT=5000
NODE_ENV=development
CACHE_TTL_MINUTES=5
API_TIMEOUT_MS=10000
```

### Frontend (vite.config.js)
```javascript
server: {
  port: 3000,
  open: true
}
```

## 🚀 Deployment Notes

### Backend
- Set `NODE_ENV=production` in environment
- Use process manager (PM2, Forever)
- Consider Redis for caching in production
- Add rate limiting middleware
- Enable HTTPS

### Frontend
- Build for production: `npm run build`
- Serve `dist/` folder with web server
- Update `API_BASE_URL` in `api.js`
- Enable compression and caching headers

## 📦 Dependencies

### Backend
- `express` - Web framework
- `node-fetch` - HTTP client
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Frontend
- `react` - UI library
- `react-dom` - React DOM renderer
- `axios` - HTTP client
- `vite` - Build tool

## 👨‍💻 Development

Built as a job assignment to demonstrate:
- ✅ REST API integration
- ✅ Data caching strategies
- ✅ Error handling patterns
- ✅ Modern React development
- ✅ Clean code structure
- ✅ Comprehensive documentation

## 📄 License

MIT
