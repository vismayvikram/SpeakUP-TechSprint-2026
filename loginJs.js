import { db } from "./firebaseConfig.js";
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM ELEMENTS (Unchanged)
const toggleStudent = document.getElementById('toggleStudent');
const toggleAdmin = document.getElementById('toggleAdmin');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const messageBox = document.getElementById('messageBox');

let loginType = 'student'; 

// TOGGLE LOGIC (Unchanged)
toggleStudent.addEventListener('click', () => { loginType = 'student'; toggleUI(); });
toggleAdmin.addEventListener('click', () => { loginType = 'admin'; toggleUI(); });

function toggleUI() {
    if (loginType === 'student') {
        toggleStudent.classList.add('active');
        toggleAdmin.classList.remove('active');
        usernameInput.placeholder = "Enter Student ID";
    } else {
        toggleAdmin.classList.add('active');
        toggleStudent.classList.remove('active');
        usernameInput.placeholder = "Enter Admin ID";
    }
    messageBox.className = "message hidden";
}

// LOGIN LOGIC (Migrated)
btnLogin.addEventListener('click', async () => {
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!user || !pass) {
        showMessage("Please enter both ID and Password", "error");
        return;
    }

    btnLogin.textContent = "Verifying..."; // Visual feedback

    try {
        if (loginType === 'admin') {
            // --- NEW: Check 'admins' collection in Firebase ---
            const q = query(collection(db, "admins"), where("user", "==", user));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const adminData = querySnapshot.docs[0].data();
                if (adminData.pass === pass) {
                    setTimeout(() => { window.location.href = "admin.html"; }, 1000);
                } else {
                    showMessage("Invalid Admin credentials.", "error");
                }
            } else {
                showMessage("Admin not found.", "error");
            }

        } else {
            // --- NEW: Check 'students' collection in Firebase ---
            const q = query(collection(db, "students"), where("user", "==", user));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const studentData = querySnapshot.docs[0].data();
                if (studentData.pass === pass) {
                    localStorage.setItem('currentUser', user); // Keep session local
                    setTimeout(() => { window.location.href = "student.html"; }, 1000);
                } else {
                    showMessage("Incorrect password.", "error");
                }
            } else {
                // Create New Student in Firebase
                const createNew = confirm(`User '${user}' not found.\nDo you want to create a new Student Account?`);
                if (createNew) {
                    await addDoc(collection(db, "students"), { user: user, pass: pass });
                    localStorage.setItem('currentUser', user);
                    setTimeout(() => { window.location.href = "student.html"; }, 1000);
                }
            }
        }
    } catch (e) {
        console.error("Login Error:", e);
        showMessage("Connection Error", "error");
    }

    // Reset button text
    setTimeout(() => { 
        if(btnLogin.textContent === "Verifying...") btnLogin.textContent = "LOG IN"; 
    }, 2000);
});

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
}