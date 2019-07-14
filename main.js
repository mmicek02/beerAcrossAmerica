'use strict';

const apiKey = 'ZiOslbWC3YWLeCID4hI1zi8dUZaUYz85j5IDsRRp';

const searchURL = 'https://developer.nps.gov/api/v1/parks';

/* This function takes the data from the user and puts it a format that can
be manipulated by the rest of the code */ 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

/* This function will show all of the state park results, with a maximum of ten 
results. It displays the name of the park, a short description, a webiste, and
the park address */
function displayResults(responseJson, maxResults) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('#results-list').empty();
    $('#js-error-message').empty();
    // iterate through the data array, stopping at the max number of results
    for (let i = 0; i < responseJson.data.length & i<maxResults ; i++){
      // for each video object in the data
      //array, add a list item to the results 
      //list with the article title, source, author,
      //description, and image
      $('#results-list').append(
        `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
        <p>${responseJson.data[i].description}</p>
        <p><a href="${responseJson.data[i].url}">Vist this park's website</a></p>
        <p><a href="${responseJson.data[i].directionsUrl}">Click here for directions</a></p>
        </li>`
      )};
    //display the results section  
    $('#results').removeClass('hidden');
  };

/* This function will parse together the user submitted data and the searchURL 
the data can correctly and successfully pulled from the API */
function findStateParks(query, maxResults=10) {
    const params = {
        stateCode: query,
        limit: maxResults,
        api_key: apiKey,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
  
    console.log(url);
  
    /*const options = {
      headers: new Headers({
        "X-Api-Key": apiKey})
    };*/
  
    fetch(url)
      .then(response => {
        if (maxResults <= 10) {
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