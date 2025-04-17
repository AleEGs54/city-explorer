export function toggleItemInStorage(key, itemId) {
  // Get the localStorage's array or creates a new one
  const items = getLocalStorage(key) || [];

  // Creates a new array with or without the item
  const updatedItems = items.includes(itemId)
    ? items.filter(id => id !== itemId)
    : items.concat(itemId);

  // Stores the updated array at localStorage
  setLocalStorage(key, updatedItems);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}