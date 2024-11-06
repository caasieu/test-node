import { DataTypes } from "sequelize";
import { sequelize } from "../server";


// Definindo um modelo de usuário com Sequelize
const Task = sequelize.define('User', {
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    
    done: {
      type: DataTypes.BOOLEAN,
    },
});