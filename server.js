const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

let connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",
  database: "employees_db"
});

connection.connect(function(err) {
  if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  runSearch();
});

function runSearch() {
  inquirer
  .prompt({
    name: "next",
    type: "list",
    message: "What would you like to do?",
    choices: ["View all Departments.", "View all Employees.", "View all Employees by Department.", "View all Employees by Manager.", "Add Employee.", "Remove Employee.", "Update Employee Role.", "Update Employee Manager.", "End Session."]
  })
  .then(function(answer) {
      switch (answer.next) {
        case "View all Departments.":
          viewDepartments();
          break;

        case "View all Employees.":
          viewEmployees();
          break;

        case "View all Employees by Department.":
          viewEmpsByDept();
          break;

        case "View all Employees by Manager.":
          viewEmpsByMgr();
          break;

        case "Add Employee.":
          addEmployee();
          break;

        case "Remove Employee.":
          removeEmployee();
          break;

        case "Update Employee Role.":
          updateEmpRole();
          break;  
        
        case "Update Employee Manager.":
          updateEmpMgr();
          break;

        case "End Session.":
          endSession();
          break;
      }     
    });
  }

  function viewDepartments() {
    connection.query("Select id, dept_name, utilized_budget FROM department", function (err, res) {
      if (err) throw err;
      console.table('Departments', res);
      runSearch()
      })
    }

  function viewEmployees() {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, department.dept_name, employee.salary, roles.title, mgr_name ";
    query += "FROM employee "; 
    query += "INNER JOIN department ON employee.emp_dept = department.dept_name "; 
    query += "INNER JOIN roles ON department.id = roles.department_id ";
    query += "LEFT JOIN manager ON employee.manager_id = manager.id ";
    
    connection.query(query, function (err, res) {
        console.table('All Employees', res);
        runSearch()
      })
    }
  
  function viewEmpsByDept() {
    let query = "SELECT department.dept_name, employee.id, employee.first_name, employee.last_name ";
    query += "FROM department ";
    query += "INNER JOIN employee ON employee.emp_dept = department.dept_name ";
    query += "ORDER BY department.dept_name";
    
    connection.query(query, function (err, res) {
      console.table('Employees By Manager', res);
      runSearch()
      })
  } 

  function viewEmpsByMgr() {
    console.log("view emps by Mgr.");
    let query = "SELECT manager.id, manager.mgr_name, employee.first_name, employee.last_name ";
    query += "FROM manager ";
    query += "INNER JOIN employee ON manager.id = employee.manager_id ";
    query += "ORDER BY manager.mgr_name";
    connection.query(query, function (err, res) {
      console.table('Employees By Manager', res);
      runSearch()
      })
  }
  
  function addEmployee() {
    inquirer
    .prompt([      
      {
        name: "newEmpFirstName",
        type: "input",
        message: "What is the new employee's first name?"
      },
      {
        name: "newEmpLastName",
        type: "input",
        message: "What is the new employee's last name?"
      },
      {
        name: "newEmpDept",
        type: "list",
        message: "What is the new employee's department?",
        choices: ['Management', 'General', 'IT', 'Accounting',]
      },
      {
        name: "newEmpSalary",
        type: "input",
        message: "What is the new employee's salary?"
      },
      {
        name: "newEmpManager",
        type: "list",
        message: "Who will manage this new employee?",
        choices: ["Anthony Stark", "Nick Fury", "Bruce Banner", "No Manager"],
      },
      {
        name: "newEmpRole",
        type: "list",
        message: "What will the new employee's role be? (Required)",
        choices: ['Supervisor', 'Attendent', 'Developer', 'Engineer', 'Accountant']
      }
    ])

    .then(function(answer) {
      var newEmpsMgr = " "

      if (answer.newEmpManager === "Anthony Stark") {
        newEmpsMgr = 1;
      }
   
      if (answer.newEmpManager === "Nick Fury") {
        newEmpsMgr = 3;
      }
      
      if (answer.newEmpManager === "Bruce Banner") {
        newEmpsMgr = 6;
      }
      
      if (answer.newEmpManager === "No Manager") {
        newEmpsMgr = null;
      }
      
      var newEmpsRole = " ";
      
      if (answer.newEmpRole === 'Supervisor') {
        newEmpsRole = 2
      }
      if (answer.newEmpRole === 'Attendent') {
        newEmpsRole = 3
      }
      if (answer.newEmpRole === 'Developer') {
        newEmpsRole = 4
      }
      if (answer.newEmpRole === 'Engineer') {
        newEmpsRole = 5
      }
      if (answer.newEmpRole === 'Accountant') {
        newEmpsRole = 6
      }

      var query = connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.newEmpFirstName,
          last_name: answer.newEmpLastName,
          emp_dept: answer.newEmpDept,
          salary: answer.newEmpSalary,
          roles_id: newEmpsRole,
          manager_id: newEmpsMgr
         },
    
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employee added!\n");
          runSearch()
        }
      )
    })
  }
  
  function updateEmpRole() {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, department.dept_name, employee.roles_id, roles.title ";
    query += "FROM employee ";
    query += "INNER JOIN department ON employee.emp_dept = department.dept_name ";
    query += "INNER JOIN roles ON department.id = roles.department_id ";

    connection.query(query, function(err, results) {
    if (err) throw err;
    
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          message: "Which employee's role would you like to update?",
          choices: function() {
            let choiceArray = [];
              for (let i=1; i < results.length; i++) {
              let emp = ""; 
              emp = `${results[i].id} ${results[i].first_name} ${results[i].last_name} ${results[i].dept_name} ${results[i].roles_id} ${results[i].title}`
              choiceArray.push(emp)
            }
          return choiceArray;
          }
        },
        {
          name: "roleUpdate",
          type: "list",
          message: "What role would you like to update this employee's role to?",
          choices: ['Supervisor', 'Attendent', 'Developer', 'Engineer', 'Accountant']
        }
      ])
      .then(function(answer) {
      updateToChosenRole(answer);
      return answer;
      })
    })  
  }

  function updateToChosenRole(answer) {
    newRoleId = "";
    newDept = "";
    newMgr = "";

    if (answer.roleUpdate === 'Supervisor') {
      newRoleId = 2;
      newDept = 'Management';
      newMgr = 1;
    }
    if (answer.roleUpdate === 'Attendent') {
     newRoleId = 3;
     newDept = 'General';
     newMgr = 3;
    }
    if (answer.roleUpdate === 'Developer') {
     newRoleId = 4;
     newDept = 'IT';
     newMgr = 6;
    }
    if (answer.roleUpdate === 'Engineer') {
     newRoleId = 5;
     newDept = 'IT';
     newMgr = 1;
    }
    if (answer.roleUpdate === 'Accountant') {
     newRoleId = 6;
     newDept = 'Accounting';
     newMgr = 1;
    }

    let choiceStr = answer.choice.split(" ")
    console.log(answer);
    console.log(choiceStr[0]);
    
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {
          roles_id: newRoleId,
          emp_dept: newDept, //Use this to update Dept Name in Employee table
          manager_id: newMgr
        },
        {
          id: parseInt(choiceStr[0])
        }
      ],
      function(error, res) {
        if (error) throw error;
        console.log(res.affectedRows + " You UPDATED the Employee's Role!");
      runSearch();
      }
    )
  }

  function removeEmployee() {
    let query = "SELECT employee.id, employee.first_name, employee.last_name ";
    query += "FROM employee ";
    connection.query(query, function(err, results) {
      if (err) throw err;
      inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          message: "Which employee would you like to delete?",
          choices: function() {
            let choiceArray = [];
              for (let i=1; i < results.length; i++) {
              let emp = " "; 
              emp = `${results[i].id} ${results[i].first_name} ${results[i].last_name}`
              choiceArray.push(emp)
            }
          return choiceArray;
          }
        }
      ])
      .then(function(answer) {
        deleteRemovedEmp(answer);
        return answer;
      })
    })
  }
       
  function deleteRemovedEmp(answer) {
    let choiceStr = answer.choice.split(" ");
    connection.query(
      "DELETE FROM employee WHERE ?",
      [
        {
          id: parseInt(choiceStr[0])
        }
      ],
        function(error, res) {
          if (error) throw error;
          console.log(res.affectedRows + " You DELETED the Employee!");
        runSearch();
        }
      )
    }

  function updateEmpMgr() {
    let query = "SELECT employee.id, employee.first_name, employee.last_name ";
    query += "FROM employee ";
    connection.query(query, function(err, results) {
      if (err) throw err;
      inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          message: "Which employee's manager would you like to update?",
          choices: function() {
            let choiceArray = [];
              for (let i=1; i < results.length; i++) {
              let emp = " "; 
              emp = `${results[i].id} ${results[i].first_name} ${results[i].last_name}`
              choiceArray.push(emp)
            }
          return choiceArray;
          }
        },
        {
          name: "mgrUpdate",
          type: "list",
          message: "Which manager would you like to assign to this employee?",
          choices: ['Anthony Stark', 'Nick Fury', 'Bruce Banner']
        }
      ])
      .then(function(answer) {
        updateEmployeeMgr(answer);
        return answer;
      })
    })
  }

  function updateEmployeeMgr(answer) {
    newMgr = "";

    if (answer.mgrUpdate === 'Anthony Stark') {
      newMgr = 1;
    }

    if (answer.mgrUpdate === 'Nick Fury') {
      newMgr = 3;
    }

    if (answer.mgrUpdate === 'Bruce Banner') {
      newMgr = 6;
    }

    let choiceStr = answer.choice.split(" ");
    
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {
          manager_id: newMgr
        },
        {
          id: parseInt(choiceStr[0])
        }
      ],
      function(error, res) {
        if (error) throw error;
        console.log(res.affectedRows + " Updated Manager!");
      runSearch();
      }
    )
  }

  function endSession() {
    console.log("Session ended.");
    connection.end();
  }