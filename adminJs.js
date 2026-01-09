import { db } from "./firebaseConfig.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const GEMINI_API_KEY = "AIzaSyCliq8ysrDGBnUaCrknOkRhkM2H7e2-5So"; 
const tableBody = document.getElementById('tableBody');
const emptyMessage = document.getElementById('emptyMessage');

// Modal Elements (Unchanged)
const modal = document.getElementById('ticketModal');
const closeModal = document.getElementById('closeModal');
const m_id = document.getElementById('m_id');
const m_category = document.getElementById('m_category');
const m_date = document.getElementById('m_date');
const m_status = document.getElementById('m_status');
const m_issue = document.getElementById('m_issue');
const m_sugges = document.getElementById('m_sugges');
const btnPending = document.getElementById('btnPending');
const btnResolved = document.getElementById('btnResolved');

const catFilter = document.getElementById('catFilter'); 
const filterBtn = document.querySelector('.filterBtn'); 
const spamBtn = document.getElementById('spamBtn');
let currentCategory = 'all'; 
let showSpam = false;
let allTickets = [];

let currentFirestoreID = null; 
let localTickets = []; // Helper to store data for modal

// --- 1. FETCH (Unchanged, getting data from Firebase) ---
async function fetchAndFill() {
    tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Loading tickets...</td></tr>";
    
    try {
        const querySnapshot = await getDocs(collection(db, "tickets"));
        allTickets = []; 
        
        querySnapshot.forEach((docSnap) => {
            const ticket = docSnap.data();
            allTickets.push({ firestoreID: docSnap.id, ...ticket });
        });

        // Sort by Date (Newest first)
        allTickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        renderTable(); 

    } catch (e) {
        console.error("Fetch Error:", e);
        tableBody.innerHTML = "<tr><td colspan='5'>Error loading data.</td></tr>";
    }
}

// --- 2. RENDER (Updated with your Filter Logic) ---
function renderTable() {
    tableBody.innerHTML = "";
    
    // We filter the 'allTickets' array
    const filteredTickets = allTickets.filter(ticket => {
        // LOGIC MERGED FROM YOUR FILE:
        if (!showSpam) {
            // Normal View: Hide Spam
            if (ticket.category === "SPAM") return false;
            // Apply Category Filter
            if (currentCategory !== 'all' && ticket.category !== currentCategory) return false;
        } else {
            // Spam View: Show ONLY Spam
            if (ticket.category !== "SPAM") return false;
        }
        return true;
    });

    if (filteredTickets.length === 0) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
        
        filteredTickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="complaint-id" onclick="window.openModal('${ticket.firestoreID}')" style="cursor:pointer; text-decoration:underline;">
                        ${ticket.customID}
                    </span>
                </td>
                <td>${ticket.category}</td>
                <td class="description" title="${ticket.issue}">${ticket.issue.substring(0,40)}...</td>
                <td>${new Date(ticket.timestamp).toLocaleDateString()}</td>
                <td>${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Start App
fetchAndFill();


// --- 3. NEW EVENT LISTENERS (From your file) ---
spamBtn.addEventListener('click', () => {
    showSpam = !showSpam;
    
    if (showSpam) {
        spamBtn.textContent = "HIDE SPAM";
    } else {
        spamBtn.textContent = "SPAM";
    }
    
    renderTable(); 
});

filterBtn.addEventListener('click', () => {
    currentCategory = catFilter.value;
    renderTable();
});


// MODAL LOGIC (Unchanged structure)
window.openModal = async function(id) {
    const ticket = localTickets.find(t => t.firestoreID === id);
    if (!ticket) return;

    currentFirestoreID = ticket.firestoreID;

    // AI Suggestion
    const aiSugges = await suggest(ticket.issue);

    // Fill UI
    m_id.textContent = ticket.customID;
    m_category.textContent = ticket.category;
    m_date.textContent = new Date(ticket.timestamp).toLocaleDateString();
    m_status.textContent = ticket.status;
    m_issue.textContent = ticket.issue; 
    m_sugges.textContent = aiSugges;

    modal.classList.remove('hidden');
};

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

// UPDATE LOGIC (Migrated)
async function updateStatus(newStatus) {
    if (!currentFirestoreID) return;

    try {
        // --- NEW: Update specific doc ---
        const ticketRef = doc(db, "tickets", currentFirestoreID);
        await updateDoc(ticketRef, { status: newStatus });
        
        fillTable();
        modal.classList.add('hidden');
    } catch (e) {
        console.error("Update failed:", e);
    }
}

btnPending.addEventListener('click', () => updateStatus('pending'));
btnResolved.addEventListener('click', () => updateStatus('resolved'));

// AI Suggestion (Unchanged)
async function suggest(text) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = { contents: [{ parts: [{ text: `You are an helping an admin for a university help desk. Analyze the student complaint and give suggestion to the admin for the course of action to be taken for it to be resolved in the form of the intructional paragraph. the solution should be within 200 characters. Return ONLY the suggestion paragraph. Complaint: "${text}"` }] }] };
    try {
        const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) { return "AI Error"; }
}

// Dark Mode (Unchanged)
const btnDarkMode = document.getElementById('btnDarkMode');
btnDarkMode.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); });
document.getElementById('logout').addEventListener('click', () => { setTimeout(() => { window.location.href = "login.html"; }, 1000); });