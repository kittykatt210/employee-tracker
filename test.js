const inquirer = require('inquirer');
const db = require('./config/connection');
require('console.table');

function addRole() {
    db.query(`SELECT name FROM department`, function (err, results) {
        if (err) throw err;
        let deptName = [];
        results.forEach((department) => {
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
            }
        ]).then( answer => {
            db.query(`SELECT id FROM department WHERE name = ?`, answer.dept, function (err, results) {
                if (err) throw err;
                let deptID = results[0].id;
                console.log(deptID);
            db.query(
                `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`, [answer.role, answer.salary, deptID], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                }
            )
            });
        })
    })
};

addRole();