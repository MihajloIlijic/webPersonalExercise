// Check which page we're on
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the items page
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        initializeItemsPage();
    }
});

function initializeItemsPage() {
    const itemForm = document.getElementById('itemForm');
    
    itemForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting normally

        // Get input values
        const id = document.getElementById('itemId').value;
        const name = document.getElementById('itemName').value;
        const cost = document.getElementById('itemCost').value;

        // Create new table row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>$${parseFloat(cost).toFixed(2)}</td>
        `;

        // Add row to table
        const table = document.querySelector('table');
        table.appendChild(newRow);

        // Reset form
        e.target.reset();
    });
}

function helloWorld() {
    console.log("Hello World");
}

helloWorld();