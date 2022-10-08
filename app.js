const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { format, isValid } = require("date-fns");

const app = express();
app.use(express.json());
let database = null;
const dbPath = path.join(__dirname, "todoApplication.db");

const arrObject = (jsObject) => {
  return {
    id: jsObject.id,
    todo: jsObject.todo,
    priority: jsObject.priority,
    category: jsObject.category,
    status: jsObject.status,
    dueDate: jsObject.due_date,
  };
};

const arrObject2 = (jsObject) => {
  return {
    id: jsObject.id,
    todo: jsObject.todo,
    priority: jsObject.priority,
    status: jsObject.status,
    category: jsObject.category,
    dueDate: jsObject.due_date,
  };
};
const intilizedbandserver = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server started");
    });
  } catch (e) {
    console.log(`DB ERROR ${e.message}`);
    process.exit(1);
  }
};
//category=WORK&status=DONE

const hasPriorityAndStatuePropertyAndCategory = (requestQuery) => {
  return (
    requestQuery.priority !== undefined &&
    requestQuery.status !== undefined &&
    requestQuery.category !== undefined
  );
};

const hasPriorityAndCategoryProperty = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.category !== undefined
  );
};

const hasCategoryAndStatueProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityAndStatueProperty = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

intilizedbandserver();

const Authorization = (request, response, next) => {
  const { priority, status, category, dueDate } = request.query;
  //console.log(`priority ${priority},status ${status} and category ${category}`);
  let check = true;
  priorityList = ["HIGH", "MEDIUM", "LOW"];
  statusList = ["TO DO", "IN PROGRESS", "DONE"];
  categoryList = ["WORK", "HOME", "LEARNING"];
  if (hasPriorityProperty(request.query)) {
    if (priorityList.includes(priority) === false) {
      check = false;
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  }

  if (hasStatusProperty(request.query)) {
    if (statusList.includes(status) === false) {
      check = false;
      response.status(400);
      response.send("Invalid Todo Status");
    }
  }

  if (hasCategoryProperty(request.query)) {
    if (categoryList.includes(category) === false) {
      check = false;
      response.status(400);
      response.send("Invalid Todo Category");
    }
  }
  if (dueDate !== undefined) {
    try {
      const r1 = format(new Date(dueDate), "yyyy-MM-dd");
      console.log(r1);
    } catch (e) {
      console.log(e.message);
      check = false;
      response.status(400);
      response.send("Invalid Due Date");
      check = false;
    }
  }
  //console.log(request.query.dueDate);
  // request.query.dueDate = "hello";
  //console.log(check);
  if (check === true) {
    next();
  }
};
const authValidDueDateQuery = (request, response, next) => {
  const { dueDate } = request.query;
  // console.log(dueDate);

  //console.log("1");
  if (dueDate !== undefined) {
    let result = isValid(new Date(dueDate));
    console.log(result);
    if (result === true) {
      const r1 = format(new Date(date), "yyyy-MM-dd");
      request.query.dueDate = r1;
      next();
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
    next();
  }
};
const authValidDateQuery = (request, response, next) => {
  const { date } = request.query;
  console.log(date);

  console.log("1");
  if (date !== undefined) {
    let result = isValid(new Date(date));
    console.log(result);
    if (result === true) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
    console.log("e");
    response.status(400);
    response.send("Invalid Due Date");
  }
};

app.get(
  "/todos/",
  Authorization,
  authValidDueDateQuery,
  async (request, response) => {
    let data = null;
    let getTodosQuery = "";
    const { search_q = "", priority, status, category } = request.query;
    console.log(request.query.dueDate);
    switch (true) {
      case hasPriorityAndStatuePropertyAndCategory(request.query):
        getTodosQuery = `
        SELECT
            *
        FROM
            todo 
        WHERE
            todo LIKE '%${search_q}%'
            AND status = '${status}'
            AND priority = '${priority}'
            AND category = '${category}';`;
        //  console.log("1");
        break;
      case hasPriorityAndCategoryProperty(request.query):
        getTodosQuery = `
            SELECT
                *
            FROM
                todo 
            WHERE
                todo LIKE '%${search_q}%'
                AND category = '${category}'
                AND priority = '${priority}';`;
        //    console.log("2");
        break;
      case hasCategoryAndStatueProperty(request.query):
        getTodosQuery = `
            SELECT
                *
            FROM
                todo 
            WHERE
                todo LIKE '%${search_q}%'
                AND status = '${status}'
                AND category = '${category}';`;
        // console.log("3");
        break;
      case hasPriorityAndStatueProperty(request.query):
        getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND status = '${status}'
        AND priority = '${priority}';`;
        //   console.log("4");
        break;

      case hasPriorityProperty(request.query):
        getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND priority = '${priority}';`;
        //   console.log("5");
        break;
      case hasStatusProperty(request.query):
        getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND status = '${status}';`;
        //    console.log("6");
        break;
      case hasCategoryProperty(request.query):
        getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%'
        AND category = '${category}';`;
        //  console.log(category);
        //    console.log("7");
        break;
      default:
        getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%';`;
        //  console.log("8");
        break;
    }

    data = await database.all(getTodosQuery);
    response.send(data.map((eachObject) => arrObject(eachObject)));
  }
);

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  //console.log(todoId);
  const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todo = await database.get(getTodoQuery);
  response.send(arrObject(todo));
});

