const inquirer = require('inquirer');
const db = require('./config/connection');
require('console.table');

// Function to initialize app
function init() {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Delete Department', 'Delete Role', 'Delete Employee', 'Quit'],
        name: 'choice'
    }).then( answer => {
        switch (answer.choice) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;      
            case 'Delete Department':
                deleteDept();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Quit':
                console.log('Application has ended.');
                db.end();
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
            console.log('\nDepartments:\n')
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
                console.log('\nRoles:\n');
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
            on employee.manager_id = e2.id;`, function (err, results)
            {
                console.log('\nEmployees:\n');
                console.table(results);
                init();
            }
    )
};

// Functions to add data
function addDepartment() {
    inquirer.prompt (
        {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'dept'
        }
    ).then( answer => {
        db.query(
            `INSERT INTO department (name)
            VALUES (?)`, answer.dept, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log(`\nAdded ${answer.dept} to the database.\n`)
                init();
            }
        );
    })
};


// Functions to update data

// Functions to delete data
function deleteDept() {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What is the name of the department you want to delete?',
            name: 'dept'
        }
    ).then( answer => {
        db.query(
            `DELETE FROM department WHERE name = ?`, answer.dept, (err, result) => {
                if(err) {
                    console.log(err)
                }
                console.log(`\n${answer.dept} has been deleted.\n`)
                init();
            }
        );
    })
};

function deleteRole() {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What is the name of the role you want to delete?',
            name: 'title'
        }
    ).then( answer => {
        db.query(
            `DELETE FROM role WHERE title = ?`, answer.title, (err, result) => {
                if(err) {
                    console.log(err)
                }
                console.log(`\n${answer.title} has been deleted.\n`)
                init();
            }
        );
    })
};

function deleteEmployee() {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What is the id number for the employee you want to delete?',
            name: 'id'
        }
    ).then( answer => {
        db.query(
            `DELETE FROM employee WHERE id = ?`, answer.dept, (err, result) => {
                if(err) {
                    console.log(err)
                }
                console.log(`\nEmployee ID ${answer.id} has been deleted.\n`)
                init();
            }
        );
    })
};

init();