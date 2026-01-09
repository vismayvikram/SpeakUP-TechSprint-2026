import { db } from "./firebaseConfig.js";
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const GEMINI_API_KEY = "AIzaSyCliq8ysrDGBnUaCrknOkRhkM2H7e2-5So"; 
const currentUser = localStorage.getItem('currentUser') || "Guest";

// UI Setup (Unchanged)
const profileText = document.querySelector('.profile-section p');
if (profileText) profileText.textContent = `Welcome, ${currentUser}`;

function generateID() {
    return "#T-" + Math.floor(1000 + Math.random() * 9000);
}

// AI Logic (Unchanged)
async function categorize(text) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = { contents: [{ parts: [{ text: `You are an AI assistant for a university help desk. Analyze the student complaint and categorize it into exactly one of these 7 single-word labels: 'IT', 'Academic', 'Facility', 'Admin', 'Finance', 'Services', 'Safety'. If it fits none, return 'Other'. If the complain is utterly absurd (somthing that isnt related to the physical, mental, emotional, financial welbeing of the uni or the student and feels like a troll message), return 'SPAM'.  Return ONLY the single label word. Complaint: "${text}"` }] }] };
    try {
        const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) { return "Other"; }
}

const formContainer = document.getElementById('form');
const successContainer = document.getElementById('success');
const textArea = document.getElementById('issueDetails');
const submitBtn = document.querySelector('#form .submit');
const resetBtn = document.querySelector('#success .submit');

// SUBMIT LOGIC (Migrated)
submitBtn.addEventListener('click', async () => {
    const entryText = textArea.value;
    if (!entryText.trim()) { alert("Please describe your issue."); return; }

    submitBtn.textContent = "Processing...";
    submitBtn.disabled = true;

    const aiCategory = await categorize(entryText);

    const ticketData = {
        customID: generateID(),
        user: currentUser,
        issue: entryText,
        category: aiCategory,
        status: "open",
        timestamp: new Date().toISOString()
    };

    try {
        // --- NEW: Add to 'tickets' collection ---
        await addDoc(collection(db, "tickets"), ticketData);
        
        formContainer.classList.add('hidden');
        successContainer.classList.remove('hidden');
    } catch (e) {
        console.error("Error:", e);
        alert("Failed to save ticket.");
    }

    submitBtn.textContent = 'SUBMIT';
    submitBtn.disabled = false;
});

resetBtn.addEventListener('click', () => {
    textArea.value = ""; 
    successContainer.classList.add('hidden');
    formContainer.classList.remove('hidden');
});

// History Table Logic (Migrated)
const tableBody = document.getElementById('historyTableBody');
const emptyMessage = document.getElementById('emptyMessage');
const history = document.getElementById('history');
const historyCard = document.getElementById('historyCard');
const home = document.getElementById('home');

async function fillTable() {
    tableBody.innerHTML = "Loading...";
    
    // --- NEW: Fetch only this user's tickets ---
    const q = query(collection(db, "tickets"), where("user", "==", currentUser));
    const querySnapshot = await getDocs(q);
    
    tableBody.innerHTML = "";
    if (querySnapshot.empty) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
        querySnapshot.forEach((doc) => {
            const ticket = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ticket.customID}</td>
                <td>${ticket.category}</td>
                <td>${ticket.issue.substring(0,40)}...</td>
                <td>${new Date(ticket.timestamp).toLocaleDateString()}</td>
                <td>${ticket.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

history.addEventListener('click', () => {
    fillTable();
    historyCard.classList.remove('hidden');
    formContainer.classList.add('hidden');
    history.classList.add('active');
    home.classList.remove('active');
});

home.addEventListener('click', () => {
    historyCard.classList.add('hidden');
    formContainer.classList.remove('hidden');
    home.classList.add('active');
    history.classList.remove('active');
});

// Logout & Dark Mode (Unchanged)
const btnDarkMode = document.getElementById('btnDarkMode');
btnDarkMode.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); });
document.getElementById('logout').addEventListener('click', () => { setTimeout(() => { window.location.href = "index.html"; }, 1000); });