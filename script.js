// Navigation functions
function navigateToDay(dayNumber) {
    window.location.href = `days/day${dayNumber}.html`;
}

function nextDay() {
    const currentDay = getCurrentDayNumber();
    if (currentDay < 30) {
        navigateToDay(currentDay + 1);
    }
}

function previousDay() {
    const currentDay = getCurrentDayNumber();
    if (currentDay > 1) {
        navigateToDay(currentDay - 1);
    }
}

function getCurrentDayNumber() {
    const path = window.location.pathname;
    const dayMatch = path.match(/day(\d+)\.html/);
    return dayMatch ? parseInt(dayMatch[1]) : 1;
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        nextDay();
    } else if (event.key === 'ArrowLeft') {
        previousDay();
    }
});

// Progress tracking
function updateProgress() {
    const completedDays = JSON.parse(localStorage.getItem('completedDays') || '[]');
    
    // Update UI to show completed days
    completedDays.forEach(day => {
        const dayElement = document.querySelector(`[onclick="navigateToDay(${day})"]`);
        if (dayElement) {
            dayElement.style.background = 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
            dayElement.style.borderLeftColor = '#28a745';
        }
    });
    
    // Update progress statistics
    updateProgressStats(completedDays.length);
}

function updateProgressStats(completedCount) {
    const progressElement = document.getElementById('progress-stats');
    if (progressElement) {
        const percentage = Math.round((completedCount / 30) * 100);
        progressElement.innerHTML = `
            <div class="progress-card">
                <h3>Training Progress</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <p>${completedCount}/30 Days Completed (${percentage}%)</p>
            </div>
        `;
    }
}

// Mark day as completed
function markDayCompleted(dayNumber) {
    const completedDays = JSON.parse(localStorage.getItem('completedDays') || '[]');
    
    if (!completedDays.includes(dayNumber)) {
        completedDays.push(dayNumber);
        localStorage.setItem('completedDays', JSON.stringify(completedDays));
    }
    
    updateProgress();
}

// Search functionality
function searchDays() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const dayCards = document.querySelectorAll('.day-card');
    let foundAny = false;
    
    dayCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
            foundAny = true;
            // Highlight matching text
            card.style.background = 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)';
            card.style.borderLeftColor = '#ffc107';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results found
    const searchMessage = document.getElementById('searchMessage') || createSearchMessage();
    if (!foundAny && searchTerm) {
        searchMessage.textContent = `No days found matching "${searchTerm}"`;
        searchMessage.style.display = 'block';
    } else {
        searchMessage.style.display = 'none';
    }
}

function createSearchMessage() {
    const message = document.createElement('div');
    message.id = 'searchMessage';
    message.style.cssText = `
        text-align: center;
        padding: 1rem;
        background: #f8d7da;
        color: #721c24;
        border-radius: 8px;
        margin: 1rem 0
