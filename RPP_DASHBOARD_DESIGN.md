# RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
## HydroGate - Dam Gate Monitoring System Dashboard

---

### **INFORMASI UMUM**

**Nama Proyek:** HydroGate - Dam Gate Monitoring System  
**Institusi:** Politeknik Negeri Malang  
**Program Studi:** Teknik Informatika / Software Engineering  
**Semester:** 6 (Enam)  
**Mata Pelajaran:** Pemrograman Web Lanjut / Frontend Development  
**Durasi:** 1 (Satu) Pertemuan / Project Sprint  
**Tanggal Pelaksanaan:** April 2026  
**Platform:** Next.js 16.2.4 + React 19 + Tailwind CSS  

---

### **KOMPETENSI INTI**

Peserta didik mampu merancang dan mengimplementasikan dashboard monitoring sistem modern dengan menggunakan teknologi web terkini (Next.js, React, Tailwind CSS) serta dapat menerapkan prinsip-prinsip UI/UX profesional untuk aplikasi industrial IoT.

---

### **KOMPETENSI DASAR**

Setelah menyelesaikan pembelajaran ini, peserta didik diharapkan mampu:

1. **Merancang User Interface** yang modern, responsif, dan user-friendly untuk aplikasi monitoring
2. **Mengimplementasikan komponen React** dengan state management yang tepat
3. **Menerapkan Tailwind CSS** untuk styling profesional dengan konsistensi desain
4. **Membuat data visualization** menggunakan library Recharts
5. **Mengintegrasikan icons** dari Lucide React untuk visual appeal
6. **Mengatasi hydration issues** dalam Next.js SSR
7. **Menerapkan prinsip responsive design** untuk kompatibilitas multi-device
8. **Mengorganisir project structure** dengan best practices

---

### **INDIKATOR PENCAPAIAN KOMPETENSI**

| No | Kompetensi | Indikator Pencapaian |
|---|---|---|
| 1 | Desain UI/UX | ✅ Dashboard memiliki layout yang terstruktur dengan sidebar, navbar, dan main content |
| 2 | Styling | ✅ Menggunakan Tailwind CSS dengan color palette profesional (blue, navy, white) |
| 3 | Komponen Reusable | ✅ Membuat 6 komponen utama (Sidebar, Navbar, StatusCard, WaterLevelChart, GateControlPanel, ActivityLog) |
| 4 | State Management | ✅ Mengimplementasikan useState untuk interaktivitas (gate control, active menu) |
| 5 | Data Visualization | ✅ Membuat line chart dengan trend data menggunakan Recharts |
| 6 | Responsive Design | ✅ Dashboard responsif di mobile, tablet, dan desktop (grid layout) |
| 7 | Visual Indicators | ✅ Status color coding: Green (Normal), Yellow (Warning), Red (Critical) |
| 8 | Performance | ✅ Mengatasi hydration mismatch dengan client-side rendering untuk time-sensitive data |

---

### **TUJUAN PEMBELAJARAN**

**Tujuan Umum:**
Mengembangkan kemampuan peserta didik dalam membuat dashboard aplikasi monitoring yang modern, profesional, dan siap produksi dengan menggunakan teknologi Next.js dan Tailwind CSS.

**Tujuan Khusus:**
- Memahami arsitektur aplikasi Next.js dengan App Router
- Menguasai pembuatan komponen React yang terstruktur dan reusable
- Mengaplikasikan Tailwind CSS untuk styling responsif
- Mengintegrasikan library pihak ketiga (Recharts, Lucide React, date-fns)
- Mengatasi common issues dalam Next.js seperti hydration mismatch
- Menerapkan best practices dalam struktur folder dan naming convention
- Mempersiapkan codebase untuk kolaborasi tim (landing page developer)

---

### **MATERI PEMBELAJARAN**

#### **A. Konsep Dasar**

1. **Next.js App Router Architecture**
   - Struktur folder `app/` directory
   - Server components vs Client components (`'use client'` directive)
   - Metadata management
   - Styling dengan CSS modules dan Tailwind CSS

2. **React Component Design**
   - Functional components dengan hooks (useState, useEffect)
   - Props typing dengan TypeScript
   - Component composition pattern
   - Reusability dan maintainability

