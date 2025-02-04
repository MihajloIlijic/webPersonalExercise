document.addEventListener('DOMContentLoaded', () => {
    loadItems();
});

async function loadItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

function displayItems(items) {
    const grid = document.getElementById('itemsGrid');
    grid.innerHTML = ''; // Clear existing items

    if (items.length === 0) {
        grid.innerHTML = `
            <div class="no-items">
                <p>No items found. Add some items to see them here!</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        // Fallback image wenn kein Bild vorhandenc
        const imageSrc = item.image || '/images/default-image.jpg';
        
        // Formatiere den Preis mit 2 Dezimalstellen und Tausendertrennzeichen
        const formattedPrice = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(item.cost);

        card.innerHTML = `
            <div class="image-container">
                <img src="${imageSrc}" 
                     alt="${item.name}" 
                     onerror="this.src='/images/default-image.jpg'"
                     loading="lazy">
            </div>
            <div class="content">
                <h3>${item.name}</h3>
                <p>${formattedPrice}</p>
            </div>
        `;

        // Füge Hover-Effekte hinzu
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        grid.appendChild(card);
    });
} 