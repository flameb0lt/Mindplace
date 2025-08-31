const journalInput = document.getElementById("journal-entry");
const saveJournal = document.getElementById("save-journal");
const clearJournal = document.getElementById("clear-journal");
const newJournal = document.getElementById("new");
const statusText = document.getElementById("journal-status");
const entriesContainer = document.getElementById("entries-container");

window.addEventListener('load', () => {
    const saved = localStorage.getItem('journal-entry');
    if (saved) {
        journalInput.value = saved;
    }
    loadPreviousEntries();
});

let saveTimeout;
journalInput.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('journal-entry', journalInput.value);
    }, 1000);
});

saveJournal.addEventListener('click', () => {
    const entryText = journalInput.value.trim();
    
    if (!entryText) {
        statusText.innerText = 'Please write something before saving.';
        statusText.style.color = 'red';
        setTimeout(() => statusText.innerText = '', 3000);
        return;
    }
    
    // Check for duplicates
    const existingEntries = getAllSavedEntries();
    const isDuplicate = existingEntries.some(entry => 
        entry.text === entryText && 
        (Date.now() - new Date(entry.created).getTime()) < 60000
    );
    
    if (isDuplicate) {
        statusText.innerText = 'This entry was already saved recently.';
        statusText.style.color = 'orange';
        setTimeout(() => statusText.innerText = '', 3000);
        return;
    }
    
    const saveSuccess = createAndSaveEntry(entryText);
    
    if (saveSuccess) {
        localStorage.setItem('journal-entry', entryText);
        const wordCount = entryText.split(/\s+/).length;
        statusText.innerHTML = `✓ Entry saved! (${wordCount} words)`;
        statusText.style.color = 'green';
    } else {
        statusText.innerText = 'Failed to save entry. Please try again.';
        statusText.style.color = 'red';
    }
    
    setTimeout(() => statusText.innerText = '', 4000);
});

// Clear journal functionality
clearJournal.addEventListener('click', () => {
    journalInput.value = '';
    localStorage.removeItem('journal-entry');
    statusText.innerText = 'Entry cleared';
    statusText.style.color = 'red';
    setTimeout(() => statusText.innerText = '', 3000);
});

newJournal.addEventListener('click', () => {
    const currentEntry = journalInput.value.trim();
    
    if (currentEntry) {
        const saveBeforeNew = confirm('You have unsaved content. Would you like to save it before starting a new entry?');
        if (saveBeforeNew) {
            createAndSaveEntry(currentEntry);
            statusText.innerText = 'Previous entry saved, started new entry';
            statusText.style.color = 'green';
        } else {
            statusText.innerText = 'Started new entry (previous content discarded)';
            statusText.style.color = 'orange';
        }
    } else {
        statusText.innerText = 'Started new entry';
        statusText.style.color = 'blue';
    }
    
    journalInput.value = '';
    localStorage.removeItem('journal-entry');
    journalInput.focus();
    
    setTimeout(() => statusText.innerText = '', 3000);
});

function createAndSaveEntry(entryText) {
    if (!entryText || entryText.trim() === '') {
        return false;
    }
    
    const entries = getAllSavedEntries();
    const now = new Date();
    
    const newEntry = {
        id: now.getTime(),
        text: entryText.trim(),
        date: now.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        time: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        }),
        wordCount: entryText.trim().split(/\s+/).length,
        created: now.toISOString()
    };
    
    entries.unshift(newEntry);
    
    if (entries.length > 25) {
        entries.splice(25);
    }
    
    try {
        localStorage.setItem('journal-entries', JSON.stringify(entries));
        loadPreviousEntries();
        return true;
    } catch (error) {
        console.error('Failed to save entry:', error);
        statusText.innerText = 'Error saving entry - storage might be full';
        statusText.style.color = 'red';
        return false;
    }
}

function getAllSavedEntries() {
    try {
        const entriesData = localStorage.getItem('journal-entries');
        if (!entriesData) {
            return [];
        }
        const entries = JSON.parse(entriesData);
        
        if (Array.isArray(entries)) {
            return entries.filter(entry => 
                entry && 
                entry.id && 
                entry.text && 
                entry.text.trim() !== ''
            );
        }
        
        return [];
    } catch (error) {
        console.error('Error loading entries:', error);
        return [];
    }
}

function loadPreviousEntries() {
    const entries = getAllSavedEntries();
    entriesContainer.innerHTML = '';
    
    if (entries.length === 0) {
        entriesContainer.innerHTML = '<p style="color: #666; font-style: italic;">No previous entries yet. Start writing!</p>';
        return;
    }
    
    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.style.cssText = `
            background: #f8f9fa;
            border-left: 4px solid #4275e3;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            position: relative;
        `;
        
        entryDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <small style="color: #666; font-weight: bold;">${entry.date} at ${entry.time}</small>
                <button onclick="deleteEntry(${entry.id})" style="background: #ff4757; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Delete</button>
            </div>
            <p style="margin: 0; line-height: 1.5; color: #333;">${entry.text.length > 200 ? entry.text.substring(0, 200) + '...' : entry.text}</p>
            ${entry.text.length > 200 ? `<button onclick="toggleExpand(this, ${entry.id})" style="background: none; border: none; color: #4275e3; cursor: pointer; padding: 0; margin-top: 0.5rem;">Read more</button>` : ''}
        `;
        
        entriesContainer.appendChild(entryDiv);
    });
}

// Global functions for entry management
window.deleteEntry = function(entryId) {
    if (confirm('Are you sure you want to delete this entry?')) {
        let entries = getAllSavedEntries();
        entries = entries.filter(entry => entry.id !== entryId);
        localStorage.setItem('journal-entries', JSON.stringify(entries));
        loadPreviousEntries();
    }
};

window.toggleExpand = function(button, entryId) {
    const entries = getAllSavedEntries();
    const entry = entries.find(e => e.id === entryId);
    const textP = button.previousElementSibling;
    
    if (button.textContent === 'Read more') {
        textP.textContent = entry.text;
        button.textContent = 'Read less';
    } else {
        textP.textContent = entry.text.substring(0, 200) + '...';
        button.textContent = 'Read more';
    }
};

