<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Barbershop App - Features</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f9;
      color: #333;
    }
    header {
      background: #007bff;
      color: white;
      padding: 20px 10px;
      text-align: center;
    }
    .container {
      width: 80%;
      margin: 20px auto;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1, h2 {
      color: #007bff;
    }
    ul {
      margin: 0;
      padding: 0 20px;
      list-style: none;
    }
    ul li {
      margin-bottom: 10px;
    }
    footer {
      background: #007bff;
      color: white;
      text-align: center;
      padding: 10px 0;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <header>
    <h1>Barbershop App</h1>
    <p>Technologies Used & User Functionalities</p>
  </header>
  <div class="container">
    <h2>Technologies Used</h2>
    <ul>
      <li>Frontend: React.js, TypeScript</li>
      <li>Backend: Node.js, Express.js</li>
      <li>Database: MongoDB</li>
      <li>API Security: JWT (JSON Web Tokens)</li>
      <li>Hosting : Vercel</li>
    </ul>

    <h2>Functionalities by User Role</h2>
    <h3>Customer</h3>
    <ul>
      <li>Create an account and log in (via email/password).</li>
      <li>View available barbers, services, and prices.</li>
      <li>Book an appointment with a selected barber and service(s).</li>
      <li>Add comments to specify any preferences for the appointment.</li>
      <li>Cancel an appointment before a specified time.</li>
    </ul>

    <h3>Barber</h3>
    <ul>
      <li>View and manage appointments assigned to them.</li>
      <li>Update the status of an appointment (completed).</li>
      <li>Update their portfolio with images showcasing their work.</li>
    </ul>

    <h3>Owner</h3>
    <ul>
      <li>Create and manage barbershop details (services, barbers).</li>
      <li>Add or remove barbers from their barbershop.</li>
      <li>Add, update, or delete services offered by the barbershop.</li>
      <li>View all appointments.</li>
      <li>Change the schedule of the barbers</li>
    </ul>
  </div>
  <footer>
    <p>Barbershop App &copy; 2024</p>
  </footer>
</body>
</html>
