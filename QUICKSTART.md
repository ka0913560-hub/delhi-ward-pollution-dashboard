# 🚀 Quick Start Guide

## For Immediate Testing (Right Now!)

### Option 1: Direct Browser Opening
1. Double-click `index.html`
2. That's it! The dashboard should load immediately.

**Note:** Some browsers may restrict file:// protocol features (like local storage). If you encounter issues, use Option 2.

---

### Option 2: Local Server (Recommended)

#### Using Python (if installed):
```bash
# Navigate to project directory
cd c:\Users\lenovo\Downloads\pollution-main

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Open browser to: http://localhost:8000
```

#### Using Node.js (if installed):
```bash
# Install serve globally (one-time)
npm install -g serve

# Run server
serve

# Or use npx (no installation needed)
npx serve

# Open browser to the URL shown (usually http://localhost:3000)
```

#### Using VS Code Live Server:
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 🗺️ Navigation Guide

### **Tab 1: Overview**
- See Delhi-wide statistics
- Quick action buttons
- Recent alerts summary

### **Tab 2: Ward Map**
- Interactive map of 250 wards
- Click any ward to see details
- Color-coded by pollution severity
- Right sidebar shows selected ward details

### **Tab 3: Governance**
- Ward councillor information
- Contact details
- Active environmental initiatives
- Budget transparency
- Performance metrics

### **Tab 4: Citizen Feedback**
- Report pollution issues
- View community reports
- Filter by status
- Support/upvote reports
- See statistics

### **Tab 5: Alerts**
- Active pollution alerts
- Ward-specific insights
- 48-hour predictions
- Health recommendations

### **Tab 6: Leaderboard**
- Top performing wards
- Wards needing attention
- Achievement badges
- Compare wards tool
- Citizen engagement rankings

---

## 🎯 Key Features to Try

1. **Search Functionality**
   - Type in the top search bar
   - Search by ward name, code, or zone
   - Click result to view ward details

2. **Ward Selection**
   - Click any colored cell in the map
   - See comprehensive pollution data in sidebar
   - Notice the color represents AQI severity:
     - 🟢 Green = Good (0-50)
     - 🟡 Yellow = Moderate (51-100)
     - 🟠 Orange = Poor (101-200)
     - 🔴 Red = Severe (200+)

3. **Report an Issue**
   - Go to "Citizen Feedback" tab
   - Fill out the form
   - Submit (data stored in browser)
   - See your report appear in the list below

4. **Compare Wards**
   - Go to "Leaderboard" tab
   - Scroll to "Compare Wards" section
   - Select two different wards
   - Click "Compare"
   - See side-by-side metrics

5. **View Predictions**
   - Go to "Alerts" tab
   - Select a ward from the map first (or view Delhi-wide)
   - See 48-hour forecast timeline

---

## 🔧 Troubleshooting

### **Nothing loads / Blank page**
- Check browser console (F12)
- Ensure all files are in correct folders
- Try using a local server instead of direct file opening

### **Map not showing**
- Give it a few seconds to render 250 wards
- Check if JavaScript is enabled
- Try refreshing the page

### **Search not working**
- Type at least 2 characters
- Click outside search box to close results
- Try searching for "North" or "Ward 1"

### **Videos in old files**
- The old `water.mp4` and video files are no longer used
- Safe to delete them
- The new dashboard doesn't require any video files

---

## 📱 Mobile Testing

1. Open on your phone's browser
2. Should automatically adapt to mobile layout
3. All features work on touch screens
4. Tab system scrolls horizontally on small screens

---

## 🎨 Customization

### **Change Colors**
Edit `styles/main.css`:
```css
:root {
  --blue: #3b82f6;   /* Primary color */
  --cyan: #4dd0e1;   /* Accent color */
  /* ... change other colors */
}
```

### **Add More Wards**
Edit `data/wardData.js`:
```javascript
// Change this number in the loop:
for (let i = 1; i <= 250; i++) {
  // Change to any number
}
```

### **Modify Pollution Thresholds**
Edit component files to change alert thresholds, AQI categories, etc.

---

## 🐛 Known Limitations (By Design)

1. **Data is simulated** - Real APIs not integrated yet
2. **No backend** - Reports stored in browser only
3. **No authentication** - Anyone can report
4. **Simplified map** - Grid layout instead of real ward boundaries
5. **Live updates simulated** - Updates random wards every 10 seconds

**These are features to add in Phase 2 with backend integration!**

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ You can see the main dashboard with 6 tabs
- ✅ The ward map shows 250 colored cells
- ✅ Clicking a ward updates the sidebar
- ✅ Search finds wards as you type
- ✅ Forms submit successfully
- ✅ Alerts display in the Alerts tab
- ✅ Leaderboard shows rankings

---

## 📞 Need Help?

Check:
1. Browser console for errors (F12)
2. Ensure all files are present
3. Try a different browser
4. Use local server instead of direct file opening

---

## 🎉 Ready for Presentation?

### **Hackathon Demo Script:**
1. Start with Overview tab - show statistics
2. Go to Ward Map - click different wards, show color coding
3. Select a specific ward - show detailed metrics
4. Go to Governance - explain accountability features
5. Go to Feedback - submit a sample report
6. Go to Alerts - show predictions
7. Go to Leaderboard - show rankings and comparisons

**Total demo time: 5-7 minutes**

---

**Enjoy exploring Delhi's 250 wards! 🌆🌱**
