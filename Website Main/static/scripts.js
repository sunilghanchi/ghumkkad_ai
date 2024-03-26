// Function to capitalize the first letter of each word
function capitalizeFirstLetter(str) {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

var dest_err = document.getElementById("dest_err");
var price_err = document.getElementById("price_err");

function setFocus() {
  var dest = document.getElementById("destination");
  dest.focus();
}

function clr_err(val) {
  var all_val = document.getElementById(val);
  if (all_val.value !== "") {
    all_val.style.border = "3px solid #ccc";
  }
}

function toggle_content(i) {
  var hot_symbol = document.getElementById("drop_symbol_hot");
  var attr_symbol = document.getElementById("drop_symbol_attr");
  var rest_symbol = document.getElementById("drop_symbol_rest");
  var itr_symbol = document.getElementById("drop_symbol_itr");

  if (i === 0) {
    itr_symbol.classList.toggle("fa-caret-down");
    itr_symbol.classList.toggle("fa-caret-right");
  } else if (i === 1) {
    hot_symbol.classList.toggle("fa-caret-down");
    hot_symbol.classList.toggle("fa-caret-right");
  } else if (i === 2) {
    attr_symbol.classList.toggle("fa-caret-down");
    attr_symbol.classList.toggle("fa-caret-right");
  } else {
    rest_symbol.classList.toggle("fa-caret-down");
    rest_symbol.classList.toggle("fa-caret-right");
  }
  var secContent = document.getElementsByClassName("content");
  secContent[i].classList.toggle("toggle_content");
}

window.onload = setFocus();

function closeTab() {
  var recommendationResults = document.getElementById("recommendation-results");
  recommendationResults.style.display = "none";
}

// Get the "Get Recommendations" button element
var getRecommendationsButton = document.querySelector('button[type="submit"]');

// Add an event listener to the button
getRecommendationsButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  // Disable the button
  getRecommendationsButton.disabled = true;

  // Add the loading animation class
  getRecommendationsButton.classList.add("loading");

  // Clear previous recommendation results
  var recommendationResults = document.getElementById("recommendation-results");
  recommendationResults.innerHTML = ""; // Clear the content

  // Clear error messages
  var show_error = document.getElementById("show_error");
  show_error.innerHTML = ""; // Clear the content

  var errorMessage = document.getElementById("error-message");
  errorMessage.textContent = ""; // Clear the error message

  // Get form input values
  var destination = capitalizeFirstLetter(
    document.getElementById("destination").value
  );
  var dest_input = document.getElementById("destination");
  if (destination === "") {
    dest_input.style.border = "4px solid red";
  }

  var days_input = document.getElementById("days").value;
  var days = document.getElementById("days");
  if (days_input === "") {
    days.style.border = "4px solid red";
  }

  var hotelFeatures = capitalizeFirstLetter(
    document.getElementById("hotel-features").value
  );

  var attractionFeatures = capitalizeFirstLetter(
    document.getElementById("attraction-features").value
  );

  var restaurantDescription = capitalizeFirstLetter(
    document.getElementById("restaurant-description").value
  );

  var restaurantLocality = capitalizeFirstLetter(
    document.getElementById("restaurant-locality").value
  );

  var hotelPrice = document.getElementById("hotel-price").value;
  var price_input = document.getElementById("hotel-price");
  if (hotelPrice === "") {
    price_input.style.border = "4px solid red";
  } else if (hotelPrice < 500) {
    show_error.innerHTML = "Hotel price should not be less than 500.";
    show_error.style.color = "red";
    price_input.style.border = "4px solid red";

    getRecommendationsButton.classList.remove("loading");
    getRecommendationsButton.disabled = false;
    return; // Stop further execution
  }

  // Create FormData object to send form data to the server
  var formData = new FormData();
  formData.append("destination", destination);
  formData.append("days", days_input);
  formData.append("hotel-features", hotelFeatures);
  formData.append("attraction-features", attractionFeatures);
  formData.append("restaurant-description", restaurantDescription);
  formData.append("restaurant-locality", restaurantLocality);
  formData.append("hotel-price", hotelPrice);

  // Make AJAX request to the Flask backend
  if (destination !== "" && hotelPrice !== "" && days_input !== "") {
    fetch("/get_recommendations", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        // Check for error message returned from backend
        if (data.error) {
          show_error.innerHTML = data.error;
          show_error.style.color = "red";

          // Remove the loading animation class
          getRecommendationsButton.classList.remove("loading");

          // Enable the button
          getRecommendationsButton.disabled = false;

          return; // Stop further execution if there is an error
        }

        // Process recommendation data and display it in the 'recommendation-results' section
        recommendationResults.style.display = "block";
        recommendationResults.innerHTML =
          '<div class="div_close"><button class="res_close" onclick="closeTab()">X</button></div>';

        recommendationResults.insertAdjacentHTML(
          "beforeend",
          '<div id="content-div"></div>'
        );

        var content_div = document.getElementById("content-div");

        content_div.innerHTML = "<h2 class='res_head'>Recommendations</h2>";

        content_div.insertAdjacentHTML("beforeend", '<hr class="head_res_hr">');

        content_div.insertAdjacentHTML(
          "beforeend",
          "<button class='title_head' onclick='toggle_content(0)'><i class='fa-solid fa-map'></i> Itinerary <i id='drop_symbol_itr' class='fa fa-caret-down'></i></button>"
        );
        content_div.style.color = "black";
        content_div.insertAdjacentHTML("beforeend", "<hr>");

        // Process itinerary
        var itineraryData = JSON.parse(data[1]);
        var itineraryHTML = `<div id='iterContent' class='content itr_content'>
<div id='itr_id' class='each_content'>`;

        // Split the itinerary string into lines
        var lines = itineraryData.output.split("\n");

        lines.forEach(function (line) {
          // Skip empty lines
          if (line.trim() !== "") {
            // Check if the line starts with 'Day' indicating a new day
            if (!line.includes("**")) {
              if (line.startsWith("Day")) {
                itineraryHTML += `<br>${line}`; // Add as heading
              } else if (line.startsWith("-")) {
                itineraryHTML += `<li>${line.replace(/^\s*-\s*/, '')}</li>`; // Remove '-' and add as list item
              } else if (line.startsWith("Note")) {
                itineraryHTML += `<br>${line}`; // Add as bold text
              } else {
                itineraryHTML += `<p>${line}</p>`; // Add as paragraph
              }
            }
          }
        });
        

        // Close the div elements
        itineraryHTML += `</div>
</div>`;

        // Append itinerary HTML to the content_div
        content_div.insertAdjacentHTML("beforeend", itineraryHTML);

        // Process hotel recommendations
        content_div.insertAdjacentHTML(
          "beforeend",
          "<button class='title_head' onclick='toggle_content(1)'><i class='fa-solid fa-hotel'></i> Hotels <i id='drop_symbol_hot' class='fa fa-caret-down'></i></button>"
        );
        content_div.insertAdjacentHTML("beforeend", "<hr>");
        content_div.insertAdjacentHTML(
          "beforeend",
          "<div id='hotelContent' class='content hot_content'></div>"
        );
        var hotelContent = document.getElementById("hotelContent");
        var ind = 2000;
        var i = 0;
        data[0].hotels.forEach(function (hotel) {
          var hot_id = "hot_content" + i;
          var hotelDetails = `<div id=${hot_id} class='each_content'><p><strong>Name:</strong> ${capitalizeFirstLetter(
            hotel.Name
          )}</p><p><strong>Address:</strong> ${capitalizeFirstLetter(
            hotel.Address
          )}</p><p><strong>Amenities:</strong> ${capitalizeFirstLetter(
            hotel.Amenities
          )}</p><p><strong>Price:</strong> ${
            hotel.Price
          }</p><p><strong>Review Score:</strong> ${
            hotel.Review_Score
          }</p></div>`;
          hotelContent.insertAdjacentHTML("beforeend", hotelDetails);
          document.getElementById(hot_id).style.zIndex = `${ind}`;
          ind -= 1;
          i += 1;
        });

        // Process attraction recommendations
        content_div.insertAdjacentHTML(
          "beforeend",
          "<button class='title_head' onclick='toggle_content(2)'><i class='fa-solid fa-magnet'></i> Attractions <i id='drop_symbol_attr' class='fa fa-caret-down'></i></button>"
        );
        content_div.insertAdjacentHTML("beforeend", "<hr>");
        content_div.insertAdjacentHTML(
          "beforeend",
          "<div id='attractionContent' class='content'></div>"
        );
        var attractionContent = document.getElementById("attractionContent");
        var j = 0;
        data[0].attractions.forEach(function (attraction) {
          var attr_id = "attr_content" + j;
          var attractionDetails = `<div id=${attr_id} class='each_content'><p><strong>Name of Place:</strong> ${capitalizeFirstLetter(
            attraction.Place
          )}</p><p><strong>City:</strong> ${capitalizeFirstLetter(
            attraction.City
          )}</p><p><strong>Rating:</strong> ${
            attraction.Rating
          }</p><p><strong>Best review about Place:</strong> ${capitalizeFirstLetter(
            attraction.Description
          )}</p></div>`;
          attractionContent.insertAdjacentHTML("beforeend", attractionDetails);
          document.getElementById(attr_id).style.zIndex = `${ind}`;
          ind -= 1;
          j += 1;
        });

        // Process restaurant recommendations
        content_div.insertAdjacentHTML(
          "beforeend",
          "<button class='title_head' onclick='toggle_content(3)'><i class='fa-solid fa-utensils'></i> Restaurants <i id='drop_symbol_rest' class='fa fa-caret-down'></i></button>"
        );
        content_div.insertAdjacentHTML("beforeend", "<hr>");
        content_div.insertAdjacentHTML(
          "beforeend",
          "<div id='restaurantContent' class='content'></div>"
        );
        var restaurantContent = document.getElementById("restaurantContent");
        var k = 0;
        data[0].restaurants.forEach(function (restaurant) {
          var rest_id = "rest_content" + k;
          var restaurantDetails = `<div id=${rest_id} class='each_content'><p><strong>Name:</strong> ${capitalizeFirstLetter(
            restaurant.Name
          )}</p><p><strong>Type:</strong> ${capitalizeFirstLetter(
            restaurant.Type
          )}</p><p><strong>Cost for Two:</strong> ${
            restaurant["Cost for Two"]
          }</p><p><strong>Address:</strong> ${capitalizeFirstLetter(
            restaurant.Address
          )}</p><p><strong>Timings:</strong> ${restaurant.Timings}</p></div>`;
          restaurantContent.insertAdjacentHTML("beforeend", restaurantDetails);
          document.getElementById(rest_id).style.zIndex = `${ind}`;
          ind -= 1;
          k += 1;
        });

        // Add the print button at the bottom of the recommendation window
        content_div.insertAdjacentHTML(
          "beforeend",
          '<button id="print-btn" onclick="printRecommendations()">Print</button>'
        );

        // Remove the loading animation class
        getRecommendationsButton.classList.remove("loading");

        // Enable the button
        getRecommendationsButton.disabled = false;
      })
      .catch((error) => {
        console.error("Error:", error);

        // Remove the loading animation class
        getRecommendationsButton.classList.remove("loading");

        // Enable the button
        getRecommendationsButton.disabled = false;
      });
  } else {
    // Remove the loading animation class
    getRecommendationsButton.classList.remove("loading");

    // Enable the button
    getRecommendationsButton.disabled = false;
  }
});

