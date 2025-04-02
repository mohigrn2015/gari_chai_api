import { DataTypes } from "sequelize";

const createRolesModel = async (sequelize) => {
    const Roles = sequelize.define("tbl_roles", {
        roleid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rolename: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        usertype: {
            type: DataTypes.INTEGER, // Should match with 'usertype' in Users table
            allowNull: false,
            unique: true
        }
    });

    return Roles;
};

export default createRolesModel;
