export function toggleItemInStorage(key, itemId) {
    // Obtiene el array actual desde localStorage o crea uno nuevo
    const items = getLocalStorage(key) || [];
  
    // Crea un nuevo array con el item agregado o eliminado
    const updatedItems = items.includes(itemId)
      ? items.filter(id => id !== itemId)
      : items.concat(itemId);
  
    // Guarda el array actualizado en localStorage
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