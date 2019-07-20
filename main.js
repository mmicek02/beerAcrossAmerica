'use strict';

//This is for the Yelp API which is being used via a proxy server
const apiKey= "MBJaNGZyrH0IGR_2oe_xgkfilnTgtpOvoPl6esVC7vo1s-Tj4xtM5cky8JEDlzajPNPjIhO91tTg7CnfGMXtNtZXIp3cl6OrHxpoujgqHKBS-iiJS6OKw1izb7UxXXYx"

/* This function takes the paramaters from the user and puts it a format that can
be manipulated by the API */ 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

/* This function will show all of the brewery results, with a maximum of ten 
results. It displays the name of the brewery, a short description, a webiste, and
the address */
function displayResults(results, maxResults) {
    // if there are previous results, remove them
    console.log(results); //responseJson
    //display the results section  
    $('#results').removeClass('hidden');
  };

/* This function will parse together the user submitted data and the searchURL 
the data can correctly and successfully pulled from the API */
  function getBreweries(query, maxResults=50) {
    const params = {
        term: 'brewery',
        location: query,
        limit: maxResults,
    };
    const queryRatingString = formatQueryParams(params)
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const reqEndPoint = 'https://api.yelp.com/v3/businesses/search'+'?'+ queryRatingString
    const url = proxyUrl + reqEndPoint

/*This fetch request grabs all of the data from the yelp API, with the help of a proxy server. */
  fetch(url, {headers: 
    {Authorization: `Bearer ${apiKey}`}
  })
    .then(response => response.json())
    .then(results => {
    console.log(results)

      //Clears the form for all other searches
      $('#results-list').empty();
      $('#js-error-message').empty();
      $('#js-form').removeClass('.userSearch');

    // iterate through the data array, stopping at the max number of results
      for (let i = 0; i < results.businesses.length & i<maxResults; i++){
        $('#results-list').append(
          `<section class="displayResults hidden">
            <span class="details">
                <span class="result">
                    <h3>
                      ${results.businesses[i].name}
                    </h3>
                    <p class="resultText">
                      <a href="${results.businesses[i].url}" target="_blank">Visit this brewery's yelp page</a>
                      <p>
                        ${results.businesses[i].location.display_address[0]}
                        ${results.businesses[i].location.display_address[1]}
                      </p>
                      <p class="rating">
                      Average Rating: ${results.businesses[i].rating} out of 5 stars
                      <br>
                      Price: ${results.businesses[i].price}
                      </p>
                    </p>
                  </span>
              </span>
            </section>`
        )};
    })
    .catch(err => {
      console.log(err)
    });
}

//This function will waits for the user to submit the data request to the API
function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      const maxResults = $('#js-search-results').val();
      //findBrewery(searchTerm, maxResults);
      getBreweries(searchTerm, maxResults);
    });
  }

  //Calls the watchForm function and allows the res of the code to run
  $(watchForm);
    


