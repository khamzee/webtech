Travel Agency Web Application


This web application, titled "Dream Voyage," is a simple travel agency platform that allows users to explore and book tours to various destinations. The project includes a front-end interface with HTML, CSS, and Bootstrap, a back-end server using Node.js and Express, and integration with external APIs for weather information.

Features:

Homepage (index.html):

Display of available tour destinations with images, titles, and costs.
Responsive navigation bar with links for easy navigation.

Travel Agency Booking (travelagency.html):

Form for users to book a tour, including options for selecting a destination, hotel, car rental, arrival and departure dates, and the number of adults and children.
Integration with the OpenWeatherMap API to provide real-time weather information for the selected destination.
Responsive design for a pleasant user experience.

Tour History (history.html):

Display of a history list with details of booked tours, including destination, hotel, car rental, dates, number of adults and children, tour cost, weather, and timestamp.
Buttons to edit or delete each tour entry.
Total cost calculation for all tours.

Server (server.js):

Node.js server using Express for handling routes and requests.
Integration with external APIs (OpenWeatherMap) for weather information.
CRUD operations for managing tour history.
Calculation of the total cost of booked tours.

Routes (travelRoutes.js):

Express router handling routes related to the travel agency, including booking, editing, deleting, and viewing tour history.

How to Run:

Clone the repository:

git clone https://github.com/your-username/travel-agency-web.git

Install dependencies:

cd travel-agency-web

npm install

Start the server:

node server.js

Open the application in your browser:

http://localhost:3000

Dependencies:

Express: Web application framework for Node.js
Axios: Promise-based HTTP client for making API requests
Bootstrap: Front-end framework for responsive design
Body-parser: Middleware for handling HTTP request data
Path: Module for working with file and directory paths

Note:

This is a simple project for educational purposes and can be extended with additional features and improvements.
Feel free to contribute by adding new functionalities, enhancing the UI, or fixing any issues.

Author:
Khamze Daniyar
