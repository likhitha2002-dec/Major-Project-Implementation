import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';

function Home() {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [bytecode, setBytecode] = useState('');
  const [rgbImage, setRgbImage] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [savingFile, setSavingFile] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
      };

      reader.readAsText(file);
    }
  };

  const handleUserEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handleCompileClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: fileName,
          fileContent: fileContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setBytecode(result.bytecode);
      } else {
        console.error('Server returned an error:', response.statusText);
      }
    } catch (error) {
      console.error('Error during compilation:', error);
    }
  };

  const handleGenerateImageClick = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/generate-image',
        { bytecode: bytecode },
        { responseType: 'arraybuffer' }
      );

      if (response.data) {
        const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        setRgbImage(base64Image);
      } else {
        console.error('Server returned an error:', response.statusText);
      }
    } catch (error) {
      console.error('Error during image generation:', error);
    }
  };



  const saveToFile = async () => {
    try {
      // Specify the directory where you want to save the files
      const saveDirectory = 'C:\\Users\\lekkala likhitha\\Downloads';
  
      // Construct the full path for saving the file
      const filePath = `${saveDirectory}/${fileName}`;
  
      // Save the file content to the specified path
      // (You may choose to comment this line if you don't want to save it to disk)
      // fs.writeFileSync(filePath, fileContent, 'utf-8');
  
      // Update the file content in the MongoDB database
      const response = await axios.post('http://localhost:3001/save-file', {
        fileName: fileName,
        fileContent: fileContent,
        userEmail: userEmail,  // Send the user email to identify the employee
      });
  
      console.log('File saved successfully in MongoDB:', response.data);
      setSavingFile(false);  // Update the savingFile state if needed
    } catch (error) {
      console.error('Error saving file:', error);
      setSavingFile(false);  // Update the savingFile state if needed
    }
  };
  

  const handleCreateProjectClick = () => {
    setCreatingProject(!creatingProject);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container p-4 rounded" style={{ maxWidth: '800px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h2 className="mb-4 text-primary text-center">Home Component</h2>

        {creatingProject ? (
          <div>
            <h3 className="mb-3 text-info text-center">Create New Project</h3>

            {/* Additional UI for creating a new project */}
            <div className="mb-3">
              <input type="file" onChange={handleFileChange} className="form-control-file" />
            </div>
            {fileName && <p className="mb-3 text-success text-center">Selected File: {fileName}</p>}
            {/* Add the email input */}
            <div className="mb-3">
              <label>Email:</label>
              <input type="email" value={userEmail} onChange={handleUserEmailChange} className="form-control" />
            </div>
            {fileContent && (
              <div>
                <h3 className="mb-3 text-info text-center">Monaco Editor</h3>
                <MonacoEditor
                  width="100%"
                  height="400"
                  language="javascript"
                  theme="vs-dark"
                  value={fileContent}
                  onChange={newContent => setFileContent(newContent)}
                />
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={handleCompileClick} className="btn btn-primary">
                    Compile Code
                  </button>
                  <button onClick={handleGenerateImageClick} className="btn btn-success">
                    Generate Image
                  </button>
                  <button onClick={saveToFile} className="btn btn-info" disabled={savingFile}>
                    {savingFile ? 'Saving...' : 'Save to File'}
                  </button>
                </div>
                {bytecode && (
                  <div className="mt-3">
                    <h4 className="mb-3 text-info text-center">Bytecode</h4>
                    <pre>{bytecode}</pre>
                  </div>
                )}
                {rgbImage && (
                  <div className="mt-3 text-center">
                    <h4 className="mb-3 text-success text-center">RGB Image</h4>
                    <img
                      src={`data:image/png;base64,${rgbImage}`}
                      alt="RGB Image"
                      style={{ width: '25%', height: 'auto' }}
                      className="mx-auto"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Add a button to exit the new project creation mode */}
            <button onClick={handleCreateProjectClick} className="btn btn-warning mt-3">
              Cancel
            </button>
          </div>
        ) : (
          <div>
            {/* Existing UI for the default mode */}
            <button onClick={handleCreateProjectClick} className="btn btn-warning mt-3">
              Create New Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
















// import React, { useState } from 'react';
// import MonacoEditor from 'react-monaco-editor';
// import axios from 'axios';
// import path from 'path'; // Add this line
// import fs from 'fs';
// function Home() {
//   const [fileContent, setFileContent] = useState('');
//   const [fileName, setFileName] = useState('');
//   const [bytecode, setBytecode] = useState('');
//   const [rgbImage, setRgbImage] = useState('');
//   const [creatingProject, setCreatingProject] = useState(false);
//   const [userEmail, setUserEmail] = useState('');
//   const [savingFile, setSavingFile] = useState(false);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       setFileName(file.name);

//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setFileContent(event.target.result);
//       };

//       reader.readAsText(file);
//     }
//   };

//   const handleUserEmailChange = (event) => {
//     setUserEmail(event.target.value);
//   };

//   const handleCompileClick = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/compile', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           fileName: fileName,
//           fileContent: fileContent,
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setBytecode(result.bytecode);
//       } else {
//         console.error('Server returned an error:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error during compilation:', error);
//     }
//   };

//   const handleGenerateImageClick = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:3001/generate-image',
//         { bytecode: bytecode },
//         { responseType: 'arraybuffer' }
//       );

//       if (response.data) {
//         const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
//         setRgbImage(base64Image);
//       } else {
//         console.error('Server returned an error:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error during image generation:', error);
//     }
//   };

//   // const saveToFile = () => {
//   //   // Implement the logic to save the content to a file on your server or through an API
//   //   // For simplicity, you can make a server API call using axios
//   //   axios.post('http://localhost:3001/save-file', { fileName, fileContent })
//   //     .then(response => {
//   //       console.log('File saved successfully:', response.data);
//   //     })
//   //     .catch(error => {
//   //       console.error('Error saving file:', error);
//   //     });
//   // };
  

//   const saveToFile = () => {
//     try {
//       // Specify the directory where you want to save the files
//       const saveDirectory = 'C:\\Users\\lekkala likhitha\\Downloads';
  
//       // Construct the full path for saving the file
//       const filePath = path.join(saveDirectory, fileName);
  
//       // Save the file content to the specified path
//       fs.writeFileSync(filePath, fileContent, 'utf-8');
  
//       // Update the file content in the MongoDB database
//       EmployeeModel.findOneAndUpdate(
//         { email: userEmail },
//         { $set: { fileContent: fileContent } },
//         { new: true }
//       )
//         .then(updatedEmployee => {
//           console.log('File content updated in MongoDB:', updatedEmployee);
//         })
//         .catch(error => {
//           console.error('Error updating file content in MongoDB:', error);
//         });
  
//       res.json({ message: 'File saved successfully' });
//     } catch (error) {
//       console.error('Error saving file:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
  

//   const handleCreateProjectClick = () => {
//     setCreatingProject(!creatingProject);
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
//       <div className="container p-4 rounded" style={{ maxWidth: '800px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
//         <h2 className="mb-4 text-primary text-center">Home Component</h2>

//         {creatingProject ? (
//           <div>
//             <h3 className="mb-3 text-info text-center">Create New Project</h3>

//             {/* Additional UI for creating a new project */}
//             <div className="mb-3">
//               <input type="file" onChange={handleFileChange} className="form-control-file" />
//             </div>
//             {fileName && <p className="mb-3 text-success text-center">Selected File: {fileName}</p>}
//             {/* Add the email input */}
//             <div className="mb-3">
//               <label>Email:</label>
//               <input type="email" value={userEmail} onChange={handleUserEmailChange} className="form-control" />
//             </div>
//             {fileContent && (
//               <div>
//                 <h3 className="mb-3 text-info text-center">Monaco Editor</h3>
//                 <MonacoEditor
//                   width="100%"
//                   height="400"
//                   language="javascript"
//                   theme="vs-dark"
//                   value={fileContent}
//                   onChange={newContent => setFileContent(newContent)}
//                 />
//                 <div className="d-flex justify-content-between mt-3">
//                   <button onClick={handleCompileClick} className="btn btn-primary">
//                     Compile Code
//                   </button>
//                   <button onClick={handleGenerateImageClick} className="btn btn-success">
//                     Generate Image
//                   </button>
//                   <button onClick={saveToFile} className="btn btn-info" disabled={savingFile}>
//                     {savingFile ? 'Saving...' : 'Save to File'}
//                   </button>
//                 </div>
//                 {bytecode && (
//                   <div className="mt-3">
//                     <h4 className="mb-3 text-info text-center">Bytecode</h4>
//                     <pre>{bytecode}</pre>
//                   </div>
//                 )}
//                 {rgbImage && (
//                   <div className="mt-3 text-center">
//                     <h4 className="mb-3 text-success text-center">RGB Image</h4>
//                     <img
//                       src={`data:image/png;base64,${rgbImage}`}
//                       alt="RGB Image"
//                       style={{ width: '25%', height: 'auto' }}
//                       className="mx-auto"
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Add a button to exit the new project creation mode */}
//             <button onClick={handleCreateProjectClick} className="btn btn-warning mt-3">
//               Cancel
//             </button>
//           </div>
//         ) : (
//           <div>
//             {/* Existing UI for the default mode */}
//             <button onClick={handleCreateProjectClick} className="btn btn-warning mt-3">
//               Create New Project
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;








// // import React, { useState } from 'react';
// // import MonacoEditor from 'react-monaco-editor';
// // import axios from 'axios';

// // function Home() {
// //   const [fileContent, setFileContent] = useState('');
// //   const [fileName, setFileName] = useState('');
// //   const [bytecode, setBytecode] = useState('');
// //   const [rgbImage, setRgbImage] = useState('');
// //   const [creatingProject, setCreatingProject] = useState(false);
// //   const [userEmail, setUserEmail] = useState('');
// //   const [savingFile, setSavingFile] = useState(false);

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];

// //     if (file) {
// //       setFileName(file.name);

// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         setFileContent(event.target.result);
// //       };

// //       reader.readAsText(file);
// //     }
// //   };

// //   const handleCompileClick = async () => {
// //     try {
// //       const response = await fetch('http://localhost:3001/compile', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           fileName: fileName,
// //           fileContent: fileContent,
// //         }),
// //       });

// //       if (response.ok) {
// //         const result = await response.json();
// //         setBytecode(result.bytecode);
// //       } else {
// //         console.error('Server returned an error:', response.statusText);
// //       }
// //     } catch (error) {
// //       console.error('Error during compilation:', error);
// //     }
// //   };

// //   const handleGenerateImageClick = async () => {
// //     try {
// //       const response = await axios.post(
// //         'http://localhost:3001/generate-image',
// //         { bytecode: bytecode },
// //         { responseType: 'arraybuffer' }
// //       );

// //       if (response.data) {
// //         const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
// //         setRgbImage(base64Image);
// //       } else {
// //         console.error('Server returned an error:', response.statusText);
// //       }
// //     } catch (error) {
// //       console.error('Error during image generation:', error);
// //     }
// //   };

// //   const saveToFile = () => {
// //     // Set the loading state to true
// //     setSavingFile(true);

// //     axios.post('http://localhost:3001/save-file', { fileName, fileContent, email: userEmail })
// //       .then(response => {
// //         console.log('File saved successfully:', response.data);
// //         // Reset the loading state
// //         setSavingFile(false);
// //       })
// //       .catch(error => {
// //         console.error('Error saving file:', error);
// //         // Handle the error and reset the loading state
// //         setSavingFile(false);
// //         // Show an error notification to the user
// //         // You can use a library like react-toastify for this purpose
// //       });
// //   };

// //   const handleCreateProjectClick = () => {
// //     setCreatingProject(!creatingProject);
// //   };

// //   return (
// //     <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
// //       <div className="container p-4 rounded" style={{ maxWidth: '800px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
// //         <h2 className="mb-4 text-primary text-center">Home Component</h2>

// //         {creatingProject ? (
// //           <div>
// //             <h3 className="mb-3 text-info text-center">Create New Project</h3>

// //             {/* Additional UI for creating a new project */}
// //             <div className="mb-3">
// //               <input type="file" onChange={handleFileChange} className="form-control-file" />
// //             </div>
// //             {fileName && <p className="mb-3 text-success text-center">Selected File: {fileName}</p>}
// //             {fileContent && (
// //               <div>
// //                 <h3 className="mb-3 text-info text-center">Monaco Editor</h3>
// //                 <MonacoEditor
// //                   width="100%"
// //                   height="400"
// //                   language="javascript"
// //                   theme="vs-dark"
// //                   value={fileContent}
// //                   onChange={newContent => setFileContent(newContent)}
// //                 />
// //                 <div className="d-flex justify-content-between mt-3">
// //                   <button onClick={handleCompileClick} className="btn btn-primary">
// //                     Compile Code
// //                   </button>
// //                   <button onClick={handleGenerateImageClick} className="btn btn-success">
// //                     Generate Image
// //                   </button>
// //                   <button onClick={saveToFile} className="btn btn-info" disabled={savingFile}>
// //                     {savingFile ? 'Saving...' : 'Save to File'}
// //                   </button>
// //                 </div>
// //                 {bytecode && (
// //                   <div className="mt-3">
// //                     <h4 className="mb-3 text-info text-center">Bytecode</h4>
// //                     <pre>{bytecode}</pre>
// //                   </div>
// //                 )}
// //                 {rgbImage && (
// //                   <div className="mt-3 text-center">
// //                     <h4 className="mb-3 text-success text-center">RGB Image</h4>
// //                     <img
// //                       src={`data:image/png;base64,${rgbImage}`}
// //                       alt="RGB Image"
// //                       style={{ width: '25%', height: 'auto' }}
// //                       className="mx-auto"
// //                     />
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Add a button to exit the new project creation mode */}
// //             <button onClick={handleCreateProjectClick} className="btn btn-warning mt-3">
// //               Cancel
// //             </button>
// //           </div>
// //         ) : (
// //           <div>
// //             {/* Existing UI for the default mode */}
// //             <button onClick={handleCreateProjectClick} className="btn btn-warning mt-3">
// //               Create New Project
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;


























// //working one 
// // import React, { useState } from 'react';
// // import MonacoEditor from 'react-monaco-editor';
// // import axios from 'axios';

// // function Home() {
// //   const [fileContent, setFileContent] = useState('');
// //   const [fileName, setFileName] = useState('');
// //   const [bytecode, setBytecode] = useState('');
// //   const [rgbImage, setRgbImage] = useState('');

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];

// //     if (file) {
// //       setFileName(file.name);

// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         setFileContent(event.target.result);
// //       };

// //       reader.readAsText(file);
// //     }
// //   };

// //   const handleCompileClick = async () => {
// //     try {
// //       const response = await fetch('http://localhost:3001/compile', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           fileName: fileName,
// //           fileContent: fileContent,
// //         }),
// //       });

// //       if (response.ok) {
// //         const result = await response.json();
// //         setBytecode(result.bytecode);
// //       } else {
// //         console.error('Server returned an error:', response.statusText);
// //       }
// //     } catch (error) {
// //       console.error('Error during compilation:', error);
// //     }
// //   };

// //   const handleGenerateImageClick = async () => {
// //     try {
// //       const response = await axios.post(
// //         'http://localhost:3001/generate-image',
// //         { bytecode: bytecode },
// //         { responseType: 'arraybuffer' }
// //       );

// //       if (response.data) {
// //         const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
// //         setRgbImage(base64Image);
// //       } else {
// //         console.error('Server returned an error:', response.statusText);
// //       }
// //     } catch (error) {
// //       console.error('Error during image generation:', error);
// //     }
// //   };

// //   const saveToFile = () => {
// //     axios.post('http://localhost:3001/save-file', { fileName, fileContent })
// //       .then(response => {
// //         console.log('File saved successfully:', response.data);
// //       })
// //       .catch(error => {
// //         console.error('Error saving file:', error);
// //       });
// //   };

// //   return (
// //     <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
// //       <div className="container p-4 rounded" style={{ maxWidth: '800px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
// //         <h2 className="mb-4 text-primary text-center">Home Component</h2>
// //         <div className="mb-3">
// //           <input type="file" onChange={handleFileChange} className="form-control-file" />
// //         </div>
// //         {fileName && <p className="mb-3 text-success text-center">Selected File: {fileName}</p>}
// //         {fileContent && (
// //           <div>
// //             <h3 className="mb-3 text-info text-center">Monaco Editor</h3>
// //             <MonacoEditor
// //               width="100%"
// //               height="400"
// //               language="javascript"
// //               theme="vs-dark"
// //               value={fileContent}
// //               onChange={newContent => setFileContent(newContent)}
// //             />
// //             <div className="d-flex justify-content-between mt-3">
// //               <button onClick={handleCompileClick} className="btn btn-primary">
// //                 Compile Code
// //               </button>
// //               <button onClick={handleGenerateImageClick} className="btn btn-success">
// //                 Generate Image
// //               </button>
// //               <button onClick={saveToFile} className="btn btn-info">
// //                 Save to File
// //               </button>
// //             </div>
// //             {bytecode && (
// //               <div className="mt-3">
// //                 <h4 className="mb-3 text-info text-center">Bytecode</h4>
// //                 <pre>{bytecode}</pre>
// //               </div>
// //             )}
// //             {rgbImage && (
// //               <div className="mt-3 text-center">
// //                 <h4 className="mb-3 text-success text-center">RGB Image</h4>
// //                 <img
// //                   src={`data:image/png;base64,${rgbImage}`}
// //                   alt="RGB Image"
// //                   style={{ width: '25%', height: 'auto' }}
// //                   className="mx-auto"
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;







