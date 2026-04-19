# COMPONENT API DOCUMENTATION
## HydroGate Dashboard Components

---

## 📚 TABLE OF CONTENTS

1. [Sidebar](#sidebar)
2. [Navbar](#navbar)
3. [StatusCard](#statuscard)
4. [WaterLevelChart](#waterlevelchart)
5. [GateControlPanel](#gatecontrolpanel)
6. [ActivityLog](#activitylog)

---

## SIDEBAR

**File Location:** `src/components/Sidebar.tsx`

### **Purpose**
Fixed left sidebar navigation component dengan menu items, system status indicator, dan branding.

### **Props**
*No props required - uses internal state*

### **Component Structure**
```
Sidebar
├── Logo Section
│   ├── Logo Icon (⚙️)
│   └── Branding (HydroGate)
├── Navigation Menu
│   ├── Dashboard
│   ├── Monitoring
│   ├── Reports
│   ├── Logs
│   └── Settings
└── Footer Status
    └── System Status (● Online)
```

### **Key Features**
- Fixed positioning (left: 0, top: 0)
- Width: 256px (w-64)
- Active menu highlighting
- Gradient background (slate-900 to slate-800)
- Smooth transitions on hover
- Icon integration dari Lucide React

### **State Management**
```tsx
const [activeMenu, setActiveMenu] = useState('dashboard');
```

### **Styling**
```
Background: Gradient dari slate-900 via slate-800 to slate-900
Text Color: White dengan slate-300 untuk inactive items
Active Item: bg-blue-600 dengan shadow-lg
Hover: bg-slate-700 text-white
```

### **Icon Map**
```tsx
const icons = {
  dashboard: LayoutDashboard,
  monitoring: Activity,
  reports: BarChart3,
  logs: ClipboardList,
  settings: Settings
}
```

### **Usage Example**
```tsx
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        {/* Main content */}
      </main>
    </div>
  );
}
```

### **Responsive Behavior**
⚠️ **Note:** Current implementation tidak responsive (fixed width). Untuk mobile, perlu:
1. Hide sidebar di mobile
2. Implement hamburger menu
3. Convert ke drawer/modal

---

## NAVBAR

**File Location:** `src/components/Navbar.tsx`

### **Purpose**
Sticky top navigation bar dengan title, user profile, dan notifications.

### **Props**
*No props required - uses hardcoded data*

### **Component Structure**
```
Navbar
├── Left Section
│   ├── Title (Dam Gate Monitoring System)
│   └── Subtitle (Real-time monitoring...)
├── Right Section (Actions)
│   ├── Notifications
│   │   ├── Icon dengan badge
│   │   └── Dropdown menu
│   ├── Divider
│   └── User Profile
│       ├── Avatar
│       ├── Name & Role
│       └── Dropdown menu
```

### **Key Features**
- Sticky positioning (top: 0)
- ml-64 (offset untuk sidebar)
- White background dengan bottom border
- Dropdown menus dengan hover
- Notification badge dengan pulse animation
- User profile dengan gradient avatar

### **Data**
```tsx
const user = {
  name: 'John Davis',
  role: 'Administrator',
  initials: 'JD',
  notifications: 2
};

const notifications = [
  '⚠️ Water level high (Alert)',
  '✓ Gate A maintenance done'
];
```

### **Styling**
```
Background: White (#ffffff)
Border: Bottom border slate-200
Text: Title text-2xl font-bold, subtitle text-sm text-slate-500
Profile Avatar: Gradient bg-blue-400 to bg-blue-600
Dropdown: Absolute positioning dengan shadow
```

### **Hover Interactions**
- Notification bell: Show dropdown
- User profile: Show dropdown menu
- Both with background color change to slate-50

### **Usage Example**
```tsx
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        {/* Content */}
      </main>
    </div>
  );
}
```

### **Responsive Behavior**
- Hidden pada mobile (use media queries)
- Title visibility: hidden sm:block untuk name "John Davis"
- Gap adjustment untuk smaller screens

---

## STATUSCARD

**File Location:** `src/components/StatusCard.tsx`

### **Purpose**
Reusable card component untuk menampilkan metrics dengan status indicator, trend, dan icon.

### **Props**
```tsx
interface StatusCardProps {
  title: string;                    // Card title
  value: string | number;           // Main value
  unit?: string;                    // Unit (e.g., "meters", "m³/s")
  icon: ReactNode;                  // React element (emoji atau icon)
  status: 'normal' | 'warning' | 'critical'; // Status type
  trend?: 'up' | 'down';            // Trend direction
  trendValue?: string;              // Trend text (e.g., "+2.3m")
}
```

### **Component Structure**
```
StatusCard
├── Header
│   ├── Title
│   └── Icon (dalam rounded box)
├── Status Indicator
│   ├── Pulsing dot
│   └── Status label
├── Value Display
│   ├── Main value (text-3xl)
│   └── Unit (text-sm)
└── Trend (optional)
    ├── Arrow icon (up/down)
    └── Trend percentage
```

### **Status Styling**
```
Normal (Green):
- Background: bg-green-50
- Border: border-green-200
- Dot: bg-green-500
- Text: text-green-700

Warning (Yellow):
- Background: bg-yellow-50
- Border: border-yellow-200
- Dot: bg-yellow-500
- Text: text-yellow-700

Critical (Red):
- Background: bg-red-50
- Border: border-red-200
- Dot: bg-red-500
- Text: text-red-700
```

### **Usage Example**
```tsx
<StatusCard
  title="Water Level"
  value={75}
  unit="meters"
  icon="💧"
  status="warning"
  trend="up"
  trendValue="+2.3m"
/>
```

### **Key Features**
- Fully reusable untuk berbagai metrics
- Animated pulsing dot untuk status indicator
- Optional trend visualization
- Hover effect dengan shadow
- Border-radius: rounded-xl (12px)
- Responsive width

### **Current Usage dalam Dashboard**
```tsx
// 4 instances dalam grid layout
<StatusCard title="Water Level" value={75} unit="meters" ... />
<StatusCard title="Gate Status" value="3/4" unit="Open" ... />
<StatusCard title="Flow Rate" value={3130} unit="m³/s" ... />
<StatusCard title="Alerts" value={2} unit="Active" ... />
```

---

## WATERLEVELCHART

**File Location:** `src/components/WaterLevelChart.tsx`

### **Purpose**
Interactive line chart untuk visualisasi water level trends selama 24 jam menggunakan Recharts library.

### **Props**
*No props required - uses static data*

### **Component Structure**
```
WaterLevelChart
├── Header
│   ├── Title (Water Level Trend 24h)
│   └── Subtitle
├── Chart Area
│   ├── LineChart (Recharts)
│   ├── XAxis (Time labels: 00:00 - 22:00)
│   ├── YAxis (Level in meters: 0-100)
│   ├── CartesianGrid (Background grid)
│   ├── Tooltip (Custom styling)
│   ├── Legend
│   └── Lines
│       ├── Current Level (Blue, solid)
│       └── Critical Threshold (Red, dashed)
└── Statistics Footer
    ├── Min Level (45m)
    ├── Max Level (82m)
    └── Avg Level (64m)
```

### **Data Structure**
```tsx
const chartData = [
  { time: '00:00', level: 45, threshold: 75 },
  { time: '02:00', level: 52, threshold: 75 },
  // ... 12 data points
  { time: '22:00', level: 50, threshold: 75 },
];
```

### **Chart Configuration**

**LineChart Props:**
```tsx
<LineChart data={chartData} height={300}>
  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
  <XAxis dataKey="time" stroke="#94a3b8" />
  <YAxis stroke="#94a3b8" />
  <Tooltip contentStyle={{...}} />
  <Legend />
  
  {/* Current Level Line */}
  <Line
    type="monotone"
    dataKey="level"
    stroke="#3b82f6"        // Blue
    strokeWidth={3}
    dot={{ fill: '#3b82f6', r: 4 }}
    activeDot={{ r: 6 }}    // On hover
    name="Current Level"
  />
  
  {/* Threshold Line */}
  <Line
    type="monotone"
    dataKey="threshold"
    stroke="#ef4444"        // Red
    strokeWidth={2}
    strokeDasharray="5 5"   // Dashed
    dot={false}
    name="Critical Threshold"
  />
</LineChart>
```

### **Styling**
```
Container: bg-white, rounded-xl, border-2 border-slate-200
Chart Area: Height 300px, responsive width
Tooltip: Dark background (#1e293b), white text
Axis Labels: text-12px, slate-600 color
Grid: Light gray dashed lines
```

### **Key Features**
- 24-hour trend visualization
- Multiple lines dengan different styles
- Custom tooltip on hover
- Legend untuk clarity
- Statistics summary footer
- Responsive width (ResponsiveContainer)

### **Usage Example**
```tsx
import WaterLevelChart from '@/components/WaterLevelChart';

export default function Dashboard() {
  return (
    <div className="lg:col-span-2">
      <WaterLevelChart />
    </div>
  );
}
```

### **Data Point Interpretation**
- **Current Level (Blue Line):** Actual water level di reservoir
- **Threshold (Red Dashed Line):** Critical level di mana alarm activate
- **Gap di atas 75m:** Menunjukkan over-capacity condition

---

## GATECONTROLPANEL

**File Location:** `src/components/GateControlPanel.tsx`

### **Purpose**
Interactive control panel untuk manage 4 gates dengan status, opening percentage, flow rate, dan open/close buttons.

### **Props**
*No props required - manages internal state*

### **Component Structure**
```
GateControlPanel
├── Header
│   ├── Title
│   └── Description
├── Gates Grid (2 columns)
│   ├── Gate A
│   ├── Gate B
│   ├── Gate C
│   └── Gate D
│   (Masing-masing berisi:)
│   ├── Status header dengan dot indicator
│   ├── Opening percentage progress bar
│   ├── Flow rate display
│   ├── Control buttons (Open/Close/Lock)
└── System Summary
    ├── Gates Open count
    ├── Total Flow Rate
    └── Maintenance count
```

### **Gate Data Structure**
```tsx
interface Gate {
  id: string;
  name: string;
  status: 'open' | 'closed' | 'maintenance';
  percentage: number;      // 0-100%
  flowRate: number;        // m³/s
}

const initialGates = [
  { id: 'a', name: 'Gate A', status: 'open', percentage: 75, flowRate: 1250 },
  { id: 'b', name: 'Gate B', status: 'closed', percentage: 0, flowRate: 0 },
  { id: 'c', name: 'Gate C', status: 'open', percentage: 45, flowRate: 680 },
  { id: 'd', name: 'Gate D', status: 'maintenance', percentage: 25, flowRate: 200 },
];
```

### **State Management**
```tsx
const [gates, setGates] = useState<Gate[]>(initialGates);

const toggleGate = (id: string) => {
  setGates(gates.map((gate) => {
    if (gate.id === id && gate.status !== 'maintenance') {
      return {
        ...gate,
        status: gate.status === 'open' ? 'closed' : 'open',
        percentage: gate.status === 'open' ? 0 : 75,
        flowRate: gate.status === 'open' ? 0 : 1250,
      };
    }
    return gate;
  }));
};
```

### **Status Colors**

| Status | Background | Text | Dot Color |
|--------|-----------|------|-----------|
| Open | bg-green-100 | text-green-700 | bg-green-500 |
| Closed | bg-slate-100 | text-slate-700 | bg-slate-400 |
| Maintenance | bg-orange-100 | text-orange-700 | bg-orange-500 |

### **Button States**
```
Open Gate:
- Button text: "Close"
- Button color: bg-red-500 hover:bg-red-600
- Disabled: NO

Closed Gate:
- Button text: "Open"
- Button color: bg-green-500 hover:bg-green-600
- Disabled: NO

Maintenance Gate:
- Button text: "Open" (disabled)
- Button color: bg-slate-100
- Disabled: YES
- Text color: text-slate-400
```

### **Progress Bar Styling**
```
Container: bg-slate-200 (height: 8px)
Fill: bg-gradient-to-r from-blue-400 to-blue-600
Animation: transition-all duration-500
Width: Dynamic berdasarkan percentage
```

### **Usage Example**
```tsx
import GateControlPanel from '@/components/GateControlPanel';

export default function Dashboard() {
  return (
    <div className="mb-8">
      <GateControlPanel />
    </div>
  );
}
```

### **Key Features**
- Interactive gate toggle (except maintenance)
- Real-time percentage visualization
- Flow rate calculation per gate
- System summary statistics
- Lock button untuk setiap gate (placeholder)
- Responsive grid (1 col mobile, 2 col desktop)
- Color-coded status indicators dengan pulsing animation

---

## ACTIVITYLOG

**File Location:** `src/components/ActivityLog.tsx`

### **Purpose**
Display activity feed dengan color-coded entries, icons, timestamps, dan user information.

### **Props**
*No props required - uses static data*

### **Component Structure**
```
ActivityLog
├── Header
│   ├── Title (Recent Activity)
│   ├── Subtitle
│   └── "View All" button
├── Activity List
│   └── Each Activity Item
│       ├── Icon (Alert/Success/Info/Maintenance)
│       ├── Content
│       │   ├── Title
│       │   ├── Description
│       │   ├── Timestamp
│       │   └── User info
│       └── Colors based on type
└── Footer
    └── "View Complete Activity Log" button
```

### **Activity Type Structure**
```tsx
interface Activity {
  id: string;
  type: 'alert' | 'success' | 'info' | 'maintenance';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

const activities = [
  {
    id: '1',
    type: 'alert',
    title: 'Water Level Critical',
    description: 'Water level exceeded critical threshold (82m)',
    timestamp: new Date(Date.now() - 5 * 60000),  // 5 minutes ago
    user: 'System',
  },
  // ... more activities
];
```

### **Activity Type Styling**

| Type | Background | Border | Icon | Text Color |
|------|-----------|--------|------|------------|
| Alert | bg-red-50 | border-l-4 border-red-500 | AlertCircle (red) | text-red-* |
| Success | bg-green-50 | border-l-4 border-green-500 | CheckCircle2 (green) | text-green-* |
| Maintenance | bg-orange-50 | border-l-4 border-orange-500 | Wrench (orange) | text-orange-* |
| Info | bg-blue-50 | border-l-4 border-blue-500 | Info (blue) | text-blue-* |

### **Icons Used (dari Lucide React)**
```tsx
const iconMap = {
  alert: AlertCircle,
  success: CheckCircle2,
  maintenance: Wrench,
  info: Info
};
```

### **Hydration Fix Implementation**
```tsx
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

const formatTime = (timestamp: Date) => {
  if (!isClient) return 'recently';
  return formatDistanceToNow(timestamp, { addSuffix: true });
};
```

**Why:** `formatDistanceToNow()` menghasilkan output berbeda setiap detik. Dengan hydration fix, server render "recently" dan client render actual time setelah mount.

### **Usage Example**
```tsx
import ActivityLog from '@/components/ActivityLog';

export default function Dashboard() {
  return (
    <div className="lg:col-span-2">
      <ActivityLog />
    </div>
  );
}
```

### **Key Features**
- Color-coded activity types
- Icon-based visual distinction
- User attribution
- Timestamp dengan natural language ("5 minutes ago")
- Scrollable list (max-height: 24rem)
- Hover effects dengan shadow
- Border-left accent untuk visual hierarchy
- Client-side date formatting untuk SSR compatibility

### **Data Flow**
```
Static data array
    ↓
Map dengan isClient check
    ↓
Conditional timestamp rendering (formatTime function)
    ↓
Color-coded UI based on type
    ↓
Display dengan icons dan user info
```

---

## 🔗 DEPENDENCIES REFERENCE

| Component | Dependencies |
|-----------|---|
| Sidebar | lucide-react |
| Navbar | lucide-react |
| StatusCard | lucide-react |
| WaterLevelChart | recharts |
| GateControlPanel | lucide-react |
| ActivityLog | lucide-react, date-fns |

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile (default): Full width, single column
Tablet (md:):     2 columns untuk grids
Desktop (lg:):    3-4 columns, wider layouts
```

---

## ✅ COMPONENT CHECKLIST

### **Before Using Components:**
- [x] All TypeScript types defined
- [x] Props properly documented
- [x] Default states configured
- [x] Responsive behavior tested
- [x] Accessibility considered
- [x] Performance optimized

### **For Next Developer:**
- [ ] Read this documentation
- [ ] Review component code
- [ ] Test each component individually
- [ ] Understand styling approach
- [ ] Check data structure
- [ ] Test responsiveness
- [ ] Verify interactivity

---

**Version:** 1.0  
**Last Updated:** April 19, 2026  
**Status:** ✅ READY FOR REFERENCE
