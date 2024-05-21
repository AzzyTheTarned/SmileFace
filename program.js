const WIDTH = 600;
const HEIGHT = 600;
const CX = 300;
const CY = 300;
const SCALEX = 1;
const SCALEY = 1;
const ROTATE = 0;


let svg = d3.select("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

function drawSmile() {
    let smile = svg.append('g')
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "black");

    smile.append('circle')
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 50)
        .style("fill", "green");

    smile.append('circle')
        .attr("cx", -20)
        .attr("cy", -10)
        .attr("r", 5);

    smile.append('circle')
        .attr("cx", 20)
        .attr("cy", -10)
        .attr("r", 5);

    let arc = d3.arc()
        .innerRadius(35)
        .outerRadius(35);

    smile.append("path")
        .attr("d", arc({
            startAngle: Math.PI / 3 * 2,
            endAngle: Math.PI / 3 * 4
        }))
        .style("stroke", "black");

    smile.append('rect')
        .attr("x", -25)
        .attr("y", 50)
        .attr("width", 50)
        .attr("height", 10)
        .style("fill", "blue");

    smile.append('line')
        .attr("x1", -25)
        .attr("y1", 60)
        .attr("x2", -35)
        .attr("y2", 70)
        .style("stroke", "black");

    smile.append('line')
        .attr("x1", 25)
        .attr("y1", 60)
        .attr("x2", 35)
        .attr("y2", 70)
        .style("stroke", "black");

    return smile;
}

let animate = (dataForm) => {
    let pict = drawSmile();
    pict.attr("transform", `translate(${CX}, ${CY}) scale(${SCALEX}, ${SCALEY}) rotate(${ROTATE})`);
    let path = drawPath();
    pict.transition()
        .duration(dataForm.duration.value)
        .ease(d3.easeLinear)
        .attrTween("transform", translateAlong(path.node(), dataForm));
}


function translateAlong(path, dataForm) {
    const length = path.getTotalLength();
    return function () {
        return function (t) {
            const {
                x,
                y
            } = path.getPointAtLength(t * length);
            return `translate(${x-0},${y}) scale(${1 + t * (dataForm.scalex.value - 1)}, ${1 + t * (dataForm.scaley.value - 1)}) rotate(${0 + t * dataForm.rotation.value})`;
        }
    }
}

document.querySelector("input[value='Запустить']").addEventListener("click", () => {
    let dataForm = document.forms.setting;
    animate(dataForm);
})

document.querySelector("input[value='Очистить']").addEventListener("click", () => {
    svg.selectAll('*').remove();
})

function createPath() {
    let data = [];
    const R = WIDTH / 4;
    const r = WIDTH / 12;
    const step = 0.01;
    const angle = -0.53;

    for (let theta = -Math.PI / 2; theta <= 3 * Math.PI / 2; theta += step) {
        let x = (R + r) * Math.cos(theta) - r * Math.cos((R + r) / r * theta);
        let y = (R + r) * Math.sin(theta) - r * Math.sin((R + r) / r * theta);

        let xRotated = x * Math.cos(angle) + y * Math.sin(angle);
        let yRotated = -x * Math.sin(angle) + y * Math.cos(angle);


        data.push({ x: WIDTH / 2 + xRotated, y: HEIGHT / 2 + yRotated - 30 });
    }
    const startRatio = 0.92;
    return rearrangePath(data, startRatio);
}

function rearrangePath(data, startRatio) {
    const startIndex = Math.floor(data.length * startRatio);
    return data.slice(startIndex).concat(data.slice(0, startIndex));
}

let drawPath = () => {
    const dataPoints = createPath();
    const line = d3.line()
    .x((d) => d.x)
    .y((d) => d.y);
    const path = svg.append("path")
        .attr("d", line(dataPoints))
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("stroke", "none");

    return path;
}
