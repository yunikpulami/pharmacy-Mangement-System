document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    loadMedicines();
    loadCustomers();
    loadSales();
    loadStock();
    loadReports();
    
    document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            showSection(section);
        });
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
    
    const modal = document.getElementById('medicineModal');
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('medicineForm').addEventListener('submit', saveMedicine);
});

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
}

async function loadMedicines() {
    try {
        const response = await fetch('php/get_medicines.php');
        const medicines = await response.json();
        
        const tbody = document.querySelector('#medicinesTable tbody');
        tbody.innerHTML = medicines.map(med => `
            <tr>
                <td>${med.id}</td>
                <td>${med.name}</td>
                <td>${med.category}</td>
                <td>$${parseFloat(med.price).toFixed(2)}</td>
                <td>${med.stock}</td>
                <td>
                    <button class="btn-edit" onclick="editMedicine(${med.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteMedicine(${med.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading medicines:', error);
    }
}

function showAddMedicine() {
    document.getElementById('modalTitle').textContent = 'Add Medicine';
    document.getElementById('medicineForm').reset();
    document.getElementById('medicineId').value = '';
    document.getElementById('medicineModal').style.display = 'block';
}

async function editMedicine(id) {
    try {
        const response = await fetch(`php/get_medicine.php?id=${id}`);
        const medicine = await response.json();
        
        document.getElementById('modalTitle').textContent = 'Edit Medicine';
        document.getElementById('medicineId').value = medicine.id;
        document.getElementById('medicineName').value = medicine.name;
        document.getElementById('medicineCategory').value = medicine.category;
        document.getElementById('medicinePrice').value = medicine.price;
        document.getElementById('medicineStock').value = medicine.stock;
        document.getElementById('medicineDescription').value = medicine.description || '';
        document.getElementById('medicineModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading medicine:', error);
    }
}

async function saveMedicine(e) {
    e.preventDefault();
    
    const formData = new FormData();
    const id = document.getElementById('medicineId').value;
    
    if (id) formData.append('id', id);
    formData.append('name', document.getElementById('medicineName').value);
    formData.append('category', document.getElementById('medicineCategory').value);
    formData.append('price', document.getElementById('medicinePrice').value);
    formData.append('stock', document.getElementById('medicineStock').value);
    formData.append('description', document.getElementById('medicineDescription').value);
    
    try {
        const response = await fetch('php/save_medicine.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(id ? 'Medicine updated successfully' : 'Medicine added successfully');
            document.getElementById('medicineModal').style.display = 'none';
            loadMedicines();
            loadStock();
            loadReports();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Operation failed. Please try again.');
    }
}

async function deleteMedicine(id) {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    const formData = new FormData();
    formData.append('id', id);
    
    try {
        const response = await fetch('php/delete_medicine.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Medicine deleted successfully');
            loadMedicines();
            loadStock();
            loadReports();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Delete failed. Please try again.');
    }
}

async function loadCustomers() {
    try {
        const response = await fetch('php/get_customers.php');
        const customers = await response.json();
        
        const tbody = document.querySelector('#customersTable tbody');
        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.fullname}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <button class="btn-delete" onclick="deleteCustomer(${customer.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    const formData = new FormData();
    formData.append('id', id);
    
    try {
        const response = await fetch('php/delete_customer.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Customer deleted successfully');
            loadCustomers();
            loadReports();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Delete failed. Please try again.');
    }
}

async function loadSales() {
    try {
        const response = await fetch('php/get_all_orders.php');
        const sales = await response.json();
        
        const tbody = document.querySelector('#salesTable tbody');
        tbody.innerHTML = sales.map(sale => `
            <tr>
                <td>${sale.id}</td>
                <td>${sale.customer_name}</td>
                <td>${sale.order_date}</td>
                <td>$${parseFloat(sale.total).toFixed(2)}</td>
                <td>${sale.status}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading sales:', error);
    }
}

async function loadStock() {
    try {
        const response = await fetch('php/get_medicines.php');
        const medicines = await response.json();
        
        const tbody = document.querySelector('#stockTable tbody');
        tbody.innerHTML = medicines.map(med => {
            const status = med.stock < 10 ? 'Low Stock' : 'In Stock';
            const statusClass = med.stock < 10 ? 'style="color: red;"' : '';
            return `
                <tr>
                    <td>${med.name}</td>
                    <td>${med.stock}</td>
                    <td ${statusClass}>${status}</td>
                    <td>
                        <button class="btn-edit" onclick="editMedicine(${med.id})">Update</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading stock:', error);
    }
}

async function loadReports() {
    try {
        const response = await fetch('php/get_reports.php');
        const reports = await response.json();
        
        document.getElementById('totalSales').textContent = '$' + parseFloat(reports.total_sales || 0).toFixed(2);
        document.getElementById('totalCustomers').textContent = reports.total_customers || 0;
        document.getElementById('totalMedicines').textContent = reports.total_medicines || 0;
        document.getElementById('lowStock').textContent = reports.low_stock || 0;
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}