3. **Tailwind CSS Utilities**
   - Responsive design (mobile-first approach)
   - Color palette dan gradient
   - Spacing, sizing, dan typography
   - Dark mode support
   - Hover dan transition effects

#### **B. Komponen-Komponen Utama**

1. **Sidebar Component**
   - Fixed positioning untuk navigasi persisten
   - Menu items dengan icon integration
   - Active state management
   - Gradient background dan styling

2. **Navbar Component**
   - Sticky positioning untuk visibility
   - User profile section
   - Notification dropdown
   - Title dan subtitle

3. **Status Card Component**
   - Dynamic status indicator (Green/Yellow/Red)
   - Trend visualization (up/down arrows)
   - Reusable untuk berbagai data types
   - Hover effects dan transitions

4. **Water Level Chart Component**
   - Recharts LineChart integration
   - Multi-line visualization (current level + threshold)
   - Custom tooltip
   - Legend dan grid
   - Info statistics

5. **Gate Control Panel Component**
   - Interactive gate controls
   - Opening percentage progress bars
   - Status badges
   - Open/Close button functionality
   - System summary statistics

6. **Activity Log Component**
   - Color-coded activity entries
   - Icon integration dari Lucide React
   - Client-side date formatting (hydration fix)
   - Timestamp dengan date-fns
   - Scrollable list dengan max-height

#### **C. Styling Strategy**

```
Color Palette:
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Background: Slate (#f1f5f9)
- Text Primary: Slate-900 (#0f172a)
- Text Secondary: Slate-600 (#475569)
```

#### **D. State Management**

1. **Local Component State**
   - Gate toggle status
   - Active menu selection
   - Client-side hydration flag

2. **Static Data**
   - Chart data (24-hour trends)
   - Initial gate states
   - Activity log entries

#### **E. Advanced Topics**

1. **Hydration Issues & Solutions**
   - Penyebab: server vs client rendering perbedaan
   - Solusi: useEffect untuk client-only rendering
   - Date formatting best practices

2. **Performance Optimization**
   - Component lazy loading concepts
   - Image optimization
   - CSS optimization dengan Tailwind purging

3. **TypeScript Integration**
   - Interface definitions
   - Component props typing
   - Type safety benefits

---

### **METODOLOGI PEMBELAJARAN**

#### **Fase 1: Persiapan (Setup & Planning)**
- ✅ Instalasi dependencies (Next.js, Tailwind CSS, Recharts, Lucide React, date-fns)
- ✅ Project structure setup
- ✅ Design system definition (colors, spacing, typography)
- ✅ Component planning dan sketching

#### **Fase 2: Implementasi (Development)**
- ✅ Membuat komponen Sidebar
- ✅ Membuat komponen Navbar
- ✅ Membuat komponen StatusCard (reusable)
- ✅ Membuat komponen WaterLevelChart
- ✅ Membuat komponen GateControlPanel
- ✅ Membuat komponen ActivityLog
- ✅ Integrate semua komponen di page utama
- ✅ Styling dan refinement

#### **Fase 3: Testing & Debugging**
- ✅ Testing hydration issues
- ✅ Browser compatibility testing
- ✅ Responsive design testing
- ✅ Performance monitoring

#### **Fase 4: Documentation & Handover**
- ✅ Code documentation
- ✅ Folder structure explanation
- ✅ Component API documentation
- ✅ Setup instructions untuk next developer

---

### **ALAT DAN BAHAN**

#### **Software & Tools**
- Node.js (v18+)
- npm atau yarn
- Visual Studio Code
- Git (version control)
- Browser developer tools

