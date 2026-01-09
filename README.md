SpeakUP: Smart Student Complaint Portal
SpeakUP is an intelligent, full-stack complaint management system designed to streamline the issue resolution process at a university campus. By leveraging Google's AI capabilities, it automatically categorizes and filters incoming complaints, dramatically reducing administrative overhead and speeding up student support.
✨ Features: 
Smart Complaint Processing (Powered by Gemini)Auto-Categorization: Complaints are instantly analyzed by the Gemini API and automatically sorted into relevant categories (e.g., 'IT', 'Academic', 'Facility', 'Finance') upon submission.
SPAM & Troll Detection: The system flags utterly absurd or irrelevant submissions as 'SPAM' using Gemini, keeping the admin portal clean and focused.
AI Resolution Suggestions: For administrators, the Gemini model provides a concise suggested course of action for each ticket, aiding in quick and effective resolution.
Portal Functionality-
Student Portal (student.html):Simple, secure form for submitting new complaints.History view to track the status (Open, Pending, Resolved) of all submitted tickets.Dark Mode toggle for improved accessibility.
Admin Portal (admin.html):Dashboard to view and manage all incoming tickets.Filtration by Category (e.g., IT, Facility) and Status (Open, Resolved).Toggleable SPAM filter to show/hide irrelevant complaints.Modal view to review full complaint details and AI suggestions.Option to update ticket status (Pending/Resolved) in real-time.
Core Technology-
Secure Authentication: Separate login flows for Students and Administrators.
Real-time Data: All data is managed using Firebase Firestore for instant updates across portals.
🛠️ Technology 
HTML5, CSS3, JavaScriptModern, responsive interface with a custom Dark Mode implementation.Google Firebase FirestoreServes as the real-time, NoSQL database for storing student data, admin accounts, and all complaint tickets. Gemini API (gemini-2.5-flash)The core intelligence engine for categorization, SPAM detection, and resolution suggestions.Firebase Hosting used for fast, reliable deployment of the static web application.
