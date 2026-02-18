export function processData(rawData) {
    const parseDate = d3.timeParse("%Y-%m-%d");
    rawData.forEach(d => {
        d.date = parseDate(d.date);
        d.year = d.date.getFullYear();
        d.month = d.date.getMonth(); 
        d.day = d.date.getDate();
        d.max = +d.max_temperature;
        d.min = +d.min_temperature;
    });

    const latestYear = d3.max(rawData, d => d.year);
    const cutoffYear = latestYear - 9;
    const filtered = rawData.filter(d => d.year >= cutoffYear);
    const grouped = d3.groups(filtered, d => d.year, d => d.month);
    const structured = [];
    grouped.forEach(([year, months]) => {
        months.forEach(([month, values]) => {
            const maxMonthly = d3.max(values, d => d.max);
            const minMonthly = d3.min(values, d => d.min);
            structured.push({
                year,
                month,
                maxMonthly,
                minMonthly,
                daily: values
            });
        });
    });
    return structured;
}
