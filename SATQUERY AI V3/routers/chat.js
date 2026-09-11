const FASTAPI_CHAT_URL = "http://localhost:8000/api/v1/chat/";

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const history = document.getElementById('chatHistory');

    if (!input || !history) return;
    const query = input.value.trim();
    if (!query) return;

    // User message render
    history.innerHTML += `<div class="msg user">${escapeHtml(query)}</div>`;
    input.value = '';
    history.scrollTop = history.scrollHeight;

    // Image scan check
    if (!window.imageLoaded) {
        setTimeout(() => {
            history.innerHTML += `<div class="msg assistant">⚠️ <strong>Arey bhai!</strong> Pehle koi satellite image upload karke <strong>'Scan Image Pixels'</strong> par click toh karo. Tabhi toh main aapko exact data ke basis par guide kar paunga! 😊</div>`;
            history.scrollTop = history.scrollHeight;
        }, 200);
        return;
    }

    // Try FastAPI Backend
    try {
        const response = await fetch(FASTAPI_CHAT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query, stats: window.pixelStats })
        });

        if (response.ok) {
            const data = await response.json();
            const reply = data.reply || data.response || data.message;
            renderAssistantReply(history, reply);
            return;
        }
    } catch (err) {
        console.warn("Backend offline. Running Smart Local AI Copilot Persona...");
    }

    // Smart Conversational AI Logic (Real AI Feel)
    const stats = window.pixelStats;
    const q = query.toLowerCase();
    let reply = "";

    if (q.includes('fasal') || q.includes('kheti') || q.includes('kisan') || q.includes('crop') || q.includes('vegetation') || q.includes('haryali')) {
        reply = `<strong>🌾 Fasal & Kheti Analytics Report:</strong><br><br>` +
                `Dekhiye bhai, scanned image ke aadhar par aapke kshetra mein:<br>` +
                `• 🌳 <strong>Haryali / Vegetation:</strong> ${stats.vegetation}%<br>` +
                `• 🏜️ <strong>Khali Zameen / Soil:</strong> ${stats.barren}%<br><br>` +
                `<strong>💡 Meri Advise:</strong> ${stats.vegetation > 30 ? 'Fasal ki condition kaafi badiya lag rahi hai! Crop health maintain rakhne ke liye niyamit sinchai aur time par khaad dete rahein.' : 'Vegetation level kaafi kam hai. Agar yeh khet ka ilaka hai, toh pehle mitti mein moisture check karein aur sinchai par dhyan dein.'}`;
    } 
    else if (q.includes('building') || q.includes('makan') || q.includes('construction') || q.includes('urban') || q.includes('ghar') || q.includes('city')) {
        reply = `<strong>🏢 Urban & Infrastructure Breakdown:</strong><br><br>` +
                `Image scan ke hisab se status yeh hai:<br>` +
                `• 🏢 <strong>Concrete / Buildings:</strong> ${stats.buildings}%<br>` +
                `• 🏜️ <strong>Open / Barren Land:</strong> ${stats.barren}%<br><br>` +
                `<strong>💡 Spatial Insight:</strong> ${stats.buildings > 25 ? 'Yeh ek dense urban zone lag raha hai jahan construction kafi zyada hai.' : 'Yahan abhi bhi kafi khali zameen available hai, jo future planning ya open green space ke liye suitable hai.'}`;
    }
    else if (q.includes('paani') || q.includes('water') || q.includes('river') || q.includes('lake') || q.includes('pond')) {
        reply = `<strong>💧 Water Resource Analysis:</strong><br><br>` +
                `• 💧 <strong>Water Coverage:</strong> ${stats.water}%<br><br>` +
                `<strong>💡 Status:</strong> ${stats.water > 5 ? 'Haan ji! Satellite view mein paani ka shrot (reservoir/pond/river) saaf detect ho raha hai.' : 'Is satellite photo mein paani ka koi bada body detect nahi hua hai.'}`;
    }
    else {
        reply = `<strong>🛰️ SatQuery AI Overall Spatial Report:</strong><br><br>` +
                `Main aapke location ka poora breakdown de raha hoon:<br>` +
                `• 🌳 <strong>Vegetation (Haryali):</strong> ${stats.vegetation}%<br>` +
                `• 🏢 <strong>Buildings (Concrete):</strong> ${stats.buildings}%<br>` +
                `• 🏜️ <strong>Barren Soil (Khali Land):</strong> ${stats.barren}%<br>` +
                `• 💧 <strong>Water Bodies (Paani):</strong> ${stats.water}%<br><br>` +
                `Aap mujhse kisi bhi specific part (jaise Fasal ki health ya Building density) ke baare mein aur detail mein pooch sakte hain!`;
    }

    renderAssistantReply(history, reply);
}

function renderAssistantReply(container, text) {
    setTimeout(() => {
        container.innerHTML += `<div class="msg assistant">${text}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 300);
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});



const FASTAPI_CHAT_URL = "http://localhost:8000/api/v1/chat/";

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const history = document.getElementById('chatHistory');

    if (!input || !history) return;
    const query = input.value.trim();
    if (!query) return;

    // Show User Message
    history.innerHTML += `<div class="msg user">${escapeHtml(query)}</div>`;
    input.value = '';
    history.scrollTop = history.scrollHeight;

    // Check if Image is Uploaded
    if (!window.imageLoaded) {
        setTimeout(() => {
            history.innerHTML += `<div class="msg assistant">⚠️ <b>Arey bhai!</b> Pehle satellite image upload karke <b>'Scan Image Pixels'</b> par click toh karein, taaki main exact data ke sath guide kar sakoon! 😊</div>`;
            history.scrollTop = history.scrollHeight;
        }, 200);
        return;
    }

    // Show Loading Typing Indicator
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="msg assistant" id="${loadingId}"><i>SatQuery AI soch raha hai... 🛰️</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        const response = await fetch(FASTAPI_CHAT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: query, 
                stats: window.pixelStats || { vegetation: 0, buildings: 0, barren: 0, water: 0 }
            })
        });

        const loadingElem = document.getElementById(loadingId);
        if (loadingElem) loadingElem.remove();

        if (response.ok) {
            const data = await response.json();
            history.innerHTML += `<div class="msg assistant">${data.reply}</div>`;
        } else {
            history.innerHTML += `<div class="msg assistant">❌ AI Service connect nahi ho pa rahi. Kripya backend terminal check karein.</div>`;
        }
    } catch (err) {
        const loadingElem = document.getElementById(loadingId);
        if (loadingElem) loadingElem.remove();

        history.innerHTML += `<div class="msg assistant">⚠️ Server offline lag raha hai! Kripya FastAPI server (`uvicorn main:app --reload`) ko start karein.</div>`;
    }

    history.scrollTop = history.scrollHeight;
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});