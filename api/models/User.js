/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'user',
  attributes: {
  	id: {
  		type: 'INTEGER',
  		autoIncrement: true,
  		primaryKey: true
  	},
  	username: {
  		type: 'STRING',
  		required: true
  	},
  	password: {
  		type: 'STRING',
  		required: true
  	}
  },
  beforeUpdate: function (values, next) {
        CipherService.hashPassword(values);
        next();
  },
  beforeCreate: function (values, next) {
        CipherService.hashPassword(values);
        next();
  }
};