app.get("/agenda/", authValidDateQuery, async (request, response) => {
  const { date } = request.query;
  const r1 = format(new Date(date), "yyyy-MM-dd");
  //  const r1 = date;
  console.log(r1);
  getTodosDateQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        due_date = '${r1}';`;
  const todo = await database.all(getTodosDateQuery);
  response.send(todo.map((each) => arrObject2(each)));
});

const AuthorizationBody = (request, response, next) => {
  const { priority, status, category, dueDate } = request.body;
  //console.log(`priority ${priority},status ${status} and category ${category}`);
  let check = true;
  priorityList = ["HIGH", "MEDIUM", "LOW"];
  statusList = ["TO DO", "IN PROGRESS", "DONE"];
  categoryList = ["WORK", "HOME", "LEARNING"];
  if (hasPriorityProperty(request.body)) {
    if (priorityList.includes(priority) === false) {
      check = false;
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  }

  if (hasStatusProperty(request.body)) {
    if (statusList.includes(status) === false) {
      check = false;
      response.status(400);
      response.send("Invalid Todo Status");
    }
  }

  if (hasCategoryProperty(request.body)) {
    if (categoryList.includes(category) === false) {
      check = false;
      response.status(400);
      response.send("Invalid Todo Category");
    }
  }

  //console.log(check);
  //console.log(dueDate);
  if (dueDate !== undefined) {
    if (isValid(new Date(dueDate)) === true) {
      const r1 = format(new Date(dueDate), "yyyy-MM-dd");
      console.log(r1);
    } else {
      response.status(400);
      response.send("Invalid Due Date");
      check = false;
    }
  }
  //console.log(check);
  if (check === true) {
    next();
  }
};

app.post("/todos/", AuthorizationBody, async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const r1 = format(new Date(dueDate), "yyyy-MM-dd");
  console.log(r1);
  const postTodoQuery = `
  INSERT INTO
    todo (id, todo, priority, status , category , due_date)
  VALUES
    (${id}, '${todo}', '${priority}', '${status}','${category}','${r1}');`;
  await database.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", AuthorizationBody, async (request, response) => {
  const { todoId } = request.params;
  let updateColumn = "";
  const requestBody = request.body;
  switch (true) {
    case requestBody.status !== undefined:
      updateColumn = "Status";
      break;
    case requestBody.priority !== undefined:
      updateColumn = "Priority";
      break;
    case requestBody.todo !== undefined:
      updateColumn = "Todo";
      break;
    case requestBody.category !== undefined:
      updateColumn = "Category";
      break;
    case requestBody.dueDate !== undefined:
      updateColumn = "Due Date";
      break;
  }
  const previousTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE 
      id = ${todoId};`;
  const previousTodo = await database.get(previousTodoQuery);
  // console.log(previousTodo);
  const {
    todo = previousTodo.todo,
    priority = previousTodo.priority,
    status = previousTodo.status,
    category = previousTodo.category,
    dueDate = previousTodo.due_date,
  } = request.body;

  const updateTodoQuery = `
    UPDATE
      todo
    SET
      todo='${todo}',
      priority='${priority}',
      status='${status}',
      category = '${category}',
      due_date = '${dueDate}'
    WHERE
      id = ${todoId};`;

  await database.run(updateTodoQuery);
  response.send(`${updateColumn} Updated`);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId};`;

  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
