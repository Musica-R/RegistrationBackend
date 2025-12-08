This file is for learining a react and express.js

<!-- File flow connection with server to database -->

1 .env        --> 1.store the database url

2 database.js --> 1. Here we import the mongooge
                  2. use mongoose.connect.url (its connect with database)

3 app.js      --> 1. import the express to run the server 

4 index.js    --> 1. importing dotenv (set the .env path)
                  2. importing datasbase.js (call the database  function)
                  3. importing app.js (on the server with app.listen)
                  

==================================================================================================================================

<!-- File flow for creating Registerapi -->    

1.userMode.js        --> write a schema and model

2.userController.js  --> write a api logic for regiter 
                        1.import userModel.js (because model has a query of mongodb)(because queries like .create(), .findOne())

3.userRouter.js      --> write a routingpath
                        1.import userController.js (because its has logic of register path)  

                        2.Create router using express.Router()
                        Define route → router.post("/register", registerFunction)

4.app.js             --> writing a path for api
                         1.import a userRouter.js    Middlewares (express.json, cors, routes, etc.)  
                         2. Use route → app.use("/api/users", userRouter)

==================================================================================================================================

 <!-- Frontend → API Call → app.js → userRouter.js → userController.js → userModel.js → MongoDB -->

 1.Request → app.js (path)
        → userRouter.js (which function?)
        → userController.js (logic)
        → userModel.js (DB query)
        → MongoDB
==================================================================================================================================

<!--frontend backend connetion -->

1.write a registration form  

2.fetch the api

3.say to a backend, the frontend is running on which port by using cors .


