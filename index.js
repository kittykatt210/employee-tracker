const inquirer = require('inquirer');
const db = require('./config/connection');

// Function to initialize app
function init() {
    inquirer.prompt({
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
    }).then( answer => {
        switch (answer.menu) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'Quit':
                console.log('Application has ended.');
                break;
        }

    })
};
// Functions to view tables
function viewDepartments() {
    db.query(
        `SELECT * 
        FROM department 
        ORDER BY name;`, function (err, results) 
        {
            console.log(err);
            console.table(results);
            init();
        }
    )
};

function viewRoles() {
    db.query(
        `SELECT role.id, title, department.name as department, salary
        FROM role
            JOIN department
            on role.department_id = department.id;`, function (err, results) 
            {
                console.log(err);
                console.table(results);
                init();
            }
    )
};

function viewEmployees() {
    db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(e2.first_name, ' ', e2.last_name) as manager
        FROM employee
            JOIN role
            on employee.role_id = role.id
            JOIN department
            on role.department_id = department.id
            LEFT JOIN employee as e2
            on employee.manager_id = e2.id;`, function (err, results) {
                console.log(err);
                console.table(results);
                init();
            }
    )
};

// Functions to add data
function addDepartment() {
    
}

// Functions to update data

// Functions to delete data


init();