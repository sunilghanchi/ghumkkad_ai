// Function to capitalize the first letter of each word
function capitalizeFirstLetter(str) {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

var dest_err = document.getElementById("dest_err");
var price_err = document.getElementById("price_err");

function setFocus(){
  var dest = document.getElementById('destination');
  dest.focus();
}

function clr_err(val) {
  var dest_val = document.getElementById(val);
  if (dest_val.value != "") {
    dest_val.style.border = "3px solid #ccc";
  }
}

function closeTab(){
  var recommendationResults = document.getElementById("recommendation-results");
  recommendationResults.style.display = 'none';
}

function toggle_content(i){
  var hot_symbol = document.getElementById('drop_symbol_hot');
  var attr_symbol = document.getElementById('drop_symbol_attr');
  var rest_symbol = document.getElementById('drop_symbol_rest');

  if (i==0) {
    hot_symbol.classList.toggle('fa-caret-down');
    hot_symbol.classList.toggle('fa-caret-right');
  } else if (i==1) {
    attr_symbol.classList.toggle('fa-caret-down');
    attr_symbol.classList.toggle('fa-caret-right');
  } else {
    rest_symbol.classList.toggle('fa-caret-down');
    rest_symbol.classList.toggle('fa-caret-right');
  }
  var secContent = document.getElementsByClassName('content');
  secContent[i].classList.toggle('toggle_content');
}

window.onload = setFocus();

document
  .getElementById("recommendation-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous recommendation results
    var recommendationResults = document.getElementById(
      "recommendation-results"
    );
    recommendationResults.innerHTML = ""; // Clear the content

    // Clear error messages
    var show_error = document.getElementById("show_error");
    show_error.innerHTML = ""// Clear the content

    var errorMessage = document.getElementById("error-message");
    errorMessage.textContent = ""; // Clear the error message

    // Get form input values
    var destination = capitalizeFirstLetter(
      document.getElementById("destination").value
    );
    var dest_input = document.getElementById("destination");
    if (destination == "") {
      // dest_err.innerHTML = "<i>This field is required</i>";
      dest_input.style.border = '4px solid red';
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
    if (hotelPrice == "") {
      // price_err.innerHTML = "<i>This field is required</i>";
      price_input.style.border = '4px solid red';
    }

    // Create FormData object to send form data to the server
    var formData = new FormData();
    formData.append("destination", destination);
    formData.append("hotel_features", hotelFeatures);
    formData.append("attraction_features", attractionFeatures);
    formData.append("restaurant_description", restaurantDescription);
    formData.append("restaurant_locality", restaurantLocality);
    formData.append("hotel_price", hotelPrice);


    // Make AJAX request to the Flask backend
    if ((destination != '') && (hotelPrice != '')) {
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
              return; // Stop further execution if there is an error
            }
    
            // Process recommendation data and display it in the 'recommendation-results' section
            recommendationResults.style.display = 'block';
            recommendationResults.innerHTML = '<div class="div_close"><button class="res_close" onclick="closeTab()">X</button></div>'

            recommendationResults.insertAdjacentHTML(
              "beforeend",
              "<div id='content-div'></div>"
            )
            
            var content_div = document.getElementById('content-div');

            content_div.innerHTML = "<h2 class='res_head'>Recommendations</h2>"

            content_div.insertAdjacentHTML(
              "beforeend",
              "<hr class='head_res_hr'>"
            );

            content_div.insertAdjacentHTML(
              "beforeend",
              "<button class='title_head' onclick='toggle_content(0)'><i class='fa-solid fa-hotel'></i> Hotels <i id='drop_symbol_hot' class='fa fa-caret-down'></i></button>"
            );
            content_div.style.color = "black";
            content_div.insertAdjacentHTML(
              "beforeend",
              "<hr>"
            );
            content_div.insertAdjacentHTML(
              "beforeend",
              "<div id='hotelContent' class='content hot_content'></div>"
            );
            var hotelContent = document.getElementById('hotelContent')

            // Process hotel recommendations
            var ind = 2000;
            var i = 0;
            data.hotels.forEach(function (hotel) {
              var hot_id = 'hot_content'+i;
              console.log(hot_id);
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
              console.log(document.getElementById(hot_id).style.zIndex);
              ind -= 1;
              i += 1;
              console.log(document.getElementById(hot_id).getAttribute('id'));
              // document.getElementById('hot_content').removeAttribute('id');
            });
            

            // Process attraction recommendations
            content_div.insertAdjacentHTML(
              "beforeend",
              "<button class='title_head' onclick='toggle_content(1)'><i class='fa-solid fa-magnet'></i> Attractions <i id='drop_symbol_attr' class='fa fa-caret-down'></i></button>"
            );
            content_div.insertAdjacentHTML(
              "beforeend",
              "<hr>"
            );
            content_div.insertAdjacentHTML(
              "beforeend",
              "<div id='attractionContent' class='content'></div>"
            );
            var attractionContent = document.getElementById('attractionContent') 
            var j = 0;
            data.attractions.forEach(function (attraction) {
              var attr_id = 'attr_content'+j;
              var attractionDetails = `<div id=${attr_id} class='each_content'><p><strong>Name of Place:</strong> ${capitalizeFirstLetter(
                attraction.Place
              )}</p><p><strong>City:</strong> ${capitalizeFirstLetter(
                attraction.City
              )}</p><p><strong>Rating:</strong> ${
                attraction.Rating
              }</p><p><strong>Best review about Place:</strong> ${capitalizeFirstLetter(
                attraction.Description
              )}</p></div>`;
              attractionContent.insertAdjacentHTML(
                "beforeend",
                attractionDetails
              );
              document.getElementById(attr_id).style.zIndex = `${ind}`;
              ind -= 1;
              j += 1;
              // document.getElementById('attr_content').removeAttribute('id');
            });
            
            
            // Process restaurant recommendations
            content_div.insertAdjacentHTML(
              "beforeend",
              "<button class='title_head' onclick='toggle_content(2)'><i class='fa-solid fa-utensils'></i> Restaurants <i id='drop_symbol_rest' class='fa fa-caret-down'></i></button>"
            );
            content_div.insertAdjacentHTML(
              "beforeend",
              "<hr>"
            );
            content_div.insertAdjacentHTML(
              "beforeend",
              "<div id='restaurantContent' class='content'></div>"
            );
            var restaurantContent = document.getElementById('restaurantContent')
            var k = 0;
            data.restaurants.forEach(function (restaurant) {
              var rest_id = 'rest_content'+k;
              var restaurantDetails = `<div id=${rest_id} class='each_content'><p><strong>Name:</strong> ${capitalizeFirstLetter(
                restaurant.Name
              )}</p><p><strong>Type:</strong> ${capitalizeFirstLetter(
                restaurant.Type
              )}</p><p><strong>Cuisines:</strong> ${capitalizeFirstLetter(
                restaurant.Cuisines
              )}</p><p><strong>Highlights:</strong> ${capitalizeFirstLetter(
                restaurant.Highlights
              )}</p><p><strong>Rating:</strong> ${
                restaurant.Rating
              }</p><p><strong>Cost for Two:</strong> ${
                restaurant["Cost for Two"]
              }</p><p><strong>Address:</strong> ${capitalizeFirstLetter(
                restaurant.Address
              )}</p><p><strong>Timings:</strong> ${restaurant.Timings}</p></div>`;
              restaurantContent.insertAdjacentHTML(
                "beforeend",
                restaurantDetails
              );
              document.getElementById(rest_id).style.zIndex = `${ind}`;
              ind -= 1;
              k += 1;
              // document.getElementById('rest_content').removeAttribute('id');
            });
        });
    } else {
        return;
    }
  });

