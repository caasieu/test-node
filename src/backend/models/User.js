import { DataTypes } from "sequelize";
import { sequelize } from "../server";


// Definindo um modelo de usuário com Sequelize
const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false, 
    }
});