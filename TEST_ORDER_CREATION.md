# Testing Order Creation

## Quick Test Steps

### 1. Check if backend is running
Open browser and go to: http://localhost:5000/api/health

Should see:
```json
{
  "status": "ok",
  "message": "Wild Crunch API is running"
}
```

### 2. Test order creation endpoint directly

Open browser console and run:

```javascript
// First login to get token
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-password'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login response:', data);
  const token = data.data.token;
  
  // Then test order creation
  return fetch('http://localhost:5000/api/orders/create-from-cart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
})
.then(r => r.json())
.then(data => console.log('Order creation response:', data))
.catch(err => console.error('Error:', err));
```

### 3. Common Issues

**Issue: "Cart is empty"**
- Add items to cart first
- Go to /products and add items

**Issue: "Product not found"**
- Run: `cd backend && npm run seed`
- This seeds products in database

**Issue: "Unauthorized"**
- Make sure you're logged in
- Check token is valid

**Issue: "Razorpay error"**
- Check backend/.env has:
  - RAZORPAY_KEY_ID
  - RAZORPAY_KEY_SECRET

### 4. Check Backend Logs

When you click "Next Step" in cart, backend should log:
```
Order creation error: [if any error]
```

Check terminal running `npm run dev` in backend folder.

### 5. Check Browser Console

When you click "Next Step", browser console should show:
```
Creating order from cart...
Order creation response: { success: true, data: {...} }
Order created: { _id: "...", orderNumber: "WC-..." }
```

If you see errors, share them!