#### **Dependencies**
```json
{
  "dependencies": {
    "next": "16.2.4",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "recharts": "^2.10.0",
    "lucide-react": "^0.263.0",
    "date-fns": "^2.29.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

#### **Resources**
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org)
- [Lucide React Icons](https://lucide.dev)

---

### **STRUKTUR FILE & FOLDER**

```
HydroGate/
├── src/
│   ├── app/
│   │   ├── page.tsx              (Main dashboard page)
│   │   ├── layout.tsx            (Root layout)
│   │   └── globals.css           (Global styles)
│   └── components/
│       ├── Sidebar.tsx           (Left navigation)
│       ├── Navbar.tsx            (Top navigation bar)
│       ├── StatusCard.tsx        (Reusable status card)
│       ├── WaterLevelChart.tsx   (Chart visualization)
│       ├── GateControlPanel.tsx  (Gate controls)
│       └── ActivityLog.tsx       (Activity feed)
├── public/                       (Static assets)
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── tailwind.config.js
```

---

### **PROSES PEMBELAJARAN STEP-BY-STEP**

#### **Step 1: Project Setup**
```bash
# Lihat file sudah tersedia di working directory
npm install
```

#### **Step 2: Memahami Layout Structure**
- Buka `src/app/layout.tsx`
- Pahami metadata dan root structure
- Identifikasi global styling

#### **Step 3: Memahami Main Page**
- Buka `src/app/page.tsx`
- Lihat bagaimana component-component di-import
- Analisis grid layout system

#### **Step 4: Mempelajari Komponen Satu Per Satu**
1. **Sidebar.tsx**
   - Fixed positioning dan navigation
   - useState untuk active menu
   - Icon integration

2. **Navbar.tsx**
   - Sticky positioning
   - User profile dropdown
   - Notification handling

3. **StatusCard.tsx**
   - Props structure
   - Conditional styling berdasarkan status
   - Trend visualization

4. **WaterLevelChart.tsx**
   - Recharts LineChart component
   - Data structure
   - Custom tooltip

5. **GateControlPanel.tsx**
   - Interactive state management
   - Progress bar visualization
   - Button handlers

6. **ActivityLog.tsx**
   - useEffect untuk client-side rendering
   - Hydration fix pattern
   - List rendering

#### **Step 5: Testing & Debugging**
```bash
npm run dev
# Open http://localhost:3000
# Test semua interaktif elements
```

---

### **HASIL PEMBELAJARAN (DELIVERABLES)**

#### **Fase 1: Complete Dashboard UI**
- ✅ Sidebar dengan 5 menu items
- ✅ Navbar dengan user profile dan notifications
- ✅ 4 status cards dengan real-time indicators
- ✅ Water level trend chart 24-jam
- ✅ Gate control panel dengan 4 gates
- ✅ Activity log dengan 6 entries
- ✅ System health panel
- ✅ Quick actions panel
- ✅ Key information section

#### **Fase 2: Code Quality**
- ✅ TypeScript types defined
- ✅ Component composition best practices
- ✅ Responsive design tested
- ✅ Hydration issues resolved
- ✅ Code documented dengan comments
- ✅ Folder structure organized

#### **Fase 3: Documentation**
- ✅ RPP (Rencana Pelaksanaan Pembelajaran) - **THIS FILE**
- ✅ Component API documentation
- ✅ Setup & installation guide
- ✅ Handover notes untuk next developer

---

### **PENILAIAN & KRITERIA KEBERHASILAN**

#### **Aspek Teknis (70%)**

| Kriteria | Bobot | Status |
|---|---|---|
| UI Component Implementation | 20% | ✅ Complete |
| Responsive Design | 15% | ✅ Complete |
| State Management | 15% | ✅ Complete |
| Code Quality & Best Practices | 10% | ✅ Complete |
| Error Handling & Debugging | 10% | ✅ Complete |

#### **Aspek Fungsionalitas (20%)**

| Kriteria | Bobot | Status |
|---|---|---|
| Dashboard responsif | 10% | ✅ Complete |
| Interactive elements working | 10% | ✅ Complete |

#### **Aspek Dokumentasi (10%)**

| Kriteria | Bobot | Status |
|---|---|---|
| Code documentation | 5% | ✅ Complete |
| Handover documentation | 5% | ✅ Complete |

---

### **FASE LANJUTAN - LANDING PAGE**

#### **Persiapan untuk Next Developer**

Teman Anda akan melanjutkan ke bagian **Landing Page**. Berikut adalah hal-hal yang harus dipersiapkan:

##### **A. Technical Requirements**
- Gunakan struktur Next.js yang sama
- Maintain consistency dengan dashboard design system
- Reuse komponen yang bisa di-reuse
- Gunakan Tailwind CSS untuk styling

##### **B. Pages to Create**
1. `/` - Home/Landing page
2. `/features` - Features page
3. `/about` - About page
4. `/contact` - Contact page
5. `/pricing` - Pricing page (optional)

##### **C. Design Guidelines untuk Landing Page**
```
Color Consistency:
- Gunakan color palette yang sama (Blue, Navy, White)
- Status colors (Green/Yellow/Red) untuk highlights

