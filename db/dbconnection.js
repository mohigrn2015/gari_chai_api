import { Sequelize } from 'sequelize';
import createUserModel from '../model/userModel.js';
import createRolesModel from '../model/rolesModel.js';

let Users = null;
let Roles = null;

export const dbConnection = async (databse, username, password) => {
    //Live
    const sequelize = new Sequelize(databse, username, password, {
        host: 'dpg-cvmengi4d50c73fuf00g-a',
        dialect: 'postgres'
    });

    //Test
    // const sequelize = new Sequelize(databse, username, password, {
    //     host: 'localhost',
    //     dialect: 'postgres'
    // });

    try {
        await sequelize.authenticate();
        Users = await createUserModel(sequelize);
        Roles = await createRolesModel(sequelize);
        await sequelize.sync({ alter: true });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export {Users,Roles}