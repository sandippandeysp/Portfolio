// --- CONFIGURATION: REPLACE THIS URL ---
// 1. Go to your Google Sheet (with columns: title, image_link, category)
// 2. Go to File > Share > Publish to web
// 3. Choose 'Comma-separated values (.csv)' format.
// 4. Copy the URL and paste it here.
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTCQcJgZ7l9KoCe38RZX6q1lf-ThEvARscXvO_2GCJNVF7hW941mtHg7HZJT3yuO6LEpMmRh8gATrPT/pub?gid=0&single=true&output=csv'; 
// Example structure: https://docs.google.com/spreadsheets/d/e/2PACX-1vT.../pub?gid=0&single=true&output=csv';

// --- HELPER FUNCTION: CSV TO JSON ---
// This function takes the raw CSV text from the sheet and converts it into a structured array of objects.
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    // Assuming the first line is the header (keys)
    // We expect: title, image_link, category (case-sensitive to your sheet headers)
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const projects = [];

    // Loop through the data lines (starting from index 1)
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length !== headers.length) {
            console.warn(`Skipping malformed row: ${lines[i]}`);
            continue; 
        }

        const project = {};
        for (let j = 0; j < headers.length; j++) {
            // Assign value to the corresponding header key
            project[headers[j]] = values[j].trim();
        }
        projects.push(project);
    }
    return projects;
}


// --- MAIN FUNCTION: FETCH AND RENDER ---
async function loadPortfolioFromSheet() {
    const container = document.getElementById('project-cards-container');
    
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL === 'YOUR_PUBLISHED_CSV_URL_HERE') {
        container.innerHTML = '<p>Error: Please update the GOOGLE_SHEET_CSV_URL in script.js with your public link.</p>';
        return;
    }

    try {
        // Use a cache-busting timestamp to help ensure we get the latest published data
        const timestamp = new Date().getTime(); 
        const uniqueUrl = `${GOOGLE_SHEET_CSV_URL}&v=${timestamp}`; 

        const response = await fetch(uniqueUrl);
        const csvText = await response.text();
        
        // Convert the CSV text into an array of project objects
        const projects = parseCSV(csvText); 

        let cardsHTML = '';

        if (projects.length === 0) {
            container.innerHTML = '<p>No projects found in the Google Sheet.</p>';
            return;
        }

        // Loop through the data and create the HTML cards
        projects.forEach(project => {
            const title = project.title || 'Untitled Project';
            const image = project.image_link || 'placeholder.jpg'; // Use a default image if link is missing
            const category = project.category || 'Uncategorized';
            
            // Generate the HTML card template using the data
            const cardTemplate = `
                <a href="#" class="project-card">
                    <div class="card-image-wrapper">
                        <img src="${image}" alt="${title} project thumbnail"> 
                    </div>
                    <div class="card-content">
                        <h3>${title}</h3>
                        <p class="category-tag">${category}</p>
                    </div>
                </a>
            `;
            cardsHTML += cardTemplate;
        });

        // Insert all the generated HTML into the container
        container.innerHTML = cardsHTML;

    } catch (error) {
        console.error('Error fetching or processing Google Sheet data:', error);
        container.innerHTML = '<p>Error loading portfolio projects. Check console for details.</p>';
    }
}

// --- INITIALIZE ---
// Basic JavaScript for smooth scrolling (optional, moved to the top of the file)
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Check if the link is on the same page (starts with #)
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Start the data loading process when the script runs
loadPortfolioFromSheet();