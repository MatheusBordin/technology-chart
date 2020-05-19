# Technology Chart
An technology radar chart implementation without any dependency inspired in Tought Works radar chart.
Built-in with TypeScript.
**Important**: Currently this library is in beta version. 

## Usage
This library is distributed by NPM (Node package manager). See the steps of installation and usage below.

### Install
```bash
npm i technology-chart
```

### Code implementation
The code implementation is simple and can be resumed in these steps:
- HTML preparation
- Configuration
- Initialization

##### HTML Preparation
This library is created using Canvas HTML5 API, so you need an canvas element to initialize the chart.

```html
<html>
    <head>
        [...]
        <!-- You can customize the canvas size with CSS -->
        <style>
            canvas#tech-radar {
                width: 400px;
                 /** By default, the canvas always be a square, using the maximum size [Math.max(width, height)]*/
            }
        </style>
    </head>
    <body>
        <!-- Add canvas element -->
        <canvas id="tech-radar"></canvas>
    </body>
</html>
```

##### Configuration
You should create an configuration object, used by TechnologyChart to create the chart inside canvas.
All options provided by configuration object can be found in API Section.

```javascript
const settings = {
    quadrants: ["Lang", "Data", "Frameworks", "Infra"], // Required
    rings: ["Adopt", "Trial", "Assess", "Hold"],
    data: [
        {
            quadrant: "Lang",
            ring: "Adopt",
            value: "TypeScript"
        }
    ]
}
```

##### Initialization
You prepare de canvas and de configuratio object, now we need pass they with argument of TechnologyChart.

```javascript
const canvas = document.getElementById("tech-radar");
const settings = {/** The config object of step above */};

const chart = new TechnologyChart(canvas, settings);
```