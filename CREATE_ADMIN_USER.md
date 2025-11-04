# Create Admin User - Quick Guide

You're seeing "Login failed" because you don't have an admin user in your database yet.

## Quick Fix (30 seconds)

### Option 1: Run the Script (Recommended)

1. **Open a terminal** in the backend folder

2. **Run this command**:
   ```bash
   cd "d:\wild crunch\Wild-Crunch-main\Wild-Crunch-main\backend"
   npm run create-admin
   ```

3. **You'll see**:
   ```
   ✅ Admin user created successfully!

   📋 Admin Credentials:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📧 Email: admin@wildcrunch.com
   🔑 Password: admin123
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

4. **Go back to login page** and use these credentials!

---

## Option 2: MongoDB Compass (Manual)

If the script doesn't work, use MongoDB Compass:

1. **Open MongoDB Compass**

2. **Connect** to your database:
   ```
   mongodb+srv://bhargavcodelix_db_user:if9uZlc9aT072m15@wildcrunch.ojbmcp5.mongodb.net/wildcrunch
   ```

3. **Find the `users` collection**

4. **Do you have any users?**

   ### If YES (you have a user):
   - Click on a user document
   - Click "Edit"
   - Find the `role` field
   - Change it from `"user"` to `"admin"`
   - Click "Update"
   - Use that user's email/password to login

   ### If NO (no users yet):
   - Click "Add Data" → "Insert Document"
   - Paste this JSON (replace with your info):
   ```json
   {
     "name": "Admin",
     "email": "admin@wildcrunch.com",
     "password": "$2a$10$YourHashedPasswordHere",
     "role": "admin",
     "phone": "9999999999",
     "addresses": [],
     "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
     "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" }
   }
   ```
   - **Problem**: You need a hashed password!
   - **Solution**: Use Option 1 (the script) instead - it handles password hashing automatically

---

## Option 3: Register via Frontend + Update Role

1. **Go to your main website** (frontend)

2. **Register a new account**:
   - Name: Admin
   - Email: admin@wildcrunch.com
   - Password: admin123

3. **Open MongoDB Compass**

4. **Find that user** in the `users` collection

5. **Edit the user**:
   - Change `role` from `"user"` to `"admin"`
   - Click "Update"

6. **Now login** to admin panel with those credentials!

---

## Verify It Worked

After creating the admin user:

1. Go to: http://localhost:3001/login
2. Enter:
   - Email: `admin@wildcrunch.com`
   - Password: `admin123`
3. Click "Sign In"
4. You should see the dashboard! 🎉

---

## Troubleshooting

### Script fails with "MongoDB connection error"
- Make sure MongoDB URI is correct in backend `.env`
- Check if backend can connect to MongoDB
- Try running `npm start` in backend first

### "Email already exists" error
- An admin user already exists!
- Try logging in with: admin@wildcrunch.com / admin123
- Or check MongoDB for existing admin users

### Still can't login
1. **Check backend is running**:
   ```bash
   cd backend
   npm start
   ```
   Should show: "MongoDB Connected" and "Server running on port 5000"

2. **Check browser console** (F12):
   - Look for error messages
   - Check Network tab for failed requests

3. **Verify API URL** in admin panel `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

---

## Quick Test

After creating admin user, test if it worked:

```bash
# In a new terminal
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wildcrunch.com","password":"admin123"}'
```

Should return a JWT token and user data with `"role": "admin"`

---

## Next Steps

Once logged in:

1. ✅ Change the default password
2. ✅ Create some products
3. ✅ Test order management
4. ✅ Explore all features

---

**Need Help?** Check the browser console and backend terminal for error messages.
