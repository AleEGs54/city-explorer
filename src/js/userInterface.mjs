import { capitalizeEachWord, replaceUnderscoresWithSpaces } from "./utils.mjs";
import { getLocalStorage } from "./localStorageManagement.mjs";


function generateStars(rating) {
  const totalStars = 5;
  const fullStars = Math.round(rating);

  let stars = "";

  for (let i = 1; i <= totalStars; i++) {
    const isFilled = i <= fullStars;
    stars += `
      <svg class="star-icon${isFilled ? ' filled' : ''}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="${isFilled ? 'gold' : 'transparent'}" />
        <path d="M10.7878 3.10263C11.283 2.09926 12.7138 2.09925 13.209 3.10263L15.567 7.88036L20.8395 8.6465C21.9468 8.8074 22.3889 10.1682 21.5877 10.9492L17.7724 14.6681L18.6731 19.9193C18.8622 21.0222 17.7047 21.8632 16.7143 21.3425L11.9984 18.8632L7.28252 21.3425C6.29213 21.8632 5.13459 21.0222 5.32374 19.9193L6.2244 14.6681L2.40916 10.9492C1.60791 10.1682 2.05005 8.8074 3.15735 8.6465L8.42988 7.88036L10.7878 3.10263ZM11.9984 4.03903L9.74008 8.61492C9.54344 9.01336 9.16332 9.28953 8.72361 9.35343L3.67382 10.0872L7.32788 13.649C7.64606 13.9592 7.79125 14.406 7.71614 14.844L6.85353 19.8734L11.3702 17.4988C11.7635 17.292 12.2333 17.292 12.6266 17.4988L17.1433 19.8734L16.2807 14.844C16.2056 14.406 16.3508 13.9592 16.6689 13.649L20.323 10.0872L15.2732 9.35343C14.8335 9.28953 14.4534 9.01336 14.2568 8.61492L11.9984 4.03903Z"
          stroke="black"
          fill="currentColor"/>
      </svg>
    `;
  }

  return stars;
}

function generatePriceLevel(level) {

  let priceNumber;

  switch (level) {
    case "FREE":
      return 'Free';
      break;
    case "INEXPENSIVE":
      priceNumber = 1;
      break;
    case "MODERATE":
      priceNumber = 2;
      break;
    case "EXPENSIVE":
      priceNumber = 3;
      break;
    case "VERY EXPENSIVE":
      priceNumber = 4;
      break;
    default:
      return 'Free';
  }


  return '<svg class="price-icon" width="20" height="20" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M302.1 358.1C293.2 407.8 251.4 439.4 192 446.4V480c0 17.67-14.28 32-31.96 32S128 497.7 128 480v-34.96c-.4434-.0645-.8359-.0313-1.281-.0977c-26.19-3.766-53.69-13.2-77.94-21.53l-11.03-3.766C21.03 414 12.03 395.8 17.69 379.1s23.88-25.73 40.56-20.08l11.31 3.859c21.59 7.406 46.03 15.81 66.41 18.73c47.09 6.953 97.06-.8438 103.1-34.09c5.188-28.55-11.16-39.89-87.53-60.7L136.5 282.7C92.59 270.4 1.25 244.9 17.97 153C26.82 104.1 68.44 72.48 128 65.51V32c0-17.67 14.33-32 32.02-32S192 14.33 192 32v34.95c.4414 .0625 .8398 .0449 1.281 .1113c16.91 2.531 36.22 7.469 60.72 15.55c16.81 5.531 25.94 23.61 20.41 40.41c-5.531 16.77-23.69 25.86-40.41 20.38c-20.72-6.812-37.12-11.08-50.16-13.02C137 123.4 86.97 131.2 80.91 164.5C76.5 188.8 85.66 202 153.8 221l14.59 4.016C228.3 241.4 318.9 266.1 302.1 358.1z"/></svg>'.repeat(priceNumber);
}

function resizeText(text, limit = 100) {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
}


