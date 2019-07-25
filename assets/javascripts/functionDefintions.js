/* In this application, we use APIs from https://developers.amadeus.com.
The authentication mechanism is to pass APIKEY and APISECRET using POST method to receive an access token
This access token should be used with other API calls for Authentication

For details refer: https://developers.amadeus.com/self-service/apis-docs/guides/authorization
*/
function getAccessToken() {
  //Creating the Request Body
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const apikey = "15bojKjUylu27fBihpxlLclvsiiGzq0s";
  const apisecret = "aJ8oEcJx4aNP0Tzu";
  var formBody = `grant_type=client_credentials&client_id=${apikey}&client_secret=${apisecret}`;
  // console.log(formBody);

  //Executing the fetch call in POST method
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formBody
  })
    .then(response => response.json())
    .then(function(data) {
      return data;
    });
}

/*
This function accepts input as a JS object with the various search parameters
Expectation is that the code that calls the function ensures the minimum parameters (origin, destination, departureDate)
is provided
*/
function getLowFareFlightOption(flightSearchObject) {
  //Forms the query string by iterating through the object
  const url = "https://test.api.amadeus.com/v1/shopping/flight-offers";
  let queryString = formQueryString(url, flightSearchObject);
  //Get Access Token for authorizing the API Call
  return getAccessToken()
    .then(function(data) {
      return makeamadeusApiCall(data.access_token, queryString);
    })
    .catch(error => console.error(error));
}

//Iterates through the input object and forms a query string
function formQueryString(url, SearchObject) {
  let queryString = "?";
  for (var property in SearchObject) {
    queryString = `${queryString}&${property}=${SearchObject[property]}`;
  }
  console.log(url + queryString);
  return url + queryString;
}

//This function makes the actual API Call and returns the JSON response
function makeamadeusApiCall(access_token, queryString) {
  return fetch(queryString, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token
    }
  })
    .then(response => response.json())
    .then(function(data) {
      return data;
    })
    .catch(error => console.error(error));
}

//Function that takes a cityName and returns the iataCode
function getAirportCodeUsingCityName(cityName) {
  var citySearchObject = {
    subType: "CITY",
    keyword: cityName,
    "page[limit]": 1
  };
  const url = "https://test.api.amadeus.com/v1/reference-data/locations";
  let queryString = formQueryString(url, citySearchObject);

  return getAccessToken()
    .then(function(data) {
      return makeamadeusApiCall(data.access_token, queryString);
    })
    .catch(error => console.error(error));
}

//Function to convert city with spaces into city with + i.e New York City --> New+York+City
function handleSpace(city) {
  //Using RE to replace space for +
  city = city.trim().replace(/ /g, "+");
  return city;
}

//Function takes two paramters City & (interestType is optional, defaults to attraction)
//It will make an ajax call to the Yelp API and return data pertaining to city and interest type

function pointsOfinterest(city, interestType) {
  //Handle second paramter if it is not passed
  if (interestType === undefined) {
    interestType = "attractions";
  }

  var goodCity = handleSpace(city);

  var myurl =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" +
    goodCity +
    "&limit=5&term=" +
    interestType +
    "";

  //Make call to Yelp
  $.ajax({
    url: myurl,
    //Header required as per Yelp API documentation
    headers: {
      Authorization:
        "Bearer 4dizE_fZpusYfUraxlSSEKEE5wQLbKEYA0KDOIamkjL8P8LbqkfmR-9nz0rXQ1gyYCK2H0uQ-xiKRCDELKrJ9hAb1csxtEPSyTEKrTXhbUuvHj62AYSg8K0d6Bc2XXYx"
    },
    method: "GET",
    dataType: "json"
  }).then(function(response) {
    for (let i in response.businesses) {
      // console.log(response.businesses[i])
      console.log("Name: " + response.businesses[i].name);
      console.log(
        "Address: " + response.businesses[i].location.display_address[1]
      );
      console.log("Img: " + response.businesses[i].imgage_url);
      console.log("Rating: " + response.businesses[i].rating);
      console.log("Price: " + response.businesses[i].price);
      console.log("Review Count: " + response.businesses[i].review_count);
      console.log("------------------------------------------------------");
    }
  });
}