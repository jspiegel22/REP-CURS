# To-do app in Python

# Define a list to store the tasks
tasks = []

# Define a function to add a new task to the list
def add_task(task):
  tasks.append(task)
  print("Task added:", task)

# Define a function to view all the tasks in the list
def view_tasks():
  if len(tasks) == 0:
    print("There are no tasks in the list.")
  else:
    print("Here are all the tasks in the list:")
    for task in tasks:
      print(task)

# Define a function to remove a task from the list
def remove_task(task):
  if task in tasks:
    tasks.remove(task)
    print("Task removed:", task)
  else:
    print("Task not found in the list:", task)

# Define a function to clear all the tasks from the list
def clear_tasks():
  tasks.clear()
  print("All tasks cleared from the list.")

# Main program
while True:
  # Ask the user what they want to do
  action = input("What do you want to do? (add/view/remove/clear/quit): ")

  # Add a new task
  if action.lower() == "add":
    task = input("Enter the task you want to add: ")
    add_task(task)

  # View all the tasks
  elif action.lower() == "view":
    view_tasks()

  # Remove a task
  elif action.lower() == "remove":
    task = input("Enter the task you want to remove: ")
    remove_task(task)

  # Clear all the tasks
  elif action.lower() == "clear":
    clear_tasks()

  # Quit the app
  elif action.lower() == "quit":
    print("Goodbye!")

