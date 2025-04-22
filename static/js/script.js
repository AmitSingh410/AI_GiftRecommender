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

// Form handling
const giftForm = document.getElementById('gift-form');
const loadingElement = document.getElementById('loading');
const resultsContainer = document.getElementById('results-container');
const giftSuggestions = document.getElementById('gift-suggestions');
const recipientName = document.getElementById('recipient-name');
const errorMessage = document.getElementById('error-message');
const submitBtn = document.getElementById('submit-btn');
const recipientInfo = document.getElementById('recipient-info');
const infoName = document.getElementById('info-name');
const infoAge = document.getElementById('info-age');
const infoGender = document.getElementById('info-gender');
const infoInterests = document.getElementById('info-interests');
const infoOccasion = document.getElementById('info-occasion');
const infoBudget = document.getElementById('info-budget');

// Hide loading initially
loadingElement.classList.add('hidden');

giftForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    loadingElement.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    recipientInfo.classList.add('hidden');
    submitBtn.disabled = true;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        interests: document.getElementById('interests').value,
        occasion: document.getElementById('occasion').value,
        budget: document.getElementById('budget').value
    };
    
    // Update recipient info
    updateRecipientInfo(formData);
    recipientInfo.classList.remove('hidden');
    
    try {
        const response = await fetch('/get_gift_suggestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayGiftSuggestions(data.suggestions, formData.name);
            resultsContainer.classList.remove('hidden');
        } else {
            throw new Error(data.error || 'Failed to generate gift suggestions');
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.classList.remove('hidden');
    } finally {
        loadingElement.classList.add('hidden');
        submitBtn.disabled = false;
    }
});

function updateRecipientInfo(data) {
    infoName.textContent = data.name;
    infoAge.textContent = data.age;
    infoGender.textContent = data.gender;
    infoInterests.textContent = data.interests;
    infoOccasion.textContent = data.occasion;
    infoBudget.textContent = data.budget;
    recipientName.textContent = data.name;
}

function getPriceRange(budget) {
    switch(budget) {
        case 'under $25':
            return { min: 10, max: 25 };
        case '$25-$50':
            return { min: 25, max: 50 };
        case '$50-$100':
            return { min: 50, max: 100 };
        case '$100-$200':
            return { min: 100, max: 200 };
        case '$200+':
            return { min: 200, max: 500 };
        default:
            return { min: 25, max: 100 };
    }
}

function generateRandomPrice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function displayGiftSuggestions(suggestions, recipientName) {
    giftSuggestions.innerHTML = '';
    const budget = document.getElementById('budget').value;
    const priceRange = getPriceRange(budget);
    
    suggestions.forEach(suggestion => {
        const card = document.createElement('div');
        card.className = 'gift-card';
        
        // Generate a random price within the budget range
        const price = generateRandomPrice(priceRange.min, priceRange.max);
        const formattedPrice = formatPrice(price);
        
        card.innerHTML = `
            <h3>${suggestion.name || 'Gift Suggestion'}</h3>
            <p>${suggestion.description || 'No description available'}</p>
            <div class="price">${formattedPrice}</div>
            <div class="where-to-buy">${suggestion.where_to_buy || 'Available at various retailers'}</div>
            <div class="reason">${suggestion.reason || 'This gift matches their interests and preferences'}</div>
        `;
        
        giftSuggestions.appendChild(card);
    });
}

// Helper function to format raw AI response text
function formatRawResponse(text) {
    if (!text) return 'No response received';
    
    // Replace newlines with HTML breaks for better formatting
    return text.replace(/\n/g, '<br>');
}

// Popular Gifts Data
const popularGifts = [
    {
        name: "Smart Watch",
        category: "tech",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        price: "$199.99"
    },
    {
        name: "Leather Wallet",
        category: "fashion",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        price: "$49.99"
    },
    {
        name: "Coffee Maker",
        category: "home",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        price: "$79.99"
    },
    {
        name: "Yoga Mat",
        category: "sports",
        image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        price: "$29.99"
    }
];

// Initialize Popular Gifts
function initializePopularGifts() {
    const popularGiftsContainer = document.getElementById('popular-gifts');
    popularGifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = 'popular-gift-card';
        card.innerHTML = `
            <img src="${gift.image}" alt="${gift.name}">
            <h3>${gift.name}</h3>
            <div class="price">${gift.price}</div>
        `;
        popularGiftsContainer.appendChild(card);
    });
}

