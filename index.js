import express from 'express';
import cookieParser from 'cookie-parser';
import { dbConnection } from './db/dbconnection.js';
import router from './route/routes.js';


const app = express();
//Test
// const port = "5000";
// const database = "gariChaiDb";
// const username = "postgres";
// const password = "Ssle@1234";


//live 
const port = "5432";
const database = "garichaidb";
const username = "garichaidb";
const password = "CU9OQwbkh9MO8nZYTt3JFGXGteDV69bA";

app.use(express.json());
app.use(cookieParser());
app.use("/api",router);

await dbConnection(database,username,password);

app.listen(port, ()=>{
    console.log(`Application is running on ${port}`);
})