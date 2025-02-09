document.addEventListener('DOMContentLoaded', function() {
    
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        initializeItemsPage();
    }
});

function initializeItemsPage() {
    const itemForm = document.getElementById('itemForm');
    
   
    updateTable();
    
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
       
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'none';

        const formData = new FormData();
        formData.append('name', document.getElementById('itemName').value);
        formData.append('cost', document.getElementById('itemCost').value);
        
        const imageFile = document.getElementById('itemImage').files[0];
        if (imageFile) {
            const resizedImage = await resizeImage(imageFile, 800);
            formData.append('image', resizedImage, imageFile.name);
        }

        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                e.target.reset();
                updateTable();
            } else {
                
                errorMessage.textContent = 'fehler beim hinzufügen des items';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error adding item:', error);
            errorMessage.textContent = 'fehler beim hinzufügen des items';
            errorMessage.style.display = 'block';
        }
    });
}


async function resizeImage(file, maxWidth) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                
                const maxSize = 250; 
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 1); 
            };
        };
        reader.readAsDataURL(file);
    });
}

async function updateTable() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        
        const table = document.querySelector('table');
        const headerRow = table.rows[0];
        table.innerHTML = '';
        table.appendChild(headerRow);
        
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>$${parseFloat(item.cost).toFixed(2)}</td>
                <td>
                    <button class="delete-btn" data-id="${item.id}">
                        Delete
                    </button>
                </td>
            `;
            table.appendChild(row);
        });

        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                showDeleteConfirmation(id);
            });
        });
    } catch (error) {
        console.error('Error updating table:', error);
    }
}


function showDeleteConfirmation(itemId) {
    const modal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('confirmDelete');
    const cancelBtn = document.getElementById('cancelDelete');

    modal.style.display = 'block';

   
    cancelBtn.onclick = function() {
        modal.style.display = 'none';
    };

    
    confirmBtn.onclick = async function() {
        try {
            const response = await fetch(`/api/items/${itemId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                modal.style.display = 'none';
                updateTable();
            } else {
                console.error('Error deleting item');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
