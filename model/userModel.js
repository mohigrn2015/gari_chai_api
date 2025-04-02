import {DataTypes } from "sequelize";
import createRolesModel from "./rolesModel.js";

const createUserModel = async (sequelize) => {
    const Users = sequelize.define("tbl_users", {
        userid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        personname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usertype: {
            type: DataTypes.INTEGER, // Matches 'usertype' in Roles table
            allowNull: false
        },
        mobilenumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nidnumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        drivinglisence: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: { isEmail: true }
        },
        refreshtoken: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdby: {
            type: DataTypes.STRING,
            allowNull: true
        },
        updatedby: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    // Define association with Roles
    const Roles = await createRolesModel(sequelize);
    Users.belongsTo(Roles, { foreignKey: "usertype", targetKey: "usertype" });

    return Users;
};

export default createUserModel;