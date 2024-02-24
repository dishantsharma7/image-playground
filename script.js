document.addEventListener("DOMContentLoaded", function () {
  const uploadInput = document.getElementById("uploadInput");
  const canvas = document.getElementById("imageCanvas");
  const ctx = canvas.getContext("2d");
  const asciiContainer = document.getElementById("asciiContainer");
  const downloadButton = document.getElementById("downloadButton");

  // Hide canvas and ASCII art initially
  canvas.style.display = "none";
  asciiContainer.style.display = "none";
  downloadButton.disabled = true; // Disable download button initially

  uploadInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        canvas.style.display = "block"; // Show canvas
        asciiContainer.style.display = "block"; // Show ASCII art container
        downloadButton.disabled = false; // Enable download button

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const asciiArt = convertToAscii(imageData, canvas.width);
        asciiContainer.innerText = asciiArt;
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });

  downloadButton.addEventListener("click", function () {
    const asciiContent = asciiContainer.innerText;
    const blob = new Blob([asciiContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii_art.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  });

  function convertToAscii(imageData, width) {
    const ASCII_CHARS = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", "."];
    const grayScaleChars = ASCII_CHARS.reverse();

    let asciiArt = "";

    for (let i = 0; i < imageData.data.length; i += 2) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const gray = Math.floor((r + g + b) / 3);
      const index = Math.floor(gray / (255 / grayScaleChars.length));
      asciiArt += grayScaleChars[index];
      if ((i / 4 + 1) % width === 0) {
        asciiArt += "\n";
      }
    }

    return asciiArt;
  }
});
