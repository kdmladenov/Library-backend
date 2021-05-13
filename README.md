~~~~<img src="https://webassets.telerikacademy.com/images/default-source/logos/telerik-academy.svg" alt="logo" width="300px" style="margin-top: 20px;"/>

# Between the Pages API

### 1. Description

Between the Pages Library is a Full Stack Single Page Application, where the users can read, borrow and return books, rate them, write reviews about a book they have borrowed, read  the reviews about a book and rate the reviews.

The files of the app are split into two parts - backend API application and front-end client application. First we will introduce you to the backend part.

<br>

### 2. Project information

- Language and version: **JavaScript ES2020**
- Platform and version: **Node 14.0+**
- Core Packages: **Express**, **ESLint**
- Styling libraries: **Bootstrap**
- Database: **MariDB**

<br>

### 3. Server (Back-end) npm packages setup
The main server application git folder is located here https://gitlab.com/DelyanaYo/end-to-end-project.git
In order to run the application you will need to set it up. You will be working in the `api` folder. This will be designated as the **root** folder, where `package.json` is placed.

You need to install all the packages in the root folder: `npm i`.

The project can be run in two ways:

- `npm start` - will run the current version of the code and will **not** reflect any changes done to the code until this command is executed again
- `npm run start:dev` - will run the code in *development* mode, meaning every change done to the code will trigger the program to restart and reflect the changes made

<br>

### 4. Server-side project structure

The main part of the server-side code is in `api/src`:

- `src/index.js` - the entry point of the project
- `src/authentication` - contains all authentication setup and middleware
- `src/common` - contains all enums, constraints and error messages
- `src/controllers` - where all controller logic is
- `src/data` - contains the connection settings and functions for CRUD  in the database
- `src/middleware` - contains all custom middleware
- `src/services` - where all service files are
- `src/validator` - contains objects for validating body/query objects

<br>

### 5. Setup MySQL Workbench

We will be using **MySQL Workbench** for storing the data. If you don't have it installed, please do so. You can use the following link **[MySQL Workbench](https://www.mysql.com/products/workbench/)**.

We have provided you with the database which you can import in your MySQL Workbench - please use `library.sql` for the import. 

After you connect to the database `"library"` and examine the major tables, you can use the database for all tasks.

### 6. Dotenv

You will be using dotenv to help manage your environment variables. The **.env** file is stored in your .gitignore file.
You will have to create it in the **root** folder, where `package.json` is placed, as a separate file. 

You can use the following content for your **.env** file. Keep in mind that you might need to replace `USER` and `PASSWORD` with the ones you have set in your `MySQL Workbench`. Also make sure that `DATABASE` name corresponds to the one with the data you will be using to run the application.

```
PORT=5555
HOST=localhost
DBPORT=3306
USER=root
PASSWORD=root
DATABASE=library
PRIVATE_KEY=sekreten_chasten_klu4
TOKEN_LIFETIME=360000
DEFAULT_USER_ROLE=basic
```

<br>

### 7. Working with Postman

