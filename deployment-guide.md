# EventX Studio Deployment Guide

## 🚀 Free Hosting Deployment

### Prerequisites
- GitHub account
- MongoDB Atlas account
- Vercel account
- Railway account

---

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Set up database user and whitelist IP (0.0.0.0/0 for now)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/eventx`

---

## Step 2: Backend Deployment (Railway)

### Prepare Backend
```bash
cd backend
```

### Create railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Environment Variables (Set in Railway Dashboard)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventx
JWT_SECRET=your-super-secret-jwt-key-here
```

### Deploy Commands
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Get Railway URL
- Your backend will be at: `https://your-app-name.up.railway.app`

---

## Step 3: Frontend Deployment (Vercel)

### Update API Base URL
In `frontend/src/api/axiosInstance.js`:
```javascript
const api = axios.create({
    baseURL: "https://your-railway-app.up.railway.app/api", // Update this
    withCredentials: true,
});
```

### Update CORS in Backend
In `backend/src/server.js`:
```javascript
app.use(cors({
    origin: ["https://your-vercel-app.vercel.app", "http://localhost:5173"], // Add your Vercel URL
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
```

### Deploy to Vercel
```bash
cd frontend
npm install -g vercel
vercel
```

### Build Settings (if asked)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## Step 4: Final Configuration

### Update Frontend Environment
Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

### Update Image Handling
In your React components, update image URLs:
```javascript
// Before
src={`http://localhost:5000/${image}`}

// After
src={`https://your-railway-app.up.railway.app/${image}`}
```

---

## Alternative Free Options

### Option 1: Netlify + Railway
- Frontend: Netlify
- Backend: Railway
- Database: MongoDB Atlas

### Option 2: GitHub Pages + Render
- Frontend: GitHub Pages (static only)
- Backend: Render
- Database: MongoDB Atlas

### Option 3: Firebase Hosting + Render
- Frontend: Firebase Hosting
- Backend: Render
- Database: MongoDB Atlas

---

## Important Notes

### Security
- Use environment variables for all secrets
- Set proper CORS origins
- Use HTTPS in production

### Performance
- Enable gzip compression
- Use CDN for images
- Minimize bundle size

### Monitoring
- Set up error tracking (optional)
- Monitor database usage
- Check hosting quotas

---

## Troubleshooting

### Common Issues
1. **CORS Errors**: Update backend CORS settings
2. **Image Upload Issues**: Check file storage limits
3. **Database Connection**: Verify connection string and IP whitelist
4. **Environment Variables**: Ensure all required vars are set

### Testing
1. Test all authentication flows
2. Verify image uploads work
3. Check all CRUD operations
4. Test responsive design

---

## Cost Estimates (All Free Tiers)

| Service | Free Limits | Upgrade Cost |
|---------|-------------|--------------|
| Vercel | 100GB/month | $20/month |
| Railway | $5 credit/month | $10/month |
| MongoDB Atlas | 512MB | $9/month |
| **Total** | **FREE** | **$39/month** |

---

## Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS properly set
- [ ] All features tested in production
- [ ] Custom domain configured (optional)

---

## Your Live URLs
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.up.railway.app
- **Database**: MongoDB Atlas cluster

🎉 **Congratulations! Your EventX Studio is now live!**
