var jsPsychColorWheel = (function (jsPsych) {
    "use strict";
  
    const info = {
      name: "color-wheel-rating",
      parameters: {
        stimulus: {
          type: jsPsych.ParameterType.STRING,
          pretty_name: "Stimulus",
          default: undefined,
          description: "The image or content to display above the color wheel.",
        },
        prompt: {
          type: jsPsych.ParameterType.HTML_STRING,
          pretty_name: "Prompt",
          default: "What color does the object seem to be?",
          description: "The question or instruction displayed below the stimulus.",
        },
        stimulus_duration: {
          type: jsPsych.ParameterType.INT,
          pretty_name: "Stimulus duration",
          default: null,
        },
        trial_duration: {
          type: jsPsych.ParameterType.INT,
          pretty_name: "Trial duration",
          default: null,
        },
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
        let html = `
        <div id="jspsych-color-wheel-container" style="text-align: center;">
          <div id="jspsych-color-wheel-stimulus">
            <img src="${trial.stimulus}" style="max-width: 90%; max-height: 90vh; height: auto; margin-bottom: 20px;">
          </div>
          <p id="jspsych-color-wheel-prompt" style="margin-bottom: 15px;">${trial.prompt}</p>
          <canvas id="color-wheel" width="400" height="400" style="border-radius: 50%;"></canvas>
           <button id="jspsych-color-wheel-submit" style="margin-top: 20px; display: block; margin: 20px auto;" disabled>Submit</button>
        </div>
      `;
  
        display_element.innerHTML = html;
  
        const canvas = document.getElementById("color-wheel");
        const ctx = canvas.getContext("2d");
        const radius = canvas.width / 2;
        let selectedRGB = null;
        const start_time = performance.now();
        const submitButton = display_element.querySelector("#jspsych-color-wheel-submit");
  
        // Function to draw the RGB color wheel with white gradient
        const drawColorWheel = () => {
          const image = ctx.createImageData(canvas.width, canvas.height);
          const data = image.data;
  
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const dx = x - radius;
              const dy = y - radius;
              const distance = Math.sqrt(dx * dx + dy * dy);
  
              if (distance <= radius) {
                let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                angle = (angle + 360) % 360;
  
                const hue = angle / 360;
                const saturation = distance / radius;
                const lightness = 1 - saturation / 2; // White blends towards center
  
                const rgb = hslToRgb(hue, saturation, lightness);
  
                const index = (y * canvas.width + x) * 4;
                data[index] = rgb[0];      // R
                data[index + 1] = rgb[1];  // G
                data[index + 2] = rgb[2];  // B
                data[index + 3] = 255;     // A
              }
            }
          }
          ctx.putImageData(image, 0, 0);
        };
  
        // Convert HSL to RGB
        function hslToRgb(h, s, l) {
          let r, g, b;
  
          if (s === 0) {
            r = g = b = l * 255;
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
  
          return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
  
        // Handle clicks on the wheel
        
        let clickPosition = null; // To store click coordinates

        // Handle clicks on the wheel
        canvas.addEventListener("click", (event) => {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          const pixel = ctx.getImageData(x, y, 1, 1).data;
          const distance = Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - radius, 2));

          if (distance <= radius) {
            selectedRGB = { r: pixel[0], g: pixel[1], b: pixel[2] };
            clickPosition = { x: x, y: y }; // Save click position
            console.log("Selected RGB:", selectedRGB);
            redrawWheelWithMarker();
            // Enable the submit button after a valid click
            submitButton.disabled = false;
          }
        });

        // Redraw the wheel with the click marker
        const redrawWheelWithMarker = () => {
          drawColorWheel(); // Redraw the base color wheel

          if (clickPosition) {
            ctx.beginPath();
            ctx.arc(clickPosition.x, clickPosition.y, 6, 0, 2 * Math.PI); // Draw marker
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Black marker with slight transparency
            ctx.fill();
            ctx.strokeStyle = "white"; // White outline for visibility
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        };

        drawColorWheel();
  
        display_element.querySelector("#jspsych-color-wheel-submit").addEventListener("click", () => {
          const response = {
            rt: performance.now() - start_time,
            rgb: selectedRGB || { r: 255, g: 255, b: 255 },
            stimulus: trial.stimulus,
          };
  
          this.endTrial(display_element, trial, response);
        });
      }
  
      endTrial(display_element, trial, response) {
        display_element.innerHTML = "";
        this.jsPsych.finishTrial(response);
      }
    }
  
    ColorWheelPlugin.info = info;
  
    return ColorWheelPlugin;
  })(jsPsychModule);
  