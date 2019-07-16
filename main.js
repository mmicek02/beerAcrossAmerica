'use strict';

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
function displayResults(responseJson, maxResults) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();
    $('#js-error-message').empty();
    // iterate through the data array, stopping at the max number of results
    for (let i = 0; i < responseJson.length & i<maxResults ; i++){
      // for each video object in the data
      //array, add a list item to the results 
      //list with the article title, source, author,
      //description, and image
      $('#results-list').append(
        /*`<span class="result">
          <h3><a href="${responseJson[i].website_url}">${responseJson[i].name}</a></h3>
        <p>${responseJson[i].brewery_type}</p>
        <p><a href="${responseJson[i].website_url}">Vist this park's website</a></p>
        <p>${responseJson[i].street}</p>
        </span>`*/
        `<section class="displayResults hidden">
          <span class="details">
              <span class="result">
                  <span class="imagePlaceholder"></span>
                  <h3>
                    <a href="${responseJson[i].website_url}">${responseJson[i].name}</a>
                  </h3>
                  <p class="resultText">
                    <p>
                      <a href="${responseJson[i].website_url}">Visit this brewery's website</a>
                    </p>
                    <p>${responseJson[i].street}<br>${responseJson[i].city}, ${responseJson[i].state}</p>
                  </p>
          </span>
        </span>`
      )};
    //display the results section  
    $('#results').removeClass('hidden');
  };

/* This function will parse together the user submitted data and the searchURL 
the data can correctly and successfully pulled from the API */
function findStateParks(query, maxResults=50) {
    const params = {
        by_state: query,
        per_page: maxResults,
        sort: 'type,name',
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
      .then(responseJson => displayResults(responseJson, maxResults))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong, please enter a value between 1 and 10`);
      });
  }

//This function will waits for the user to submit the data request to the API
function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      const maxResults = $('#js-search-results').val();
      findStateParks(searchTerm, maxResults);
    });
  }
  //Calls the watchForm function and allows the res of the code to run
  $(watchForm);