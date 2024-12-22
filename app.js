const connectDB = require("./database/db.js");
const Task = require("./models/tasks.models.js");
connectDB();
console.log("\nWelcome to the Todo Manager App");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const showMenu = () => {
  console.log("\nChoose An Action : ");
  console.log("1.Add Task");
  console.log("2.List All the Tasks");
  console.log("3.Complete a Task");
  console.log("4.Delete a Task");
  console.log("5.Exit");
};
showMenu();

const mainMenu = async () => {
  rl.question("Enter Your Choice : ", async (ans) => {
    switch (ans) {
      case "1":
        console.log("You are Choosing to Add a Task ");
        rl.question("Enter the title of the Task ", async (title) => {
          rl.question("Enter the description of the task ", async (desc) => {
            try {
              const newTask = new Task({ title: title, description: desc });
              await newTask.save();
              console.log("Task Saved Successfully");
            } catch (error) {
              console.log("Error while adding the task ", error);
            }
            mainMenu();
          });
        });
        break;

      case "2":
        console.log("You are Choosing to List All the Tasks");
        try {
          const tasks = await Task.find();
          if (tasks.length == "0") {
            console.log("Tasks not found");
          } else {
            tasks.forEach((task, index) => {
              console.log(
                `${index + 1}. ${task.title} - ${task.description} [${
                  task.completed ? "Completed" : "Pending"
                }]`
              );
            });
          }
        } catch (error) {
          console.log("Error while fectching the tasks", error);
        }
        mainMenu();
        break;
      case "3":
        console.log("You are Choosing To Complete a Task");
        rl.question("Enter the id of the task to be Completed", async (id) => {
          try {
            const updatetask = await Task.findByIdAndUpdate(
              id,
              { completed: true },
              { new: true }
            );
            if (updatetask) {
              console.log(`${Task.title} has beeen completed`);
            } else {
              console.log("Error while updating the task");
            }
          } catch (error) {
            console.log("Error while trying to complete a task ");
          }
        });
        mainMenu();
        break;
      case "4":
        console.log("You are Choosing to delete a Task ");
        rl.question("Enter the id of the task to be deleted : ", async (id) => {
          const deletetask = await Task.findByIdAndDelete(id);
          if (deletetask) {
            console.log(`${Task.title} has been deleted`);
          } else {
            console.log(`Task not Found`);
          }
        });
        break;
      case "5":
        console.log("Exit");
        rl.close();
        break;
      default:
        console.log("Invalid Option ! Please Enter a Valid Choice");
        mainMenu();``
        break;
    }
  });
};
