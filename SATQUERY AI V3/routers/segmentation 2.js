// ==========================================
// SatQuery AI - Segmentation & Validation JS
// ==========================================

window.imageLoaded = false;
window.pixelStats = { vegetation: 0, buildings: 0, barren: 0, water: 0 };
let myChart = null;

// Backend API Base URL (Localhost vs Render Auto-Detect)
const BACKEND_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : "https://satquery-backend.onrender.com"; // Deploy ke baad apna Render URL yahan daalein

// ------------------------------------------
// 1. Image Preview & Upload Listener
// ------------------------------------------
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageSrc = event.target.result;
        
        // Main Display
        const img = document.getElementById('satelliteImage');
        if (img) {
            img.src = imageSrc;
            img.style.display = 'block';
        }
        
        const placeholder = document.getElementById('placeholderText');
        if (placeholder) placeholder.style.display = 'none';

        // Comparison Slider
        const beforeImg = document.getElementById('beforeImg');
        const afterImg = document.getElementById('afterImg');
        if (beforeImg) beforeImg.src = imageSrc;
        if (afterImg) afterImg.src = imageSrc;

        const fileLabel = document.getElementById('fileLabel');
        if (fileLabel) fileLabel.innerText = "📁 " + file.name;
    };
    reader.readAsDataURL(file);
});

// ------------------------------------------
// 2. Form Submit & Scan Trigger
// ------------------------------------------
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('imageInput');
    const img = document.getElementById('satelliteImage');
    const statusBadge = document.getElementById('statusBadge');
    
    if (!fileInput.files || !fileInput.files[0] || !img.src) {
        alert("Pehle koi satellite image upload karein!");
        return;
    }

    if (statusBadge) {
        statusBadge.innerText = "Validating Image... ⏳";
        statusBadge.style.color = "#f59e0b";
    }

    // Step A: Backend Validation Check (Screenshots & Non-Maps Block Karein)
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/validate-image`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const validation = await response.json();

            if (validation.is_valid_map === false) {
                alert("❌ REJECTED!\n\nSystem ne detect kiya hai ki yeh Satellite / Map view nahi hai (Desktop Screenshot, Terminal, ya Normal Photo detect hui hai).\n\nKripya sahi Satellite Earth Observation Image upload karein.");
                
                if (statusBadge) {
                    statusBadge.innerText = "Invalid Image Rejected ❌";
                    statusBadge.style.color = "#ef4444";
                }
                resetUIStats();
                return;
            }
        }
    } catch (err) {
        console.warn("Backend validation offline. Client-side fallback activated.", err);
    }

    // Step B: Pixel Scan Execution (For Valid Satellite Maps)
    processImagePixels(img);
});

// ------------------------------------------
// 3. Pixel Matrix Processing Function
// ------------------------------------------
function processImagePixels(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth || 400;
    canvas.height = img.naturalHeight || 400;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let vegCount = 0;
    let waterCount = 0;
    let buildingCount = 0;
    let barrenCount = 0;
    let unclassified = 0;

    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Strict Natural Satellite Spectrum
        if (g > r * 1.18 && g > b * 1.18 && g > 35) {
            vegCount++; // Vegetation
        } else if (b > r * 1.15 && b > g && b < 180) {
            waterCount++; // Water
        } else if (Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && r > 60 && r < 210) {
            buildingCount++; // Built-up Area
        } else if (r > g * 1.1 && g > b * 1.05 && r > 70 && r < 220) {
            barrenCount++; // Soil / Sand
        } else {
            unclassified++;
        }
    }

    const validPixels = totalPixels - unclassified;
    
    // Fallback if image fails terrain threshold
    if (validPixels < totalPixels * 0.2) {
        alert("❌ Invalid Terrain Data! Map clear nahi hai ya resolution sahi nahi hai.");
        resetUIStats();
        return;
    }

    window.pixelStats = {
        vegetation: Math.round((vegCount / validPixels) * 100) || 0,
        buildings: Math.round((buildingCount / validPixels) * 100) || 0,
        barren: Math.round((barrenCount / validPixels) * 100) || 0,
        water: Math.round((waterCount / validPixels) * 100) || 0
    };

    window.imageLoaded = true;
    updateUIStats(window.pixelStats);

    const statusBadge = document.getElementById('statusBadge');
    if (statusBadge) {
        statusBadge.innerText = "Analysis Complete ✅";
        statusBadge.style.color = "#10b981";
    }
}

// ------------------------------------------
// 4. Reset & UI Update Helpers
// ------------------------------------------
function resetUIStats() {
    window.imageLoaded = false;
    window.pixelStats = { vegetation: 0, buildings: 0, barren: 0, water: 0 };
    
    document.getElementById('pctVeg').innerText = "0%";
    document.getElementById('pctBuilding').innerText = "0%";
    document.getElementById('pctBarren').innerText = "0%";
    document.getElementById('pctWater').innerText = "0%";

    document.getElementById('barVeg').style.width = "0%";
    document.getElementById('barBuilding').style.width = "0%";
    document.getElementById('barBarren').style.width = "0%";
    document.getElementById('barWater').style.width = "0%";

    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
}

function updateUIStats(stats) {
    document.getElementById('pctVeg').innerText = stats.vegetation + "%";
    document.getElementById('pctBuilding').innerText = stats.buildings + "%";
    document.getElementById('pctBarren').innerText = stats.barren + "%";
    document.getElementById('pctWater').innerText = stats.water + "%";

    document.getElementById('barVeg').style.width = stats.vegetation + "%";
    document.getElementById('barBuilding').style.width = stats.buildings + "%";
    document.getElementById('barBarren').style.width = stats.barren + "%";
    document.getElementById('barWater').style.width = stats.water + "%";

    renderChart(stats);
}

function renderChart(stats) {
    const chartCanvas = document.getElementById('pieChart');
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Vegetation', 'Buildings', 'Barren Soil', 'Water'],
            datasets: [{
                data: [stats.vegetation, stats.buildings, stats.barren, stats.water],
                backgroundColor: ['#10b981', '#f59e0b', '#d97706', '#06b6d4'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

function highlightLayer(type) {
    console.log("Filter Selected:", type);
}

function moveComparisonSlider(val) {
    const overlayWrapper = document.getElementById('overlayWrapper');
    const sliderLine = document.getElementById('sliderLine');
    if (overlayWrapper && sliderLine) {
        overlayWrapper.style.width = val + "%";
        sliderLine.style.left = val + "%";
    }
}