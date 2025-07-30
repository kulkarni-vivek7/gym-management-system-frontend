# Gym Management System FrontEnd Using AI Tools

### This is a Gym Management System FrontEnd Project Using AI Tools to Enhance the User Experience and also to reduce the development time and maintaining reponsiveness behaviour in the UI.

## AI Tools Used:
I have used various AI tools to improve the functionality and user experience of the Gym Management System and also for code snippet generation and auto-code completion. Some of the AI tools used are:

* **[ChatGPT](https://chatgpt.com/)**
* **[Perplexity AI](https://www.perplexity.ai/)**
* **Cursor AI Modals Like gpt-4.1, gemini-2.5-flash and claude-4-sonnet**

## List Of Softwares And Technologies Used:
* **[Cursor AI Code Editor](https://cursor.com/downloads)** - This is a code editor that uses AI to generate code snippets and auto-complete code.
* **[React + vite + TypeScript](https://vite.dev/guide/)** - Iam Using React Js And TypeScript with Vite Development Tool to enhance the performance and speed of the application.
* **[TailWind CSS](https://tailwindcss.com/docs/installation/using-vite)** - This is a utility-first CSS framework that Iam using to design the UI of the application and by using this only Iam Maintaining responsiveness in my UI.
* **[Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)** - This is a State Manegement Tool that Iam using to store the encrypted JWT, email and name of the user that logs in everytime and to get the stored the values in redux store whereever it is needed.
* **[Axios](https://www.npmjs.com/package/axios)** - This is a HTTP client that Iam using to make API calls to the backend server and to get the data from the backend server.
* **[MUI](https://mui.com/material-ui/material-icons/)** - This is a Material UI library that Iam using to design the UI of the application and to get the icons that Iam using in the application.
* **[ZOD Form Validator](https://zod.dev/)** - This is a Form Validator library that Iam using to validate the form data before sending it to the backend server.

## Features:
* **Admin Register**
* **Send OTP To Registered Email**
* **User Login With Registered Email And OTP**
* **Admin Home Page**
* **Update Admin Operation**
* **Add Membership**
* **View All Active and Inactive Memberships**
* **Delete Inactive Membership**
* **Search Memberships By SearchParam and SearchValue**
* **Add Trainer**
* **View All Active and Inactive Trainers**
* **Delete Inactive Trainer**
* **Search Trainers By SearchParam and SearchValue**
* **Add Member**
* **View All Active and Inactive Members**
* **Delete Inactive Member**
* **Search Members By SearchParam and SearchValue**
* **View All Registered Members for a perticular Trainer**

## Key Points:
* After Successfull Login, The JWT Token Returned from the backend api call as result will be stored in the redux store after encrypting it using the **CryptoJS** library. (refer **cryptoUtils.ts** file for more details).

* Whenever we are making any api call to the backend server, first we will decrypt the jwt and then pass the decrypted jwt as a Authorization header to the backend server.