export function buildSimpleCard(htmlParentElement, place) {

  //If pictures are not available, dont create the card.
  if (!place.photos || place.photos.length === 0 || !place.photos[0].getURI) {
    return;
  }

  htmlParentElement.insertAdjacentHTML('beforeend', `
    <div class="card" data-id=${place.id}>
      <div class="card-image">
        <img src="${place.photos[0].getURI()}" alt="image placeholder" class="suggestion-place-image">
        <svg class="suggestion-check-icon" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>.cls-1{fill:currentColor;}</style> <!-- importante: usa currentColor -->
  </defs>
  <title/>
  <g data-name="Layer 28" id="Layer_28">
    <path class="cls-1" d="M16,31A15,15,0,1,1,31,16,15,15,0,0,1,16,31ZM16,3A13,13,0,1,0,29,16,13,13,0,0,0,16,3Z"/>
    <path class="cls-1" d="M13.67,22a1,1,0,0,1-.73-.32l-4.67-5a1,1,0,0,1,1.46-1.36l3.94,4.21,8.6-9.21a1,1,0,1,1,1.46,1.36l-9.33,10A1,1,0,0,1,13.67,22Z"/>
  </g>
</svg>

        <svg class="suggestion-heart-icon" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </div>
      <div class="suggestions-card-information">
        <h3 class="suggestions-title">${place.displayName}</h3>
        <div class="suggestions-section-stars">
          <div class="suggestions-stars-container">${generateStars(place.rating)}</div>
          <small class='extra-info'> - ${place.userRatingCount} reviews</small>
        </div>
        <div class="suggestions-section-cost">
          ${generatePriceLevel(place.priceLevel)}
        </div>
        <small class='extra-info'>${capitalizeEachWord(replaceUnderscoresWithSpaces(place.primaryType))}</small>
        <div class="suggestion-description">
          <p class='suggestion-description-text'>${resizeText(place.reviews[0].text)
    }</p>
        </div>
      </div>
    </div>
  `);
}

export function buildBodyCarousel(title, htmlParentElement) {
  htmlParentElement.insertAdjacentHTML('beforeend', `
        
        <div class="suggestions-header">
          <h2 class="suggestions-header-title">${title}</h2>
          <div class="arrows">
            <button type="button" aria-label="Go to the previous suggestion">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
              </svg>
            </button>
            <button type="button" aria-label="Go to the next suggestion">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="carousel-container">
        </div>

  `)
}

export function buildInfoWindowCard(place) {
  const content =
    `
    <div id="infowindow-content">
        <span id="place-displayname" class="title">
        <strong>${place.displayName}</strong>
        <br />
        <p class='extra-info'>
        ${capitalizeEachWord(replaceUnderscoresWithSpaces(place.primaryType))}
        </p>
        </span>
        
        <div class="suggestions-section-stars">
        <div class="subtitle">Valoration:</div> 
          <div class="suggestions-stars-container">
          ${generateStars(place.rating)}</div>
          <p class='extra-info'> - ${place.userRatingCount} reviews</p>
        </div>
        <div class="suggestions-section-cost">
        <div class="subtitle">Average Price: </div>
          ${generatePriceLevel(place.priceLevel)}
        </div>
        <span id="place-address"><div class="subtitle">Address:</div> ${place.formattedAddress}</span>
    </div>
`;
  return content;
}

export function setIconState(htmlParentElement, iconName) {
  const icon = htmlParentElement.querySelector(`${iconName}`)
  icon.classList.toggle('on');
}

/**
 * Turns on the icons whose ID is at local storage.
*/
export function initializeIconStates() {
  const likedPlaces = getLocalStorage('likedPlaces') || [];
  const visitedPlaces = getLocalStorage('visitedPlaces') || [];

  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    const placeId = card.dataset.id;

    const heartIcon = card.querySelector('.suggestion-heart-icon');
    const checkIcon = card.querySelector('.suggestion-check-icon');

    // Verifica si placeId está en localStorage y agrega la clase 'on'
    if (likedPlaces.includes(placeId)) {
      heartIcon.classList.add('on');
    } else {
      heartIcon.classList.remove('on');
    }

    if (visitedPlaces.includes(placeId)) {
      checkIcon.classList.add('on');
    } else {
      checkIcon.classList.remove('on');
    }
  });
}