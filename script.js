const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTCQcJgZ7l9KoCe38RZX6q1lf-ThEvARscXvO_2GCJNVF7hW941mtHg7HZJT3yuO6LEpMmRh8gATrPT/pub?gid=0&single=true&output=csv';

async function loadPortfolio() {
    const graphicsContainer = document.getElementById('project-cards-container');
    const videoContainer = document.getElementById('video-gallery-container');

    try {
        const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&v=${Date.now()}`);
        const csvText = await response.text();
        const data = parseCSV(csvText);

       // --- GRAPHICS PAGE LOGIC ---
            if (graphicsContainer) {
                const graphics = data.filter(item => item.type?.toLowerCase().trim() === 'graphic');
                graphicsContainer.innerHTML = graphics.map((item, index) => `
                    <div class="project-card">
                        <a href="${item.link}" target="_blank" style="text-decoration: none; color: inherit;">
                            <img src="${item.link}" alt="${item.title}" onerror="this.src='icon.png'">  </a>
                            <div class="card-content">
                            
                                <span class="badge" style="background:#2563eb; color:white;">${item.category || 'Graphic'}</span>
                                <h3>${item.title}</h3>
                                <p id="graphic-desc-${index}" class="description">${item.description}</p>
                                <button onclick="toggleDesc('graphic-desc-${index}', this)" class="view-more-btn">View More</button>
                            </div>
                       
                    </div>
                `).join('');
            }

        if (videoContainer) {
            const videos = data.filter(item => item.type?.toLowerCase().trim() === 'video');
            videoContainer.innerHTML = videos.map((item, index) => {
                const ytId = item.link.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^?&]+)/)?.[1];
                // const embedUrl = `https://www.youtube.com/embed/${ytId}`;
                // MODIFIED EMBED URL for a cleaner view
                const embedUrl = `https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0&showinfo=0&controls=1`;

                return `
                    <div class="video-card">
                        <div class="video-container">
                            <iframe src="${embedUrl}" allowfullscreen style="width:100%; aspect-ratio:16/9; border:none;"></iframe>
                        </div>
                        <div class="card-content">
                            <span class="badge" style="background:#2563eb; color:white;">${item.category || 'Video'}</span>
                            <h3 style="margin-top:10px;">${item.title}</h3>
                            <p id="desc-${index}" class="description">${item.description}</p>
                            <button onclick="toggleDesc('desc-${index}', this)" class="view-more-btn">View More</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
        // IMPROVED REGEX: Splits ONLY on commas, not spaces
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        let obj = {};
        headers.forEach((h, i) => {
            let val = values[i] ? values[i].trim() : "";
            obj[h] = val.replace(/^"|"$/g, ''); // Removes quotes
        });
        return obj;
    });
}

function toggleDesc(id, btn) {
    const el = document.getElementById(id);
    
    // Toggle the 'expanded' class on the description paragraph
    el.classList.toggle('expanded');
    
    // Update the button text based on whether the class is present
    if (el.classList.contains('expanded')) {
        btn.innerText = 'View Less';
    } else {
        btn.innerText = 'View More';
    }
}

// Security: Disable right-click and certain shortcuts
document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    if (e.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || 
        (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
};

// Start loading when page is ready
document.addEventListener('DOMContentLoaded', loadPortfolio);