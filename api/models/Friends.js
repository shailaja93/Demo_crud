/**
 * Friends.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'friends',
  attributes: {
  	id : {
  		type : 'INTEGER',
  		primaryKey : true,
  		autoIncrement : true
  	},
  	fid : {
  		type : 'INTEGER',
  		required : true
  	},
  	uid : {
  		type : 'INTEGER',
  		required : true
  	}
  }
};