// Category Filter Handling
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.dataset.category;
        filterGiftSuggestions(category);
    });
});

function filterGiftSuggestions(category) {
    const cards = document.querySelectorAll('.gift-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Share Functionality
const shareBtn = document.getElementById('share-btn');
const shareModal = document.getElementById('share-modal');
const closeModal = document.querySelector('.close-modal');
const shareOptions = document.querySelectorAll('.share-option');

shareBtn.addEventListener('click', () => {
    shareModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    shareModal.classList.add('hidden');
});

shareOptions.forEach(option => {
    option.addEventListener('click', () => {
        const platform = option.dataset.platform;
        shareGiftIdeas(platform);
    });
});

function shareGiftIdeas(platform) {
    const recipientName = document.getElementById('recipient-name').textContent;
    const giftCards = document.querySelectorAll('.gift-card');
    let shareText = `Gift ideas for ${recipientName}:\n\n`;
    
    giftCards.forEach((card, index) => {
        const name = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;
        shareText += `${index + 1}. ${name} - ${price}\n`;
    });
    
    const shareUrl = window.location.href;
    
    switch(platform) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
            break;
        case 'email':
            window.open(`mailto:?subject=Gift Ideas for ${recipientName}&body=${encodeURIComponent(shareText)}`);
            break;
        case 'copy':
            navigator.clipboard.writeText(shareText + '\n\n' + shareUrl)
                .then(() => alert('Gift ideas copied to clipboard!'))
                .catch(err => console.error('Failed to copy:', err));
            break;
    }
    
    shareModal.classList.add('hidden');
}

// Save functionality
const saveBtn = document.getElementById('save-btn');
const savedSuggestions = JSON.parse(localStorage.getItem('savedSuggestions') || '[]');

saveBtn.addEventListener('click', () => {
    const recipientInfo = {
        name: document.getElementById('info-name').textContent,
        age: document.getElementById('info-age').textContent,
        gender: document.getElementById('info-gender').textContent,
        interests: document.getElementById('info-interests').textContent,
        occasion: document.getElementById('info-occasion').textContent,
        budget: document.getElementById('info-budget').textContent,
        date: new Date().toLocaleDateString(),
        suggestions: Array.from(document.querySelectorAll('.gift-card')).map(card => ({
            name: card.querySelector('h3').textContent,
            description: card.querySelector('p').textContent,
            price: card.querySelector('.price').textContent,
            whereToBuy: card.querySelector('.where-to-buy').textContent,
            reason: card.querySelector('.reason').textContent
        }))
    };

    // Check if this recipient's suggestions are already saved
    const existingIndex = savedSuggestions.findIndex(
        saved => saved.name === recipientInfo.name && 
                 saved.occasion === recipientInfo.occasion
    );

    if (existingIndex !== -1) {
        // Update existing saved suggestions
        savedSuggestions[existingIndex] = recipientInfo;
    } else {
        // Add new saved suggestions
        savedSuggestions.push(recipientInfo);
    }

    // Save to localStorage
    localStorage.setItem('savedSuggestions', JSON.stringify(savedSuggestions));

    // Update save button state
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
    saveBtn.style.backgroundColor = '#059669';
    saveBtn.style.color = 'white';
    saveBtn.style.borderColor = '#059669';

    // Reset button after 2 seconds
    setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
        saveBtn.style.backgroundColor = '';
        saveBtn.style.color = '';
        saveBtn.style.borderColor = '';
    }, 2000);
});

// Check for saved data to load
document.addEventListener('DOMContentLoaded', () => {
    const savedData = sessionStorage.getItem('loadSavedData');
    if (savedData) {
        const data = JSON.parse(savedData);
        // Fill the form with saved data
        document.getElementById('name').value = data.name;
        document.getElementById('age').value = data.age;
        document.getElementById('gender').value = data.gender;
        document.getElementById('interests').value = data.interests;
        document.getElementById('occasion').value = data.occasion;
        document.getElementById('budget').value = data.budget;
        
        // Clear the saved data from sessionStorage
        sessionStorage.removeItem('loadSavedData');
        
        // Submit the form
        document.getElementById('gift-form').dispatchEvent(new Event('submit'));
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializePopularGifts();
});