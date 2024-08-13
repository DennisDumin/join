const BASE_URL = "https://contacts-881f2-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data from the specified path.
 * This function sends a GET request to the server and returns the data in JSON format.
 * @param {string} [path=""] - The path to append to the base URL for the request.
 * @returns {Promise<Object>} A promise that resolves to the fetched JSON data.
 */
async function getData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}

/**
 * Sends data to the server using a POST request.
 * This function sends a POST request to the server with the provided data and returns the response in JSON format.
 * @param {string} [path=""] - The path to append to the base URL for the request.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<Object>} A promise that resolves to the response JSON data.
 */
async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Updates data on the server using a PUT request.
 * This function sends a PUT request to the server with the provided data and returns the response in JSON format.
 * @param {string} [path=""] - The path to append to the base URL for the request.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<Object>} A promise that resolves to the response JSON data.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Deletes data from the server at the specified path.
 * This function sends a DELETE request to the server and returns the response in JSON format.
 * @param {string} [path=""] - The path to append to the base URL for the request.
 * @returns {Promise<Object>} A promise that resolves to the response JSON data.
 */
async function deleteDate(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}
