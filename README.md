# Newton-Raphson Solver

An interactive web application that solves mathematical equations using the **Newton-Raphson Numerical Method**.

The application allows users to enter different mathematical functions, specify an initial guess, and calculate approximate roots automatically. It also displays detailed iteration results and visualizes the function using an interactive graph.

## Features

- **Flexible Equation Input:** Enter different mathematical equations.
- **Automatic Differentiation:** Calculate the first derivative automatically.
- **Newton-Raphson Algorithm:** Find approximate roots using iterative calculations.
- **Iteration Table:** Display each iteration with its calculated values.
- **Error Calculation:** Calculate the approximate error at each iteration.
- **Interactive Graph:** Visualize the function and its approximate root.
- **Convergence Status:** Show whether the method successfully converged.
- **Input Validation:** Handle invalid inputs and mathematical errors.
- **Responsive Design:** Works on desktop and mobile devices.

## Technologies Used

- HTML5 – Structure of the application.
- CSS3 – Styling and responsive design.
- JavaScript – Numerical calculations and application logic.
- Math.js – Mathematical expression evaluation and symbolic differentiation.
- Chart.js – Function graph visualization.

## Newton-Raphson Formula

The application uses the following iterative formula:

\[
x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}
\]

The process continues until the approximate error reaches the specified tolerance or the maximum number of iterations is reached.

## How to Use

1. Open the application in your web browser.
2. Enter a mathematical equation (e.g., `x^3 - x - 2`).
3. Enter the initial guess.
4. Set the desired tolerance.
5. Specify the maximum number of iterations.
6. Click **Calculate Solution**.
7. View the approximate root, iteration table, error values, and function graph.

## Example

**Input:**

- Function: `x^3 - x - 2`
- Initial Guess: `1.5`
- Tolerance: `0.0001`
- Maximum Iterations: `100`

**Expected Result:**

Approximate Root: `1.5213797`

## Project Structure

```text
Newton-Raphson-Solver/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Run `index.html` using Live Server.
4. Make sure you have an active internet connection to load the external libraries.

## Project Information

**Project Name:** Newton-Raphson Solver

**Subject:** Numerical Methods

**Project Type:** Web Application

**Developed Using:** HTML, CSS, and JavaScript

---

Developed as an academic project to demonstrate the practical implementation of the Newton-Raphson numerical method.
