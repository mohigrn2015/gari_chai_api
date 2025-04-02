import { Sequelize } from 'sequelize';
import createUserModel from '../model/userModel.js';
import createRolesModel from '../model/rolesModel.js';

let Users = null;
let Roles = null;

export const dbConnection = async (databse, username, password) => {
    const sequelize = new Sequelize(databse, username, password, {
        host: 'localhost',
        dialect: 'postgres'
    });
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