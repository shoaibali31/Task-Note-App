📒 Task Note — Offline Notes & Tasks Web App

Task Note is a lightweight, offline-first web application that combines a secure notes editor and a task manager into a single PWA (Progressive Web App).
It works on mobile and desktop, supports encryption, syncing through local browser storage, draggable sorting, and full offline caching.

🚀 Features:

🛠️ Installation & Setup
📥 Git Pages: https://shoaibali31.github.io/Task-Note-App/
📱 Enable PWA features
Open in browser → Add to Home Screen
Works offline after first visit.

📝 Notes App
Create, edit, and delete notes
Color-coded note cards 
Pin important notes
Drag-and-drop reordering
Encrypted notes using AES-GCM + PBKDF2 (password-protected) 

Export notes as:
.txt
Share via Web Share API
Image/PNG rendering (canvas export) 

✔️ Task Manager
Add / remove / edit tasks
Drag & drop sorting with visual indicators (drag-over, drop targets)
Undo delete & undo "Clear All" actions
Search & filter tasks in real-time
Expand / collapse long tasks with click interaction
Two sections: Remaining & Completed
Automatic saving to localStorage 

🔐 Security
Notes can be fully encrypted using AES-GCM with PBKDF2 key derivation
Password never stored — only kept in-memory during session
Encrypted notes show placeholder previews until unlocked 

📱 Mobile-Friendly UI
Responsive layout
Custom bottom navigation tabs for Tasks ↔ Notes switching (split interface) 
Touch-friendly buttons & drag interactions

🌐 Offline-First PWA
Installable on Android, iOS, Windows, macOS
Works offline with Service Worker caching
Custom offline fallback page (offline.html)
Auto caching of HTML, icons, manifest, and resources via Service Worker 

📦 Project Structure
/
├── index-mobile.html   # Main Tasks interface
├── notepad.html        # Notes homepage
├── editor.html         # Note editor (supports encryption)
├── split.html          # Combined Notes+Tasks UI wrapper
├── offline.html        # Offline fallback page
├── manifest.json       # PWA configuration
├── service-worker.js   # Caching & offline logic
├── icons/
│   ├── Tasknote192.png
│   └── Tasknote512.png

🔐 Encryption Overview
Implemented using AES-GCM (256-bit)
Key derived using PBKDF2 + SHA-256 (200,000 iterations)
Password never saved to localStorage

🔧 Service Worker
Pre-caches core files
Runtime-caches requests
Separates Google Fonts caching
Provides offline fallback

📌 Future Improvements:
Cloud sync (e.g., using user-provided WebDAV or Dropbox API)
Multi-password vaults
Tagging & categorization system
Calendar integration for tasks
