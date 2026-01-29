# 🚀 Deployment Guide - IELTS Speaking Coach AI

## 📋 Pre-Deployment Checklist

✅ **Completed:**
- [x] Project built and tested locally
- [x] Environment variables configured (`.env.local`)
- [x] `.gitignore` updated
- [x] `vercel.json` created
- [x] `netlify.toml` created
- [x] README.md updated

⚠️ **Before Deploying:**
- [ ] Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
- [ ] Choose deployment platform (Vercel or Netlify)
- [ ] Create GitHub repository (optional but recommended)

---

## 🎯 Option 1: Deploy to Vercel (Recommended)

### Why Vercel?
- ✅ Best for React/Vite projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero configuration
- ✅ Free tier is generous

### Method A: Deploy via Vercel Dashboard (Easiest)

1. **Go to [Vercel](https://vercel.com)**
   - Sign up with GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click "Add New Project"
   - Import your Git repository
   - Or drag & drop your project folder

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Go to "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your_api_key_here`
   - Make sure it's available for Production, Preview, and Development

5. **Deploy!**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live at `your-project.vercel.app`

### Method B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? ielts-speaking-coach
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

### Method C: Deploy via GitHub (Auto-Deploy)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ielts-coach.git
git push -u origin main
```

2. **Import in Vercel**
   - Go to Vercel Dashboard
   - Click "Import Project"
   - Select your GitHub repo
   - Add environment variables
   - Deploy!

**Benefit:** Every push to `main` branch auto-deploys! 🎉

---

## 🌐 Option 2: Deploy to Netlify

### Why Netlify?
- ✅ Great for static sites
- ✅ Drag & drop deployment
- ✅ Form handling
- ✅ Split testing
- ✅ Free tier is excellent

### Method A: Deploy via Netlify Dashboard (Easiest)

1. **Build Your Project**
```bash
npm run build
```

2. **Go to [Netlify](https://netlify.com)**
   - Sign up with GitHub/GitLab/Bitbucket

3. **Deploy**
   - Drag & drop the `dist` folder to Netlify
   - Or click "Add new site" → "Import an existing project"

4. **Configure Build Settings** (if using Git)
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Add Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key_here`

6. **Redeploy**
   - Trigger a new deploy to apply environment variables

### Method B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy

# Follow prompts:
# - Create new site? Yes
# - Team? Your team
# - Site name? ielts-speaking-coach
# - Publish directory? dist

# Deploy to production
netlify deploy --prod
```

### Method C: Deploy via GitHub (Auto-Deploy)

1. **Push to GitHub** (same as Vercel)

2. **Import in Netlify**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Select GitHub
   - Choose your repository
   - Configure build settings
   - Add environment variables
   - Deploy!

---

## 🔐 Environment Variables Setup

### For Vercel:
```bash
# Via CLI
vercel env add GEMINI_API_KEY

# Via Dashboard
Settings → Environment Variables → Add
```

### For Netlify:
```bash
# Via CLI
netlify env:set GEMINI_API_KEY your_key_here

# Via Dashboard
Site Settings → Environment Variables → Add variable
```

### Important Notes:
- ⚠️ **Never commit** `.env.local` to Git
- ✅ Always add environment variables in the deployment platform
- 🔒 Keep your API keys secret
- 🔄 Redeploy after adding environment variables

---

## 🎨 Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records (Netlify provides instructions)

**Free domains:**
- Vercel: `your-project.vercel.app`
- Netlify: `your-project.netlify.app`

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads correctly
- [ ] API key is working (no "API Key Missing" warning)
- [ ] Audio recording works
- [ ] AI feedback is generated
- [ ] All pages/features work
- [ ] Mobile responsive
- [ ] HTTPS is enabled
- [ ] No console errors

---

## 🐛 Troubleshooting

### Issue: "API Key Missing" warning
**Solution:** Add `GEMINI_API_KEY` environment variable in deployment platform

### Issue: Build fails
**Solution:** 
- Check build logs
- Ensure all dependencies are in `package.json`
- Try `npm install` and `npm run build` locally first

### Issue: 404 on page refresh
**Solution:** 
- Vercel: `vercel.json` should be present
- Netlify: `netlify.toml` should be present

### Issue: Environment variables not working
**Solution:**
- Redeploy after adding variables
- Check variable names (case-sensitive)
- For Vite, use `import.meta.env.VITE_` prefix if needed

---

## 📊 Deployment Comparison

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Best For** | React/Next.js | Static sites |
| **Build Time** | Fast | Fast |
| **Free Tier** | 100GB bandwidth | 100GB bandwidth |
| **Custom Domain** | ✅ Free | ✅ Free |
| **Auto HTTPS** | ✅ | ✅ |
| **Git Integration** | ✅ | ✅ |
| **Edge Functions** | ✅ | ✅ |
| **Analytics** | ✅ (paid) | ✅ (free) |

**My Recommendation:** **Vercel** for this project (better Vite support)

---

## 🚀 Quick Deploy Commands

### Vercel (One Command):
```bash
npx vercel --prod
```

### Netlify (Build + Deploy):
```bash
npm run build && npx netlify-cli deploy --prod --dir=dist
```

---

## 📱 Share Your App

After deployment, share your app:
- 🔗 Direct link: `https://your-app.vercel.app`
- 📱 QR code: Generate at [qr-code-generator.com](https://www.qr-code-generator.com/)
- 🐦 Social media: Share on Twitter, LinkedIn, etc.

---

## 🎉 You're Ready to Deploy!

Choose your platform and follow the steps above. Your IELTS Coach will be live in minutes! 🚀

**Need help?** Open an issue on GitHub or contact support.

---

**Good luck with your deployment! 🌟**
