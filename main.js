'use strict';

//This is for the Yelp API which is being used via a proxy server
const apiKey= "MBJaNGZyrH0IGR_2oe_xgkfilnTgtpOvoPl6esVC7vo1s-Tj4xtM5cky8JEDlzajPNPjIhO91tTg7CnfGMXtNtZXIp3cl6OrHxpoujgqHKBS-iiJS6OKw1izb7UxXXYx"

const searchURL = 'https://api.openbrewerydb.org/breweries';

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
function displayResults(responseJson, results, maxResults) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();
    $('#js-error-message').empty();
    $('#js-form').removeClass('.userSearch');
    // iterate through the data array, stopping at the max number of results
    for (let i = 0; i < responseJson.length & i<maxResults; i++){
      // for each video object in the data
      //array, add a list item to the results 
      //list with the article title, source, author,
      //description, and image

      $('#results-list').append(
        `<section class="displayResults hidden">
          <span class="details">
              <span class="result">
                  <span class="imagePlaceholder"></span>
                  <h3>
                    ${responseJson[i].name}
                  </h3>
                  <p class="resultText">
                    <a href="${responseJson[i].website_url}" target="_blank">Visit this brewery's website</a>
                  <p>${responseJson[i].street}<br>${responseJson[i].city}, ${responseJson[i].state} ${responseJson[i].postal_code}</p>
                  </p>
                  <p class="rating">
                    
                  </p>
                </span>
            </span>

            </section>`
      )};

    //display the results section  
    $('#results').removeClass('hidden');
  };
  function getRatings(query, maxResults=50) {
    const params = {
        term: 'brewery',
        location: query,
        limit: maxResults,
    };
    const queryRatingString = formatQueryParams(params)
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const reqEndPoint = 'https://api.yelp.com/v3/businesses/search'+'?'+ queryRatingString
    const url = proxyUrl + reqEndPoint


    fetch(url, {headers: 
        {Authorization: `Bearer ${apiKey}`}
      })
        .then(response => response.json())
        .then(results => {
            console.log(results)
            //$('#results').append(JSON.stringify(results))
            for (let p = 0; p < results.businesses.length & p<maxResults; p++){
              console.log('show rating');
              $('.result').parent().append(
                `<p>
                  Average Rating: ${results.businesses[p].rating} out of 5 stars
                <p>`
              )
            };
        })
        .catch(err => {
            console.log(err)
        });
}

/* This function will parse together the user submitted data and the searchURL 
the data can correctly and successfully pulled from the API */
function findBrewery(query, maxResults=50) {
    const params = {
        by_city: query,
        per_page: maxResults,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
  
    console.log(url);
  
    fetch(url)
      .then(response => {
        if (maxResults <= 50) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson, results, maxResults))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong, please enter a value between 1 and 50`);
        console.log(err)
      });
  }


//This function will waits for the user to submit the data request to the API
function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      const maxResults = $('#js-search-results').val();
      findBrewery(searchTerm, maxResults);
      getRatings(searchTerm, maxResults);
    });
  }

  //Calls the watchForm function and allows the res of the code to run
  $(watchForm);



/*$(() => {
    function formatQueryParams(params) {
        const queryItems = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
    }
  })*/
    


