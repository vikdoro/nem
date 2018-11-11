onmessage = function (e) {
    console.log('Message received from main script', e.data);
    const functionName = e.data[0];
    const columns = e.data[1];
    const rows = e.data[2];
    const incomeHeader = e.data[3];
    const headers = e.data[4];
    const summarizerMode = e.data[5];
    if (functionName === 'run') {
        run(columns, rows, incomeHeader, headers, summarizerMode);
    }
}

function run(columns, rows, incomeHeader, headers, summarizerMode) {
    console.log('run in worker STARTED');
        let totalRevenue = 0;
        columns.forEach((column, columnIndex) => {
            column.value = 0;
            headers.push(column.label);
            if (summarizerMode) {
                headers.unshift(`${column.label}-total`);
            }
            if (!column.simple) {

                // Run plots for each row
                rows.forEach((row, rowIndex) => {
                    let candidate;
                    // empty value for cell before calculating
                    rows[rowIndex][column.label] = '';
                    if (summarizerMode) {
                        // empty column under the summarizer header
                        rows[rowIndex][`${column.label}-total`] = null;
                    }
                    // Calculating total revenue
                    totalRevenue += rows[rowIndex][incomeHeader];
                    if (column.plots) {
                        for (const [plotIndex, plot] of column.plots.entries()) {
                            if (runPlot(plot.conditions,row)) {
                                let plotString = 'return ';
                                let segments = plot.segments;
                                for (let i = 0; i < segments.length; i += 1) {
                                    plotString += segments[i].tableValue ?
                                        row[segments[i].label] : segments[i].label;
                                    plotString += ' ';
                                }
                                const runComputeReturn = new Function(plotString);
                                console.log('commmmmp', plotString)
                                candidate = runComputeReturn();
                                break;
                            }
                        };
                    }
                    // candidate doesn't have value after looping through the plots, use the default segments
                    // not in summerizerMode, where there are no default segments
                    if (!summarizerMode && typeof candidate === 'undefined') {
                        let plotString = 'return ';
                        let segments = column.defaultSegments;
                        for (let i = 0; i < segments.length; i += 1) {
                            plotString += segments[i].tableValue ?
                                row[segments[i].label] : segments[i].label;
                            plotString += ' ';
                        }
                        const runComputeReturn = new Function(plotString);
                        candidate = runComputeReturn();
                    }

                    if (typeof candidate !== 'undefined' && _isNumber(candidate)) {
                        rows[rowIndex][column.label] = candidate;
                        column.value = column.value + candidate;
                    }
                    
                });
                // Simple percentage case
            } else {
                rows.forEach((row, rowIndex) => {
                    const candidate = rows[rowIndex][incomeHeader] * (parseInt(column.simpleValue) / 100);
                    if (!_isNumber(candidate)) {
                        console.log('Income field is not a number');
                        return;
                    }
                    totalRevenue += rows[rowIndex][incomeHeader];
                    rows[rowIndex][column.label] = candidate;
                    column.value = column.value + candidate;
                });
            }
            // Put total value of summarizer columns in the table
            if (summarizerMode) {
                console.log('puttin this total', column.value);
                rows[0][`${column.label}-total`] = column.value;
            }
        });
        console.log('this.headers', headers);
        console.log('this.rows', rows);
        this.postMessage(['calculationComplete', {headers, rows}, columns, totalRevenue]);

    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    }
}

function runPlot(conditions, row) {
    // Set the boolean flag for each condition
    conditions.forEach((condition) => {
        if (condition.x.tableValue) {
            // Iterate through field keys in a row, and set the condition x value
            Object.keys(row).forEach(fieldKey => {
                if (fieldKey === condition.x.label) {
                    condition.x.val = row[fieldKey];
                }
            });
            condition.flag = runCondition(condition);
        }
    });

    // Evaluate the string of conditions as an expression (output will be Boolean)
    let plotString = 'return ';
    for (let i = 0; i < conditions.length; i += 1) {
        plotString += conditions[i].x.tableValue ?
            conditions[i].flag : mapSimpleValue(conditions[i].simpleValue);
        plotString += ' ';
    }
    const runFunction = new Function(plotString);
    return runFunction();
}

function runCondition(condition) {
    let x = condition.x && condition.x.val;
    let y = condition.y && condition.y.val;
    let operator = condition.operator && condition.operator.label;
    if (typeof operator === 'undefined',
        typeof x === 'undefined',
        typeof y === 'undefined') {
        return;
    }
    switch (operator) {
        case '=':
            return x === y;
            break;
        case '≠':
            return x !== y;
            break;
        case '<':
            return x < y;
            break;
        case '>':
            return x > y;
            break;
        default:
            return false;
    }
}


function mapSimpleValue(label) {
    const map = {
        'and': '&&',
        'or': '||'
    };
    return map[label] || label;
}
