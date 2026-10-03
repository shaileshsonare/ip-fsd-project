// Define API Base URL. 
// Use 3000 for Node.js API or 8080 for Spring Boot API
const API_URL = 'http://localhost:3000/api/employees'; 

// 1. Load Employees on page load
document.addEventListener('DOMContentLoaded', fetchEmployees);

// 2. Handle Form Submission (Create / Update)
document.getElementById('employeeForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload
    
    const id = document.getElementById('empId').value;
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const salary = document.getElementById('salary').value;
    
    const employeeData = { name, department, salary };

    try {
        if (id) {
            // UPDATE (PUT)
            await axios.put(`${API_URL}/${id}`, employeeData);
        } else {
            // CREATE (POST)
            await axios.post(API_URL, employeeData);
        }
        
        // Reset form and reload table
        document.getElementById('employeeForm').reset();
        document.getElementById('empId').value = '';
        fetchEmployees();
    } catch (error) {
        console.error("Error saving employee:", error);
        alert("Operation failed! Check console.");
    }
});

// 3. Fetch All Employees (READ)
async function fetchEmployees() {
    try {
        const response = await axios.get(API_URL);
        const tbody = document.querySelector('#employeeTable tbody');
        tbody.innerHTML = ''; // Clear table body
        
        response.data.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td>${emp.salary}</td>
                <td>
                    <button onclick="editEmployee(${emp.id}, '${emp.name}', '${emp.department}', ${emp.salary})">Edit</button>
                    <button class="delete-btn" onclick="deleteEmployee(${emp.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

// 4. Populate Form for Editing
function editEmployee(id, name, department, salary) {
    document.getElementById('empId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('department').value = department;
    document.getElementById('salary').value = salary;
}

// 5. Delete Employee (DELETE)
async function deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchEmployees(); // Reload table
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    }
}