function printRecommendations() {
  // Get the recommendation results section
  var recommendationResults = document.getElementById("recommendation-results");

  // Hide the close button if present
  var closeButton = document.querySelector(".res_close");
  {closeButton.style.display = "none"};

  // Hide the print button
  var printButton = document.getElementById("print-btn");
  {printButton.style.display = "none"};

  // Convert buttons to text and change them to h3 tags
  var recommendationContent = recommendationResults.innerHTML;
  recommendationContent = recommendationContent.replace(
    /<button.*?>(.*?)<\/button>/g,
    "<h3>$1</h3>"
  );

  // Remove the <h2> tag with id "res_head" from the content
  recommendationContent = recommendationContent.replace(
    /<h2 id="res_head".*?>.*?<\/h2>/,
    ""
  );
  recommendationContent = recommendationContent.replace(
    /<h2 id="res_head".*?>.*?<\/h2>/,
    ""
  );

  // Create the template HTML with header, footer, and styling
  var printableHTML = `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ghumkkad - AI</title>
      <style>
        @page {
          @top-left {
            content: element(header); /* Print header on top-left */
          }
          @bottom-left {
            content: element(footer); /* Print footer on bottom-left */
          }
        }

        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #000; /* Black color for text */
        }

        .header {
          background-color: #87CEEB; /* Sky blue color */
          color: #fff; /* White color for text */
          padding: 10px;
          text-align: center;
          height: 12%;
          width: 100%;
          box-sizing: border-box; / Ensures content doesn't overflow */
          }
          .header img {
            width: 150px; /* Adjust as needed */
            display: block; /* Ensures proper alignment */
            margin: 0; /* Centers the logo horizontally */
          }
      
          .header h2 {
            margin-top: 10px; /* Adds some space between logo and text */
          }
      
          .header pre:first-of-type {
            margin-left: 10px; /* Adds some space between logo and text */
            text-align: left;
          }
          .header pre:last-of-type {
            position: absolute;
            top: 10px; /* Adjust as needed */
            right: 10px; /* Adjust as needed */
          }
      
          .footer {
            background-color: #87CEEB; /* Sky blue color */
            color: #fff; /* White color for text */
            position: running(footer); /* Set position to running for printing */
            text-align: center;
            box-sizing: border-box; /* Ensures content doesn't overflow */
          }
      
          #recommendation-results {
            padding: 30px;
          }
      
          h3 {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
      <header class="header">
        <img src="static/logo.png" alt="Company Logo">
        <pre>Your Itinerary Partner</pre>
        <pre>             +91 9624076783
        sunilghanchi24@gmail.com</pre>
      </header>
        <div id="recommendation-results">
          ${recommendationContent}
        </div>
        <footer class="footer">
          <pre>&copy; ${new Date().getFullYear()} Ghumkkad AI - 2024. All rights reserved.</pre>
        </footer>
        </body>
      </html>
      `;

  // Create a hidden iframe
  var iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  var printWindow = iframe.contentWindow;

  // Write the content to the iframe document
  printWindow.document.open();
  printWindow.document.write(printableHTML);
  printWindow.document.close();

  // Print the content
  printWindow.print();

  // Show the print button again
  printButton.style.display = "block";

  // Show the hidden close button after printing
  closeButton.style.display = "flex";
}

