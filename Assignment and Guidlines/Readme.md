<img src="https://webassets.telerikacademy.com/images/default-source/logos/telerik-academy.svg" alt="logo" width="300px" style="margin-top: 20px;"/>

# Between the Pages API

### 1. Description

Avant Garde Library is an Application, where the users can borrow and return books, rate them, write a review about a book they have borrowed, read all the reviews about a book and rate the reviews.

The files of the app are split into two parts - backend API application and front-end client application. First we will intoduce you to the backend part.

<br>

### 2. Project information

- Language and version: **JavaScript ES2020**
- Platform and version: **Node 14.0+**
- Core Packages: **Express**, **ESLint**

<br>

### 3. Server npm packages setup

In order to run the application you will need to set it up. You will be working in the `server` folder. This will be designated as the **root** folder, where `package.json` is placed.

You need to install all the packages in the root folder: `npm i`.

The project can be run in two ways:

- `npm start` - will run the current version of the code and will **not** reflect any changes done to the code until this command is executed again
- `npm run start:dev` - will run the code in *development* mode, meaning every change done to the code will trigger the program to restart and reflect the changes made

<br>

### 4. Server-side project structure

The main part of the server-side code is in `server/src`:

- `src/index.js` - the entry point of the project
- `src/config.js` - configurations for the app deployments
- `src/auth` - contains all authentication setup and middleware
- `src/common` - contains all constrants and enums
- `src/controller` - where all controller logic is
- `src/data` - contains the connection settings and functions for CRUD over todos in the database
- `src/middleware` - contains all custom middleware
- `src/services` - where all services are
- `src/validators` - contains objects for validating body/query objects

<br>

### 5. Setup MySQL Workbench

We will be using **MySQL Workbench** for storing the data. If you don't have it installed, please do so. You mcan use the following link **[MySQL Workbench](https://www.mysql.com/products/workbench/)**.

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

#### **Private part** - accessible for registered users only:
- `/books` - GET - Get all books
- `/books/:id` - GET - Get a single book by id
- `/books/:id/rate` - GET - Get total rating by book id
- `/books` - POST - Create a book
- `/books/:id/records` - POST - Borrow a book by id
- `/books/:id/rate` - POST - Rate a book by id
- `/books/:id/rate` - PUT - Update rating by book id and user id
- `/books/:id` - PUT - Update book by id
- `/books/:id/records` - PUT - Return a book
- `/books/:id` - DELETE - Delete book by id
- `/rate` - GET - Get all rated books
- `/books/:id/reviews` - GET - Get all reviews by book id
- `/books/:id/reviews` - POST - Create review 
- `/books/:id/review/:reviewId` - PUT - Update review by id
- `/books/:id/reviews/:reviewId/delete` - PUT - Delete review by id
- `/reviews/:id/likes` - GET - Get all likes for a review
- `/reviews:id/dislikes` - GET - Get all dislikes for a review
- `/reviews/:id/like` -  POST - Like a review
- `/reviews/:id/dislike` - POST - Dislike a review

#### Functionalities accessible only for admin users
- `/records` - GET - Get all records
- `/books` - GET - Get all books
- `/reviews` -  GET - Get all reviews
- `/users` - GET - Get all users
- `/banned` - GET - Get all banned users
- `/users/:id` - GET - Get a single user by id
- `/users/:id/ban` - POST - Ban a user
- `/users/:id` - PUT - Update user
- `/users/:id` - DELETE - Remove user

<br>

### 9. Client npm packages setup

In order to run the front-ebd of the application you will need to set it up. You will be working in the `client` folder. This will be designated as the **root** folder, where `package.json` is placed.

You need to install all the packages in the root folder: `npm i`.

To run the front-end in the project directory, you can run: 
#### `npm start`

Thee app will be run in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

<br>

### 10. Front-end project structure

The main part of the client-side code is in `client/src`.

- `common` - contains all constrants
- `components` - contains all the components
- `provider` - context provider which state to be shared across components
- `App.css` - contains the main css
- `App.js` - navigates to the components
- `index.js` - the entry point of the project

The `component` folder contains folders with components:

- `Auth` - This holds the authentication components: `Login` and `SignIn`
- `Base` - This holds the base components: `Footer` and `Header`
- `BookRecords` - This holds the `BookRecords` component
- `Books` - This holds the `book` **feature** components: `AllBooks`, `BookDetails`, `BookRate`, `BooksRatedByUser`, `BooksWithHighestRating`, `CreateBook`, `EditBook` and `Book` components
- `Pages` - This holdс the non-feature related *page* components: `AoutUs`, `AppError`, `Errors`, `Home`, `Loading` and `SuccessForm`
- `Reviews` - This holds the `review` **feature** components: `CreateReview`, `LoadedReviews`, `AllReviews`, `EditReview`, `ReviewsByBook` and `Vote` components
- `Users` - This holds the `user` **feature** components: `AllUsers`, `EditUser`, `EditUserSuccess`, `UserAccount` and `UserOverlay` components

If we had any other features (i.e. boards, users, etc.) they would go in separate feature folders.

<br>