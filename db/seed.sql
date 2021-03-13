INSERT INTO department (dept_name, utilized_budget)
VALUES ('Management', 1000000),
       ('General', 750000),
       ('IT', 3000000),
       ('Accounting', 300000),
       ('Projects', 50000);
       
INSERT INTO roles (title, salary, department_id)
VALUES ('Manager', 1000000, 1),
       ('Attendent', 75000, 2),
       ('Developer', 100000, 3),
       ('Engineer', 150000, 4),
       ('Accountant', 200000, 6);
	
INSERT INTO employee (first_name, last_name, emp_dept, salary, manager_id, roles_id)
VALUES ('Adam', 'Warlock', 'Manager', 1000000, null, 1),
       ('Wanda', 'Maximoff', 'Attendent', 75000, 1, 2),
       ('Peter', 'Parker', 'Developer', 100000, null, 3),
       ('Steve', 'Rogers', 'Developer', 100000, 3, 3),
       ('Wade', 'Wilson', 'Developer', 100000, 3, 3),
       ('Groot', 'Groot', 'Engineer', 100000, null, 4),
       ('Reed','Richaeds', 'Engineer', 100000, 6, 4),
       ('Ben', 'Grimm', 'Engineer', 100000, 6, 4);
     

INSERT INTO manager (id, mgr_name)
VALUES (1, 'Anthony Stark'),
       (3, 'Nick Fury'),
       (6, 'Bruce Banner');

SELECT * FROM employee;
SELECT * FROM roles;
SELECT * FROM department;
SELECT * FROM manager;       
