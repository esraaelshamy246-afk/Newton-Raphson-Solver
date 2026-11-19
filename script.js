
// ======================================
// 1. DOM ELEMENTS
// ======================================

const equationInput = document.getElementById("equation");
const initialGuessInput = document.getElementById("initialGuess");
const toleranceInput = document.getElementById("tolerance");
const iterationsInput = document.getElementById("iterations");

const solveBtn = document.getElementById("solveBtn");
const clearBtn = document.getElementById("clearBtn");

const message = document.getElementById("message");
const iterationTable = document.getElementById("iterationTable");

const rootResult = document.getElementById("rootResult");
const iterationResult = document.getElementById("iterationResult");
const errorResult = document.getElementById("errorResult");
const functionResult = document.getElementById("functionResult");
const statusResult = document.getElementById("statusResult");

let functionChart = null;


// ======================================
// 2. HELPER FUNCTIONS
// ======================================

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return "Undefined";
    }

    if (Math.abs(value) < 1e-12) {
        return "0";
    }

    return Number(value.toPrecision(9)).toString();
}


function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}


function evaluateFunction(compiledFunction, x) {
    const result = compiledFunction.evaluate({ x });

    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("The function produced an invalid value.");
    }

    return result;
}


// ======================================
// 3. NEWTON-RAPHSON METHOD
// ======================================

function newtonRaphson(f, df, x0, tolerance, maxIterations) {

    let currentX = x0;
    let error = null;

    const results = [];

    // Initial values
    let fx = evaluateFunction(f, currentX);
    let dfx = evaluateFunction(df, currentX);

    results.push({
        n: 0,
        x: currentX,
        fx: fx,
        dfx: dfx,
        error: null
    });

    // Check if the initial guess is already a root
    if (Math.abs(fx) <= tolerance) {
        return {
            root: currentX,
            iterations: 0,
            error: 0,
            fx: fx,
            converged: true,
            results: results
        };
    }

    // Iteration loop
    for (let i = 1; i <= maxIterations; i++) {

        // Avoid division by zero
        if (Math.abs(dfx) < 1e-14) {
            throw new Error(
                "The derivative is zero or too close to zero. Try another initial guess."
            );
        }

        // Newton-Raphson formula
        const nextX = currentX - (fx / dfx);

        if (!Number.isFinite(nextX)) {
            throw new Error("The calculation produced an invalid result.");
        }

        // Calculate absolute approximate error
        error = Math.abs(nextX - currentX);

        // Evaluate the new point
        const nextFx = evaluateFunction(f, nextX);
        const nextDfx = evaluateFunction(df, nextX);

        // Save iteration details
        results.push({
            n: i,
            x: nextX,
            fx: nextFx,
            dfx: nextDfx,
            error: error
        });

        // Update values
        currentX = nextX;
        fx = nextFx;
        dfx = nextDfx;

        // Check convergence
        if (error <= tolerance || Math.abs(fx) <= tolerance) {

            return {
                root: currentX,
                iterations: i,
                error: error,
                fx: fx,
                converged: true,
                results: results
            };
        }
    }

    // Maximum iterations reached
    return {
        root: currentX,
        iterations: maxIterations,
        error: error,
        fx: fx,
        converged: false,
        results: results
    };
}


// ======================================
// 4. DISPLAY RESULTS
// ======================================

