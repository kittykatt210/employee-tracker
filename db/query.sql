-- View all employees
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(e2.first_name, ' ', e2.last_name) as manager
FROM employee
    JOIN role
    on employee.role_id = role.id
    JOIN department
    on role.department_id = department.id
    LEFT JOIN employee as e2
    on employee.manager_id = e2.id;

-- View all roles
SELECT role.id, title, department.name as department, salary
FROM role
    JOIN department
    on role.department_id = department.id;

-- View all departments
SELECT *
FROM department
ORDER BY name;

