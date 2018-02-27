var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sufjanstevens",
  database: "bamazon"
  
});
  
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected as id: " +connection.threadId);
  //startFunction();
});
readTable();
function readTable(){
    connection.query("SELECT * FROM products", function (err, res) {
        if(err) console.log(err)

        var table = new Table({
                head: ["id", "ProductName", "DepartmentName", "Price", "QuantityInStock" ]
        })

        for (var i = 0; i < res.length; i ++){
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
                    )
        }
        
        console.log(table.toString());
        startFunction();
        })
  }


function startFunction(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              //prefix: "product_name" + "\t" + "price",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].product_name);
                }
                //choiceArray.push("Q")
                return choiceArray;
              },
              message: "Which item would you like to buy?"
            },
            {
              name: "boughts",
              type: "input",
              message: "How many would you like to buy?"
            }
          ])
          .then(function(answer) {
  //         // get the information of the chosen item
          var chosenItem;

          // if (answer.choice.toUpperCase() === "Q" || answer.boughts.toUpperCase() === "Q"){
          //   console.log("Good Bye!")
          //   process.exit();

          // }
          for (var i = 0; i < results.length; i++) {

            if (results[i].product_name === answer.choice) {
              chosenItem = results[i];
            }
          }
          // console.log(chosenItem);

          if (answer.boughts <= chosenItem.stock_quantity) {

            // console.log("inside my if statement")



            //LOOK UP FOR BELOW - THERE IS AN ERROR WITH THE SYNTAX
            connection.query(
              "UPDATE products SET ? WHERE ?",
              // //reexamine the where syntax
              [
                {
                  stock_quantity : chosenItem.stock_quantity - answer.boughts 
                },
                 {
                  id: chosenItem.id
                 }],function(error, res) {
          //       if (error) throw err;
                  console.log("Bid placed successfully!");
                  console.log(chosenItem.price*answer.boughts);
                  startFunction()
                  readTable()
                  }
                );

        //DO NOT TOUCH BELOW 



          //this is the end of my conditional
          }
          // else{

          
          //   console.log("Insufficient quantity!");
            // startFunction();
          // }



      //this is the end of my .then(function(answer) { for inquirer prompt
      });
  //this is the end of my connection.query("SELECT * FROM products"
  });
//this is the end of my startFunction()
};











	 