function displayResults(result) {

    rootResult.textContent = formatNumber(result.root);

    iterationResult.textContent = result.iterations;

    errorResult.textContent = formatNumber(result.error);

    functionResult.textContent = formatNumber(result.fx);

    statusResult.textContent = result.converged
        ? "Converged Successfully"
        : "Maximum Iterations Reached";

    statusResult.style.color = result.converged
        ? "#159b70"
        : "#d94b62";

    // Clear old table
    iterationTable.innerHTML = "";

    // Add all iteration rows
    result.results.forEach(item => {

        const row = document.createElement("tr");

        const values = [
            item.n,
            formatNumber(item.x),
            formatNumber(item.fx),
            formatNumber(item.dfx),
            item.error === null
                ? "—"
                : formatNumber(item.error)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        iterationTable.appendChild(row);
    });

}


// ======================================
// 5. DRAW FUNCTION GRAPH
// ======================================

function drawGraph(compiledFunction, x0, root) {

    const center = (x0 + root) / 2;

    const span = Math.max(
        5,
        Math.abs(root - x0) * 1.5,
        Math.abs(center) * 0.5
    );

    const minX = center - span;
    const maxX = center + span;

    const points = [];

    // Generate graph points
    for (let i = 0; i <= 240; i++) {

        const x = minX + (maxX - minX) * i / 240;

        try {
            const y = evaluateFunction(compiledFunction, x);

            // Avoid extremely large graph values
            if (Math.abs(y) < 1e8) {
                points.push({ x, y });
            }

        } catch (error) {
            // Skip invalid points
        }
    }

    const ctx = document.getElementById("functionChart");

    // Destroy previous chart
    if (functionChart) {
        functionChart.destroy();
    }

    functionChart = new Chart(ctx, {

        type: "scatter",

        data: {
            datasets: [

                {
                    label: "f(x)",
                    data: points,
                    showLine: true,
                    borderColor: "#6656d9",
                    backgroundColor: "#6656d9",
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.15
                },

                {
                    label: "X Axis",
                    data: [
                        { x: minX, y: 0 },
                        { x: maxX, y: 0 }
                    ],
                    showLine: true,
                    borderColor: "#a5a5b5",
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0
                },

                {
                    label: "Approximate Root",
                    data:[
                       {
                         x: root,
                         y: evaluateFunction(compiledFunction, root)
                       }
                ],
                    backgroundColor: "#159b70",
                    borderColor: "#159b70",
                    pointRadius: 7,
                    pointHoverRadius: 10
                }

            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: true,

            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `x: ${formatNumber(context.parsed.x)}, y: ${formatNumber(context.parsed.y)}`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    type: "linear",
                    title: {
                        display: true,
                        text: "X"
                    }
                },

                y: {
                    type: "linear",
                    title: {
                        display: true,
                        text: "f(x)"
                    }
                }
            }
        }

    });

}


// ======================================
// 6. CALCULATE BUTTON
// ======================================

solveBtn.addEventListener("click", function() {

    try {

        const equation = equationInput.value.trim();

        const x0 = Number(initialGuessInput.value);

        const tolerance = Number(toleranceInput.value);

        const maxIterations = Number(iterationsInput.value);

        // Validate inputs
        if (!equation) {
            throw new Error("Please enter a mathematical equation.");
        }

        if (initialGuessInput.value.trim() === "" ||
            !Number.isFinite(x0)) {
            throw new Error("Please enter a valid initial guess.");
        }

        if (!Number.isFinite(tolerance) || tolerance <= 0) {
            throw new Error("Tolerance must be a positive number.");
        }

        if (
            iterationsInput.value.trim() === "" ||
            !Number.isInteger(maxIterations) ||
            maxIterations < 1 ||
            maxIterations > 1000
        ) {
            throw new Error("Maximum iterations must be an integer between 1 and 1000.");
        }

        // Compile the function
        const compiledFunction = math.compile(equation);

        // Calculate the symbolic derivative
        const derivative = math.derivative(equation, "x");

        const compiledDerivative = derivative.compile();

        // Apply Newton-Raphson method
        const result = newtonRaphson(
            compiledFunction,
            compiledDerivative,
            x0,
            tolerance,
            maxIterations
        );

        // Display results
        displayResults(result);

        // Draw graph
        drawGraph(compiledFunction, x0, result.root);

        if (result.converged) {
            showMessage(
                "Solution calculated successfully!",
                "success"
            );
        } else {
            showMessage(
                "Maximum iterations reached. The result may not have converged.",
                "error"
            );
        }

        // Scroll to results
        document.getElementById("results").scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        showMessage(error.message, "error");

    }

});


// ======================================
// 7. CLEAR BUTTON
// ======================================

clearBtn.addEventListener("click", function() {

    equationInput.value = "";
    initialGuessInput.value = "";

    toleranceInput.value = "0.0001";
    iterationsInput.value = "100";

    message.textContent = "";
    message.className = "message";

    rootResult.textContent = "—";
    iterationResult.textContent = "—";
    errorResult.textContent = "—";
    functionResult.textContent = "—";

    statusResult.textContent = "Waiting for calculation";
    statusResult.style.color = "";

    iterationTable.innerHTML = `
        <tr>
            <td colspan="5">No calculations yet.</td>
        </tr>
    `;

    // Remove old graph
    if (functionChart) {
        functionChart.destroy();
        functionChart = null;
    }

});