Typography:
- Hero section: Large, bold heading
- Body text: Clear dan readable
- CTA buttons: Prominent dan actionable

Components to Reuse:
- StatusCard (untuk feature highlights)
- Icons dari Lucide React
- Responsive grid system
```

##### **D. Recommended Structure**
```
src/
├── app/
│   ├── page.tsx              (Home/Landing)
│   ├── features/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx          (Current dashboard)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── dashboard/            (Dashboard-specific components)
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── landing/              (Landing page-specific components)
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── ...
│   └── shared/               (Shared components)
│       └── ...
```

##### **E. Next Steps Checklist**
- [ ] Review current dashboard code
- [ ] Understand component architecture
- [ ] Plan landing page wireframe
- [ ] Create landing page components
- [ ] Implement responsive design
- [ ] Integration between pages
- [ ] Testing & optimization

---

### **BEST PRACTICES UNTUK SELURUH PROJECT**

#### **Code Organization**
```
✅ Gunakan TypeScript untuk type safety
✅ Pisahkan logic dan presentation
✅ Naming convention yang konsisten (camelCase untuk variables, PascalCase untuk components)
✅ Reuse komponen sebanyak mungkin
✅ Keep components small dan focused
```

#### **Performance**
```
✅ Lazy load komponen jika perlu
✅ Optimize images
✅ Minimize bundle size
✅ Use 'use client' directive hanya saat dibutuhkan
```

#### **Maintainability**
```
✅ Add JSDoc comments untuk complex functions
✅ Keep folder structure organized
✅ Document API changes
✅ Use consistent indentation (2 spaces)
✅ Regular code reviews
```

#### **Testing**
```
✅ Test responsive design di multiple devices
✅ Test browser compatibility
✅ Check for accessibility issues
✅ Validate form inputs
✅ Test error scenarios
```

---

### **TROUBLESHOOTING GUIDE**

#### **Issue: Hydration Mismatch**
**Solusi:** Gunakan `useEffect` untuk client-only rendering pada time-sensitive data
```tsx
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);
```

#### **Issue: Styling tidak consistent**
**Solusi:** Gunakan Tailwind CSS classes yang sama dan define dalam constants

#### **Issue: Components rendering slowly**
**Solusi:** Check bundle size, lazy load jika perlu, optimize re-renders

#### **Issue: Responsive design tidak bekerja**
**Solusi:** Test di DevTools responsive mode, gunakan mobile-first approach

---

### **REFERENSI & RESOURCES**

#### **Documentation**
- [Next.js 16 Official Docs](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts Library](https://recharts.org)
- [Lucide React Icons](https://lucide.dev)
- [date-fns Documentation](https://date-fns.org)

#### **Tutorials & Guides**
- Next.js App Router Best Practices
- React Hooks Pattern
- Responsive Design with Tailwind CSS
- TypeScript Best Practices

#### **Tools**
- VS Code Extensions:
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - Git Graph
  - Thunder Client (API testing)

---

### **KESIMPULAN**

Peserta didik telah berhasil menyelesaikan fase pertama dari project HydroGate yaitu pembuatan **Dashboard UI** yang modern dan profesional. Semua komponen telah terimplementasi dengan baik, responsive design telah diterapkan, dan dokumentasi lengkap telah disediakan.

Selanjutnya, teman Anda akan melanjutkan ke fase Landing Page dengan menggunakan template yang sudah dibuat, memastikan konsistensi design dan code quality di seluruh aplikasi.

---

### **TANDA TANGAN & APPROVAL**

**Pengembang:**  
Nama: _____________________________  
Tanggal: April 19, 2026  
Tanda Tangan: _____________________________

**Review by Senior Developer:**  
Nama: _____________________________  
Tanggal: _____________________________  
Tanda Tangan: _____________________________

**Approved for Landing Page Phase:**  
Nama: _____________________________  
Tanggal: _____________________________  
Tanda Tangan: _____________________________

---

**Version:** 1.0  
**Last Updated:** April 19, 2026  
**Status:** ✅ COMPLETE - Ready for Next Phase