**Postman** is a great tool for testing the API you will be running. In order to test the api you can use the **[Postman](https://www.getpostman.com/downloads/)** tool. You can **test the API** for the different tasks and cases.

<br>

### 8. Endpoints with corresponding functionalities

When testing the application you can use the following endpoins in **Postman**:

#### **Public part** - accessible without authentication:

- `/users` - POST - User Registration
- `/auth/login` - POST - User Login
- `/auth/logout` - DELETE - User Logout
- `/users` - POST - Register a user  
- 

#### **Private part** - accessible for registered users only:
- `/books` - GET - Get all books
- `/books?search=` - GET - Get all books by a search criteria
- `/books?searchBy` - GET - Get all books with search in a specific column
- `/books?sort` - GET - Get all books with sort in a specific column 
- `/books?order` - GET - Get all books with sorted in a specific order
- `/books?pageSize` - GET - Get books with limit to a certain results per page
- `/books?page` - GET - Get books with limit and also a specific page number
- `/books` - POST - crate a book
- `/books/:bookId` - DELETE - Delete book by id
- `/books/:bookId` - GET - Get a single book by id or ISBN number
- `/books/:bookId` - PUT - Edit/Change a single book 
- `/books/:bookId/reviews` - GET - Get all reviews by book id
- `/books/:bookId/reviews` - POST - Create review 
- `/books/:bookId/records` - POST - Borrow a book by id
- `/books/:bookId/records` - DELETE - Return a book by id
- `/books/:bookId/cover` - PUT - Upload a book cover by id
- `/books//public/:type` - GET - Get a for public (limited) use books New Releases, Top Rated, Most Popular

- `/records` - GET - Return all book history with all borrowings with detailed information
- `/records?search=` - GET - Get all books history by a search criteria
- `/records?searchBy` - GET - Get all books history with search in a specific column
- `/records?sort` - GET - Get all books history with sort in a specific column 
- `/records?order` - GET - Get all books history with sorted in a specific order
- `/records?pageSize` - GET - Get books history with limit to a certain results per page
- `/records?page` - GET - Get books history with limit and also a specific page number

- `/reviews/:reviewId` - GET - Get a review by id
- `/reviews/:reviewId` - PATCH - Update a review
- `/reviews/:reviewId` - DELETE - Delete a review
- `/reviews/:reviewId/vote` - PUT - Like or dislike a review
- `/reviews/:reviewId/vote` - DELETE - unLike or unDislike a review

- `/users` - GET - Get all users user 
- `/users?search=` - GET - Get all users by a search criteria
- `/users?searchBy` - GET - Get all users with search in a specific column
- `/users?sort` - GET - Get all users with sort in a specific column 
- `/users?order` - GET - Get all users with sorted in a specific order
- `/users?pageSize` - GET - Get users with limit to a certain results per page
- `/users?page` - GET - Get users with limit and also a specific page number
- `/users/:userId/timeline` - GET - Get all of the info regarding book borrowings, returns, review grouped in  a timeline
- `/users/:userId/timeline` - PUT - Upload the a user avatar 
- `/users/:userId/timeline` - GET - Retrieve a specific user avatar 
- `/users/:userId/timeline` - DELETE - Delete a specific user avatar 
- `/users/:userId` - GET - Get a specific user  
- `/users/:userId/change-password` - PATCH - Change a specific user's password
- `/users/:userId/edit-profile` - PUT - Update/Edit a specific user's profile info
- `/users/:userId/edit-profile` - DELETE - Delete a specific user's profile
- `/users/:userId/ban` - POST - Ban a specific user

<br>

### 9. Front-end (client side) npm packages setup

The main application front-end git folder is located here https://gitlab.com/DelyanaYo/library-frontend.git
In order to run the front-ebd of the application you will need to set it up. You will be working in the `library` folder. This will be designated as the **root** folder, where `package.json` is placed.

You need to install all the packages in the root folder: `npm i`.

To run the front-end in the project directory, you can run: 
#### `npm start`

Thee app will be run in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


<br>

### 10. Front-end project structure

The main part of the client-side code is in `library/src`.

- `common` - contains all constants and enums 
- `components` - contains all the components of the project
- `containers` - contains all the main book and user containers of the project
- `hooks` - contains some custom hooks
- `providers` - context provider which state to be shared across components
- `App.js` - navigates to the components
- `index.js` - the entry point of the project

The `component` folder contains folders with components:

- `Admin` - This holds the admin level components: `BanUser`, `BookForm`,`CreateBook`,`CreateBookValidator`,`UpdateBook` and `UserCard`
- `Books` - This holds the `book` **feature** components: `BookCard`, `BookCardDetailed`, `BookCarousel`, `PropCard`
- `Footer` - This holds the `Footer` component.
- `Forms` - This holds the form related components `Login`, `Register`, `UserValidator`  and a `form-components` containing `BasicInput` ,`Email` ,`Name` ,`Password` ,`RememberCredentialsCheckBox` and `SubmitBtn` 
- `Header` - This holds the `Header` component.
- `Home` - This holds the `Home` component.
- `Paging` - This holds the `Paging` component.
- `Reviews` - This holds the `ReviewCard` and `ReviewList` component.
- `Search` - This holds the `Search` component.
- `Sort` - This holds the `Sort` component.
- `StaticPages` - This holds the non-feature related components: `Forbidden`, `Logout`, `NotFound` and `ServiceUnavailable`
- `TermsAndPolicy` - This holds the `TermsAndPolicy` component.
- `UI` - This holds the UI related components: `BookCardRating`, `DropDown`, `Loading` and `ShowMoreButton`
- `User` - This holds the User related components: `ChangePassword`, `UserNavigation`,`DeleteAccount`, `Profile` and `Timeline`
- `Containers` - This holds the `User` folder with the following components: `UserContainer` and `Users`,
and the `Book` folder with the following components: `Books` and `IndividualBook`,
- `hooks` - This holds the `useHttp` component.
- `providers` - This holds the `AuthContext` and `GuardedRoute` component

<br>