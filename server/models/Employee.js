// const mongoose = require('mongoose')

// const EmployeeSchema = new mongoose.Schema({
//     name:String,
//     email:String,
//     password:String,
// })

// const EmployeeModel = mongoose.model("employees", EmployeeSchema)
// module.exports = EmployeeModel


const mongoose = require('mongoose');

const SavedFileSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  fileContent: String,  // Add this field for storing file content
});

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  savedFiles: [SavedFileSchema],
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema);

module.exports = EmployeeModel;


// const mongoose = require('mongoose');

// const SavedFileSchema = new mongoose.Schema({
//   fileName: String,
//   filePath: String,
// });

// const EmployeeSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   savedFiles: [SavedFileSchema],
// });

// const EmployeeModel = mongoose.model('employees', EmployeeSchema);

// module.exports = EmployeeModel;
