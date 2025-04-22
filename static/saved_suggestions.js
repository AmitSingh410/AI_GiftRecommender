// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// Display saved suggestions
function displaySavedSuggestions() {
    const savedSuggestions = JSON.parse(localStorage.getItem('savedSuggestions') || '[]');
    const savedGrid = document.getElementById('saved-suggestions-grid');
    const noSuggestions = document.getElementById('no-suggestions');
    
    if (savedSuggestions.length === 0) {
        savedGrid.innerHTML = '';
        noSuggestions.classList.remove('hidden');
        return;
    }
    
    noSuggestions.classList.add('hidden');
    savedGrid.innerHTML = '';
    
    savedSuggestions.forEach((saved, index) => {
        const card = document.createElement('div');
        card.className = 'saved-suggestion-card';
        card.innerHTML = `
            <div class="saved-header">
                <h3>${saved.name}</h3>
                <span class="saved-date">${saved.date}</span>
            </div>
            <div class="saved-details">
                <p><strong>Occasion:</strong> ${saved.occasion}</p>
                <p><strong>Budget:</strong> ${saved.budget}</p>
                <p><strong>Interests:</strong> ${saved.interests}</p>
            </div>
            <div class="saved-suggestions-list">
                ${saved.suggestions.map(suggestion => `
                    <div class="saved-suggestion-item">
                        <h4>${suggestion.name}</h4>
                        <p class="price">${suggestion.price}</p>
                    </div>
                `).join('')}
            </div>
            <div class="saved-actions">
                <button class="load-saved-btn" data-saved='${JSON.stringify(saved)}'>
                    <i class="fas fa-redo"></i> Load Suggestions
                </button>
                <button class="delete-saved-btn" data-index="${index}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        savedGrid.appendChild(card);
    });
    
    // Add event listeners to load buttons
    document.querySelectorAll('.load-saved-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const saved = JSON.parse(btn.dataset.saved);
            // Store the data in sessionStorage
            sessionStorage.setItem('loadSavedData', JSON.stringify(saved));
            // Redirect to the main page
            window.location.href = '/';
        });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-saved-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            const savedSuggestions = JSON.parse(localStorage.getItem('savedSuggestions') || '[]');
            savedSuggestions.splice(index, 1);
            localStorage.setItem('savedSuggestions', JSON.stringify(savedSuggestions));
            displaySavedSuggestions(); // Refresh the display
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displaySavedSuggestions();
}); 