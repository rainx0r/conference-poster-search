function filterPosters(posters) {
    console.log(posters);
    const posterElements = [...document.querySelectorAll('.track-schedule-card')];
    posterElements.forEach((x) => {
        if (!posters.includes(parseInt(x.dataset.id))) {
            x.style.display = 'none';
        } else {
            x.style.display = 'block';
        }
    });
}

function clearFilteredPosters() {
    const posterElements = [...document.querySelectorAll('.track-schedule-card')];
    posterElements.forEach((x) => {
        x.style.display = 'block';
    });

}

// Only run on session pages
if (window.location.pathname.startsWith("/virtual/") && window.location.pathname.includes("/session/")) {
    // Only run on *poster session* pages
    const cardHeader = document.querySelector("h2.main-title");
    if (cardHeader && cardHeader.textContent.includes("Poster Session")) {
        const posterElements = [...document.querySelectorAll('.track-schedule-card')];
        const posterBox = posterElements[0].parentElement;

        const newInputContainer = document.createElement('div');
        newInputContainer.className = 'input-group';
        newInputContainer.role = 'search';
        newInputContainer.style.marginBottom = '15px';
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.placeholder = 'Search in natural language';
        newInput.className = 'form-control'; // Optional: add a class to the input
        newInputContainer.appendChild(newInput);

        const newInputButtonContainer = document.createElement('div');
        newInputButtonContainer.className = 'input-group-text btn-primary';
        const newInputButton = document.createElement('button');
        newInputButton.style.border = 'none';
        newInputButton.style.backgroundColor = 'transparent';
        newInputButton.style.padding = '0';
        newInputButton.type = 'submit';
        const newInputButtonIcon = document.createElement('i');
        newInputButtonIcon.className = 'fa-solid fa-magnifying-glass';
        newInputButton.appendChild(newInputButtonIcon);
        newInputButtonContainer.appendChild(newInputButton);

        newInputContainer.appendChild(newInputButtonContainer);

        posterBox.insertBefore(newInputContainer, posterBox.firstChild);
        
        // Get all posters
        let i = 0;
        const posterData = posterElements.map((x) => {
            const paperTitle = x.querySelector("h5").textContent.trim();
            const paperAbstract = x.querySelector(".abstract").textContent.trim();
            const paperId = i;
            x.dataset.id = i;
            i++;
            return {title: paperTitle, abstract: paperAbstract, id: paperId};
        });
        
        // Send them to the backend
        browser.runtime.sendMessage({ posters: posterData });
        
        // Actual filtering
        const handleSubmit = () => {
            const inputValue = newInput.value.trim(); // Get and trim the value
            
            if (!inputValue) {
                clearFilteredPosters();
            }
            
            browser.runtime.sendMessage({ prompt: inputValue }).then((response) => {
                console.log(response);
                filterPosters(response.filter);
            });
        }
        newInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { handleSubmit() }
        });
        newInputButton.addEventListener('click', () => { handleSubmit() });
    }
}

//browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//    console.log("Received request: ", request);
//});
