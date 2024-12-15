var jsPsychColorWheel = (function (jsPsych) {
    "use strict";
  
    const info = {
      name: "color-wheel-rating",
      parameters: {
        /**
         * The stimulus (e.g., monochromatic grid) to be displayed.
         */
        stimulus: {
          type: jsPsych.ParameterType.STRING,
          pretty_name: "Stimulus",
          default: undefined,
          description: "The image or content to display above the color wheel.",
        },
        /**
         * The prompt to display below the color wheel.
         */
        prompt: {
          type: jsPsych.ParameterType.HTML_STRING,
          pretty_name: "Prompt",
          default: "Does the grid appear to have color?",
          description: "The question or instruction displayed below the stimulus.",
        },
        /**
         * How long to display the stimulus.
         */
        stimulus_duration: {
          type: jsPsych.ParameterType.INT,
          pretty_name: "Stimulus duration",
          default: null,
        },
        /**
         * How long the trial lasts.
         */
        trial_duration: {
          type: jsPsych.ParameterType.INT,
          pretty_name: "Trial duration",
          default: null,
        },
        /**
         * If true, trial ends when participant submits a response.
         */
        response_ends_trial: {
          type: jsPsych.ParameterType.BOOL,
          pretty_name: "Response ends trial",
          default: true,
        },
      },
    };
  
    class ColorWheelPlugin {
      constructor(jsPsych) {
        this.jsPsych = jsPsych;
      }
  
      trial(display_element, trial) {
        // Create the HTML
        let html = `
        <div id="jspsych-color-wheel-container" style="text-align: center;">
          <div id="jspsych-color-wheel-stimulus">
            <img src="${trial.stimulus}" style="max-width: 100%; height: auto; margin-bottom: 20px;">
          </div>
          <div id="jspsych-color-wheel" style="
            position: relative;
            width: 300px;
            height: 300px;
            margin: 0 auto; /* Center horizontally */
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            overflow: hidden; /* Prevent any scrollbars */
          ">
            <div id="color-wheel" style="
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: conic-gradient(
                red, yellow, green, cyan, blue, magenta, red
              );
              position: relative;
              margin: 0; /* Remove any unexpected margins */
              padding: 0;
            "></div>
            <div id="selector" style="
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: white;
              border: 2px solid black;
              position: absolute;
              visibility: hidden; /* Invisible but rendered */
              transform: translate(-50%, -50%); /* Center relative to the position */
            "></div>
          </div>
          <p id="jspsych-color-wheel-prompt" style="margin-top: 10px;">${trial.prompt}</p>
          <button id="jspsych-color-wheel-submit" style="margin-top: 15px;">Submit</button>
        </div>
      `;
      
  
        display_element.innerHTML = html;
  
        // Variables to record response
        let response = {
          rt: null,
          rgb: null,
        };
  
        const wheel = display_element.querySelector("#color-wheel");
        const selector = display_element.querySelector("#selector");
        const start_time = performance.now();
  
        // Center of the wheel
        const centerX = wheel.offsetWidth / 2;
        const centerY = wheel.offsetHeight / 2;
  
        wheel.addEventListener("click", (event) => {
            const rect = wheel.getBoundingClientRect();
            const centerX = rect.width / 2; 
            const centerY = rect.height / 2;
          
            // Get relative position of the click
            const x = event.clientX - rect.left - centerX;
            const y = event.clientY - rect.top - centerY;
          
            // Calculate angle
            let angle = Math.atan2(y, x) * (180 / Math.PI);
            angle = (angle + 90 + 360) % 360;
          
            // Radius adjusted for the selector size
            const radius = centerX - selector.offsetWidth / 2;
            const angleRad = (angle - 90) * (Math.PI / 180);
          
            // Show and place the selector
            selector.style.left = `${radius * Math.cos(angleRad) + centerX}px`;
            selector.style.top = `${radius * Math.sin(angleRad) + centerY}px`;
            selector.style.visibility = "visible"; // Make the selector visible
          });
          
        
        
        // Submit button listener
        display_element.querySelector("#jspsych-color-wheel-submit").addEventListener("click", () => {
          response.rt = performance.now() - start_time;
          this.endTrial(display_element, trial, response);
        });
  
        // Handle stimulus duration
        if (trial.stimulus_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            display_element.querySelector("#jspsych-color-wheel-stimulus").style.visibility = "hidden";
          }, trial.stimulus_duration);
        }
  
        // Handle trial duration
        if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            this.endTrial(display_element, trial, response);
          }, trial.trial_duration);
        }
      }
  
      endTrial(display_element, trial, response) {
        // Clear display
        display_element.innerHTML = "";
  
        // Collect trial data
        const trial_data = {
          rt: response.rt,
          rgb: response.rgb,
          stimulus: trial.stimulus,
        };
  
        // Finish the trial
        this.jsPsych.finishTrial(trial_data);
      }
  
      // Convert HSL to RGB
      hslToRgb(h, s, l) {
        let r, g, b;
  
        if (s == 0) {
          r = g = b = l; // Achromatic
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };
  
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }
  
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
      }
    }
  
    ColorWheelPlugin.info = info;
  
    return ColorWheelPlugin;
  })(jsPsychModule);
  