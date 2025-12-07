
        {/* // Basic JavaScript for smooth scrolling (optional) */}
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }); 


        // cards looping 
    const container = document.getElementById('project-cards-container');

    fetch('projects.txt')
        .then(response => response.text()) // Get the file content as raw text
        .then(data => {
            // Split the raw text into individual project lines
            const projectLines = data.trim().split('\n');
            let cardsHTML = '';

            projectLines.forEach(line => {
                // Split each line by the separator (|||)
                const parts = line.split('|||');
                
                // Extract and clean the values
             // ... inside the projectLines.forEach(line => { ... }) loop
// ... 

projectLines.forEach(line => {
    const parts = line.split('|||');

    // 1. Declare the variables outside the conditional check
    let title = '';
    let image = ''; // <-- Declared here
    let link = '';
    let category = '';

    if (parts.length === 4) {
        // 2. ONLY assign values if the data structure is correct
        title = parts[0].replace('Title: ', '').trim();
        image = parts[1].replace('Image: ', '').trim();
        link = parts[2].replace('Link: ', '').trim();
        category = parts[3].replace('Category: ', '').trim();
    } else {
        // Handle bad data line by skipping or logging the error
        console.error("Skipping malformed project line:", line);
        return; // Skip to the next iteration
    }

    // 3. The card template uses the defined variables
    const cardTemplate = `
        <a href="${link}" class="project-card">
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


if (parts.length === 4) {
    // 4. Extract and clean the values
    const title = parts[0].replace('Title: ', '').trim();
    const image = parts[1].replace('Image: ', '').trim(); // <-- THIS LINE DEFINES 'image'
    const link = parts[2].replace('Link: ', '').trim();
    const category = parts[3].replace('Category: ', '').trim();

    // 5. Generate the HTML card template
    const cardTemplate = `
        <a href="${link}" class="project-card">
            <div class="card-image-wrapper">
                <img src="${Image}" alt="${title} project thumbnail"> 
            </div>
                        <div class="card-content">
                            <h3>${title}</h3>
                        </div>
                    </a> `;
                cardsHTML += cardTemplate;
            });
            container.innerHTML = cardsHTML;
        })
        .catch(error => {
            console.error('Error fetching project data:', error);
            container.innerHTML = '<p>Could not load portfolio projects.</p>';
        }); 

