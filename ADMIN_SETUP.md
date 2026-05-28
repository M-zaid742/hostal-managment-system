# 🔐 Admin Dashboard Access Guide

## ✅ Admin Credentials Setup Complete

Your admin account has been successfully created with the following credentials:

### Login Details
- **Email**: `admin`
- **Password**: `zaid1234`
- **Role**: `admin`

---

## 🚀 How to Access the Admin Dashboard

### Step 1: Ensure Servers are Running
Both frontend and API servers must be running:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:5000

### Step 2: Navigate to Login Page
Go to: **http://localhost:5173/login**

### Step 3: Enter Admin Credentials
- **Email/Username**: `admin`
- **Password**: `zaid1234`

### Step 4: Access Admin Dashboard
After successful login, navigate to: **http://localhost:5173/admin/dashboard**

Or it will auto-redirect if you have admin role.

---

## 📊 What You Can Do in Admin Dashboard

### View Statistics
- **Pending Approvals**: Hostels waiting to be approved
- **Approved Hostels**: Currently active hostel listings
- **Total Users**: All registered users in the system
- **Subscriptions**: Active subscription count

### Manage Hostels
1. **Filter by Status**: View pending or approved hostels
2. **Search Hostels**: Find by name, city, or area
3. **Approve Hostels**: Click "Approve" to approve pending listings
4. **Reject Hostels**: Click "Reject" to decline listings

### Host Information
Each hostel card displays:
- Hostel name and location
- Owner name
- Email and phone
- Gender type (Girls/Boys/Co-ed)

---

## 🔧 Database Configuration

The admin user is stored in the PostgreSQL database with:
- **Username**: postgres
- **Password**: zaid1972
- **Database**: hostel_management
- **Host**: localhost
- **Port**: 5432

---

## ✨ Features of Admin Dashboard

### Real-time Actions
- ✅ Approve/reject hostels instantly
- ✅ See pending approvals in real-time
- ✅ Search and filter functionality
- ✅ View detailed hostel information

### Security
- ✅ Password encrypted with bcrypt
- ✅ Role-based access control (admin only)
- ✅ JWT token authentication
- ✅ Secure API endpoints

---

## 🆘 Troubleshooting

### Can't Login?
1. Verify both servers are running
2. Check browser console for errors
3. Ensure database is accessible

### Dashboard Not Showing?
1. Clear browser cache
2. Log out and log back in
3. Check JWT token in localStorage

### Approval Buttons Not Working?
1. Ensure API server is running on port 5000
2. Check browser network tab for API errors
3. Verify admin role is set in database

---

## 📝 Quick Test

To verify everything is working:

1. **Open browser**: http://localhost:5173/login
2. **Login with**: 
   - Email: `admin`
   - Password: `zaid1234`
3. **Navigate to**: http://localhost:5173/admin/dashboard
4. **Check**: You should see hostel approval cards
5. **Try**: Click "Approve" or "Reject" on any pending hostel

---

## 🔐 Security Notes

- Never share admin credentials
- Change password after first login (if desired)
- Keep API server secure
- Monitor admin dashboard logs
- Use HTTPS in production

---

**Setup Date**: May 28, 2026  
**Status**: ✅ Ready for Use
