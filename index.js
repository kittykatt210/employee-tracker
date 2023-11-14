const inquirer = require('inquirer');
const db = require('./config/connection');
require('console.table');

// Array for choices of what the user can do
const selection = ['View All Departments', 
                    'View All Roles', 
                    'View All Employees', 
                    'Add Department', 
                    'Add Role', 
                    'Add Employee', 
                    'Update Employee Role',
                    'Delete Department', 
                    'Delete Role', 
                    'Delete Employee', 
                    'Quit']

// Function to initialize app
function init() {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        choices: selection,
        name: 'choice'
    }).then((answer) => {
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
                updateEmployeeRole();
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
    let sql = 'SELECT * FROM department ORDER BY name;';

    db.query(sql, function (err, result) {
        if (err) throw err;
        console.table('\nDepartments:', result);
        init();
    });
};

function viewRoles() {
    let sql = 'SELECT role.id, title, department.name as department, salary FROM role JOIN department on role.department_id = department.id;'

    db.query(sql, function (err, result) {
        if (err) throw err;
        console.table('\nRoles:', result);
        init();
    });
};

function viewEmployees() {
    let sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(e2.first_name, " ", e2.last_name) as manager FROM employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id LEFT JOIN employee as e2 on employee.manager_id = e2.id;';

    db.query(sql, function (err, result) {
        if (err) throw err;
        console.table('Employees:', result);
        init();
    });
};

// Functions to add data
function addDepartment() {
    inquirer.prompt (
        {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'dept'
        }).then((answer) => {
            let sql = 'INSERT INTO department (name) VALUES (?)';

            db.query(sql, answer.dept, function (err, result) {
                if (err) throw err;
                console.log(`\nAdded ${answer.dept} to the database.\n`)
                init();
            });
        })
};

function addRole() {
    let sql = 'SELECT name FROM department;';

    db.query(sql, function (err, result) {
        if (err) throw err;
        let deptName = [];
        result.forEach((department) => {
            deptName.push(department.name);
        });
        inquirer.prompt ([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'role'
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                choices: deptName,
                name: 'dept'
            }]).then((answer) => {
                let sql = 'SELECT id FROM department where name = ?;'

                db.query(sql, answer.dept, function (err, result) {
                if (err) throw err;
                let deptID = result[0].id;

                let sql2 = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);';

                db.query(sql2, [answer.role, answer.salary, deptID], function (err, result) {
                    if (err) throw err;
                    console.log(`\nAdded ${answer.role} to the database.\n`)
                    init();
                });
            });
        })
    })
};

function addEmployee() {
    let sql = 'SELECT title FROM role;';

    db.query(sql, function (err, result) {
        if (err) throw err;
        let empRole = [];
        result.forEach((role) => {
            empRole.push(role.title);
        });
        
        let sql = 'SELECT CONCAT(first_name, " ", last_name) as manager FROM employee;';

        db.query(sql, function (err, result) {
            if (err) throw err;
            let managerName = [];
            result.forEach((name) => {
                managerName.push(name.manager);
            });
 
            inquirer.prompt ([
                {
                    type: 'input',
                    message: 'What is the employee\'s first name?',
                    name: 'fName'
                },
                {
                    type: 'input',
                    message: 'What is the employee\'s last name?',
                    name: 'lName'
                },
                {
                    type: 'list',
                    message: 'What is the employee\'s role?',
                    choices: empRole,
                    name: 'role'
                },
                {
                    type: 'list',
                    message: 'Who is the employee\'s manager?',
                    choices: managerName,
                    name: 'manager'
                }]).then((answer) => {
                    let sql = 'SELECT id FROM role WHERE title = ?;';

                    db.query(sql, answer.role, function (err, result) {
                        if (err) throw err;
                        let roleID = result[0].id;

                        let managerNm = answer.manager.split(' ');

                        let sql = 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?;';

                        db.query(sql, [managerNm[0], managerNm[1]], function (err, result) {
                            if (err) throw err;
                            managerID = result[0].id;
                            
                            let sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);';
            
                            db.query(sql, [answer.fName, answer.lName, roleID, managerID], function (err, result) {
                                if (err) throw err;
                                console.log(`\nAdded ${answer.fName} ${answer.lName} to the database.\n`);
                                init();
                            });
                        });
                    });
                });
        });
    });
};

// Functions to update data
function updateEmployeeRole() {
    let sql = 'SELECT title FROM role;';

    db.query(sql, function (err, result) {
        if (err) throw err;
        let empRole = [];
        result.forEach((role) => {
            empRole.push(role.title);
        });

    let sql = 'SELECT CONCAT(first_name, " ", last_name) as employee FROM employee;';
    
    db.query(sql, function (err, result) {
        if (err) throw err;
        let empName = [];
        result.forEach((name) => {
            empName.push(name.employee);
        });  
   
        inquirer.prompt ([
            {
                type: 'list',
                message: 'Which employee\'s role do you want to update?',
                choices: empName,
                name: 'empName'
            },
            {
                type: 'list',
                message: 'Which role do you want to assign the selected employee?',
                choices: empRole,
                name: 'empRole'
            }]).then((answer) => {
                let sql = 'SELECT id FROM role WHERE title = ?;';

                db.query(sql, answer.empRole, function (err, result) {
                    if (err) throw err;
                    let roleID = result[0].id;

                    const empNm = answer.empName.split(' ');

                    let sql = 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?;';

                    db.query(sql, [empNm[0], empNm[1]], function (err, result) {
                        if (err) throw err;
                        let empID = result[0].id;

                        let sql = 'UPDATE employee SET role_id = ? WHERE id = ?;';
                        
                        db.query(sql, [roleID, empID], function (err, result) {
                            if (err) throw err;
                            console.log(`\nUpdated employee\'s role.\n`);
                            init();
                        });
                    });
                });
                });
    })
    })
};

// Functions to delete data
function deleteDept() {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What is the name of the department you want to delete?',
            name: 'dept'
        }).then((answer) => {
        let sql = 'DELETE FROM department WHERE name = ?;';

        db.query(sql, answer.dept, function (err, result) {
                if(err) throw err;
                console.log(`\n${answer.dept} has been deleted.\n`)
                init();
            });
        })
};

function deleteRole() {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What is the name of the role you want to delete?',
            name: 'title'
        }).then((answer) => {
            let sql = 'DELETE FROM role WHERE title = ?;';

            db.query(sql, answer.title, function (err, result) {
                    if(err) throw err;
                    console.log(`\n${answer.title} has been deleted.\n`);
                    init();
            });
        })
};

function deleteEmployee() {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What is the id number for the employee you want to delete?',
            name: 'id'
        }).then((answer) => {
            let sql = 'DELETE FROM employee WHERE id = ?;';

            db.query(sql, answer.id, function (err, result) {
                if(err) throw err;
                console.log(`\nEmployee ID ${answer.id} has been deleted.\n`);
                init();
            });
        })
};

// Function call to initialize app
init();