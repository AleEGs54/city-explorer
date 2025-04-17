export function capitalizeFirstLetter(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeEachWord(text) {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function replaceUnderscoresWithSpaces(text) {
  return text.replace(/_/g, ' ');
}


export async function loadTemplate(path) {
  try {
    const response = await fetch(path);
    if (response.ok) {
      const data = await response.text();
      return data;
    }

    throw new Error(`Fetch Error: ${response.status}`);
  } catch (err) {
    console.error(err);
  }
}

export async function loadHeaderFooter() {
  // get parent element
  const parentHeader = document.getElementById("header");
  const parentFooter = document.getElementById("footer");

  // get path
  const headerPath = "/partials/header.html";
  const footerPath = "/partials/footer.html";

  // get template
  const header = await loadTemplate(headerPath);
  const footer = await loadTemplate(footerPath);

  // render template
  parentHeader.innerHTML = header;
  parentFooter.innerHTML = footer;

  toShare(document.querySelector('.toCopy'), window.location.href, true, 'Thanks for Sharing!')
}


export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const place = urlParams.get(param);
  return place;
}

export function toShare(htmlElement, text, toMessage=false, message=''){
  htmlElement.addEventListener('click', async ()=>{
    await navigator.clipboard.writeText(text)
    if (toMessage) {
      htmlElement.textContent=message
    }
  })

}