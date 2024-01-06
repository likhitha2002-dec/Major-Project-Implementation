// @ts-ignore
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const solc = require('solc');
const cors = require("cors");
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const EmployeeModel = require('./models/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: 'http://127.0.0.1:5173', // Update with your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/employee");

app.post('/compile', (req, res) => {
    try {
        const { fileName, fileContent } = req.body;

        const input = {
            language: 'Solidity',
            sources: {
                [fileName]: {
                    content: fileContent,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        if (output.errors) {
            res.status(400).json({ error: 'Compilation error', errors: output.errors });
        } else {
            const contractName = Object.keys(output.contracts[fileName])[0];
            const bytecode = output.contracts[fileName][contractName].evm.bytecode.object;
            res.json({ bytecode });
        }
    } catch (error) {
        console.error('Error during compilation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/generate-image', async (req, res) => {
    try {
        const { bytecode } = req.body;

        // Save the bytecode to a temporary file
        const tempFilePath = path.join(__dirname, 'temp.sol');
        fs.writeFileSync(tempFilePath, bytecode, 'utf-8');

        // Use the Python script to generate the image
        const pythonProcess = spawn('python', ['generate_image.py', tempFilePath]);

        let imageData = Buffer.from([]);
        let errorData = Buffer.from([]);

        pythonProcess.stdout.on('data', (data) => {
            imageData = Buffer.concat([imageData, data]);
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData = Buffer.concat([errorData, data]);
        });

        pythonProcess.on('close', (code) => {
            // Clean up the temporary file
            fs.unlinkSync(tempFilePath);

            if (code === 0) {
                // Send the binary image data as a Buffer
                res.setHeader('Content-Type', 'image/png');
                res.send(imageData);
            } else {
                console.error(`Error during image generation: ${errorData.toString()}`);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } catch (error) {
        console.error('Error during image generation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/save-file', (req, res) => {
  try {
      const { fileName, fileContent } = req.body;

      // Specify the directory where you want to save the files
      const saveDirectory = 'C:\\Users\\lekkala likhitha\\Downloads';

      // Construct the full path for saving the file
      const filePath = path.join(saveDirectory, fileName);

      // Save the file content to the specified path
      fs.writeFileSync(filePath, fileContent, 'utf-8');

      res.json({ message: 'File saved successfully' });
  } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

const secretKey = 'U8w2*sZv$Bq6@pYtT5rKl#nA!9E4gHj';

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await EmployeeModel.findOne({ email });

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({ email: user.email }, secretKey);
                res.json({ token });
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = await EmployeeModel.create({
            name,
            email,
            password: hashedPassword,
        });

        res.json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// app.post("/login", (req, res) => {
//     const { email, password } = req.body;
//     EmployeeModel.findOne({ email: email })
//         .then(user => {
//             if (user) {
//                 if (user.password === password) {
//                     res.json("Success");
//                 } else {
//                     res.json("the password is incorrect");
//                 }
//             } else {
//                 res.json("User doesn't exist");
//             }
//         });
// });

// app.post('/register', (req, res) => {
//     EmployeeModel.create(req.body)
//         .then(employees => res.json(employees))
//         .catch(err => res.json(err));
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});









// // @ts-ignore
// const express = require("express");
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const solc = require('solc');
// const cors = require("cors");
// const { spawn } = require('child_process');
// const fs = require('fs');
// const path = require('path');
// const EmployeeModel = require('./models/Employee');

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect("mongodb://127.0.0.1:27017/employee");

// app.post('/compile', (req, res) => {
//     try {
//         const { fileName, fileContent } = req.body;

//         const input = {
//             language: 'Solidity',
//             sources: {
//                 [fileName]: {
//                     content: fileContent,
//                 },
//             },
//             settings: {
//                 outputSelection: {
//                     '*': {
//                         '*': ['*'],
//                     },
//                 },
//             },
//         };

//         const output = JSON.parse(solc.compile(JSON.stringify(input)));

//         if (output.errors) {
//             res.status(400).json({ error: 'Compilation error', errors: output.errors });
//         } else {
//             const contractName = Object.keys(output.contracts[fileName])[0];
//             const bytecode = output.contracts[fileName][contractName].evm.bytecode.object;
//             res.json({ bytecode });
//         }
//     } catch (error) {
//         console.error('Error during compilation:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/generate-image', async (req, res) => {
//     try {
//         const { bytecode } = req.body;

//         // Save the bytecode to a temporary file
//         const tempFilePath = path.join(__dirname, 'temp.sol');
//         fs.writeFileSync(tempFilePath, bytecode, 'utf-8');

//         // Use the Python script to generate the image
//         const pythonProcess = spawn('python', ['generate_image.py', tempFilePath]);

//         let imageData = Buffer.from([]);
//         let errorData = Buffer.from([]);

//         pythonProcess.stdout.on('data', (data) => {
//             imageData = Buffer.concat([imageData, data]);
//         });

//         pythonProcess.stderr.on('data', (data) => {
//             errorData = Buffer.concat([errorData, data]);
//         });

//         pythonProcess.on('close', (code) => {
//             // Clean up the temporary file
//             fs.unlinkSync(tempFilePath);

//             if (code === 0) {
//                 // Send the binary image data as a Buffer
//                 res.setHeader('Content-Type', 'image/png');
//                 res.send(imageData);
//             } else {
//                 console.error(`Error during image generation: ${errorData.toString()}`);
//                 res.status(500).json({ error: 'Internal Server Error' });
//             }
//         });
//     } catch (error) {
//         console.error('Error during image generation:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post("/login", (req, res) => {
//     const { email, password } = req.body;
//     EmployeeModel.findOne({ email: email })
//         .then(user => {
//             if (user) {
//                 if (user.password === password) {
//                     res.json("Success");
//                 } else {
//                     res.json("the password is incorrect");
//                 }
//             } else {
//                 res.json("User doesn't exist");
//             }
//         });
// });

// app.post('/register', (req, res) => {
//     EmployeeModel.create(req.body)
//         .then(employees => res.json(employees))
//         .catch(err => res.json(err));
// });

// app.listen(3001, () => {
//     console.log("server is running");
// });










// // // @ts-ignore
// // const express = require("express")
// // const mongoose = require('mongoose')
// // const bodyParser = require('body-parser');
// // const solc = require('solc');
// // const cors = require("cors")
// // const { spawn } = require('child_process');
// // const fs = require('fs');
// // const path = require('path');
// // const EmployeeModel = require('./models/Employee')

// // const app = express()
// // app.use(express.json())
// // app.use(cors())

// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

// // mongoose.connect("mongodb://127.0.0.1:27017/employee")
// // //mongoose.connect("mongodb+srv://ponnururakshitha:rakshu@cluster0.nqstj.mongodb.net/project");


// // app.post('/compile', (req, res) => {
// //     try {
// //       const { fileName, fileContent } = req.body;
  
// //       const input = {
// //         language: 'Solidity',
// //         sources: {
// //           [fileName]: {
// //             content: fileContent,
// //           },
// //         },
// //         settings: {
// //           outputSelection: {
// //             '*': {
// //               '*': ['*'],
// //             },
// //           },
// //         },
// //       };
  
// //       const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
// //       if (output.errors) {
// //         res.status(400).json({ error: 'Compilation error', errors: output.errors });
// //       } else {
// //         const contractName = Object.keys(output.contracts[fileName])[0];
// //         const bytecode = output.contracts[fileName][contractName].evm.bytecode.object;
// //         res.json({ bytecode });
// //       }
// //     } catch (error) {
// //       console.error('Error during compilation:', error);
// //       res.status(500).json({ error: 'Internal Server Error' });
// //     }
// // });

// // app.post('/generate-image', async (req, res) => {
// //     try {
// //         const { bytecode } = req.body;

// //         // Save the bytecode to a temporary file
// //         const tempFilePath = path.join(__dirname, 'temp.sol');
// //         fs.writeFileSync(tempFilePath, bytecode, 'utf-8');

// //         // Use the Python script to generate the image
// //         const pythonProcess = spawn('python', ['generate_image.py', tempFilePath]);

// //         let imageData = Buffer.from([]);

// //         pythonProcess.stdout.on('data', (data) => {
// //             imageData = Buffer.concat([imageData, data]);
// //         });

// //         pythonProcess.stderr.on('data', (data) => {
// //             console.error(`Error during image generation: ${data}`);
// //             res.status(500).json({ error: 'Internal Server Error' });
// //         });

// //         pythonProcess.on('close', (code) => {
// //             // Clean up the temporary file
// //             fs.unlinkSync(tempFilePath);

// //             if (code === 0) {
// //                 // Send the binary image data as a Buffer
// //                 res.setHeader('Content-Type', 'image/png');
// //                 res.send(imageData);
// //             } else {
// //                 console.error(`Image generation process exited with code ${code}`);
// //                 res.status(500).json({ error: 'Internal Server Error' });
// //             }
// //         });
// //     } catch (error) {
// //         console.error('Error during image generation:', error);
// //         res.status(500).json({ error: 'Internal Server Error' });
// //     }
// // });

  

// // app.post("/login", (req, res) => {
// //     const {email, password} = req.body;
// //     EmployeeModel.findOne({email: email})
// //     .then(user => {
// //         if(user){
// //             if(user.password === password){
// //                 res.json("Success")
// //             }
// //             else{
// //                 res.json("the password is incorrect")
// //             }
// //         }
// //         else{
// //             res.json("User doesn't exist")
// //         }
// //     })
// // })

// // app.post('/register', (req,res) =>{
// //     EmployeeModel.create(req.body)
// //     .then(employees => res.json(employees))
// //     .catch(err => res.json(err))
// // })

// // app.listen(3001,() => {
// //     console.log("server is running")
// // })