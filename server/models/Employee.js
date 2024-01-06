// const mongoose = require('mongoose')

// const EmployeeSchema = new mongoose.Schema({
//     name:String,
//     email:String,
//     password:String,
// })

// const EmployeeModel = mongoose.model("employees", EmployeeSchema)
// module.exports = EmployeeModel


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    savedFiles: {
        fileName: String,
        fileContent: String
    }
});

const EmployeeModel = mongoose.model('Employee', employeeSchema);

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
