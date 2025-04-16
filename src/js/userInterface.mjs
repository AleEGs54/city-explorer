import { capitalizeEachWord, replaceUnderscoresWithSpaces } from "./utils.mjs";
import { getLocalStorage } from "./localStorageManagement.mjs";

/**
 * Checks if a place is currently open based on a provided schedule.
 * If open, returns 'Open until [hour]' if closing within 2 hours, otherwise 'Open Now'.
 * If closed, calculates the next opening day and returns 'Closed today. Opening again on {day}'.
 *
 * @param {Array<Object>} periods - An array of objects defining the opening periods.
 * Each object must have 'open' and 'close' properties,
 * each containing 'day', 'hour', and 'minute'.
 * 'day' corresponds to the day of the week (Sunday=0, Monday=1, ..., Saturday=6).
 * 'hour' is in 24-hour format (0-23).
 * 'minute' is 0-59.
 * @returns {string} - A string indicating the current status and next opening day if closed,
 * or the closing time if open and closing soon.
 */
function getOpeningStatusString(periods) {

  // If periods is undefined, null, or an empty array, return an empty string
  if (!periods || periods.length === 0) {
    return '';
  }
  // Helper array for day names
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // 1. Get the current time
  const now = new Date();
  const currentDay = now.getDay(); // Sunday=0, ..., Saturday=6
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let isOpen = false;
  let closingHour = -1;
  let closingMinute = -1;
  let nextOpeningDay = -1; // -1 indicates not found yet

  // 2. Check if currently open and if closing soon
  for (const period of periods) {
    if (period.open.day === currentDay) {
      const openHour = period.open.hour;
      const openMinute = period.open.minute;
      const closeHour = period.close.hour;
      const closeMinute = period.close.minute;

      const afterOpenTime = (currentHour > openHour) || (currentHour === openHour && currentMinute >= openMinute);
      const beforeCloseTime = (currentHour < closeHour) || (currentHour === closeHour && currentMinute < closeMinute);

      if (afterOpenTime && beforeCloseTime) {
        isOpen = true;
        closingHour = closeHour;
        closingMinute = closeMinute;
        break; // Found an open period, no need to check further
      }
    }
  }

  // 3. Return 'Open until [hour]' if closing within 2 hours, otherwise 'Open Now'
  if (isOpen) {
    const timeUntilCloseInMinutes = (closingHour * 60 + closingMinute) - (currentHour * 60 + currentMinute);
    if (timeUntilCloseInMinutes <= 120 && timeUntilCloseInMinutes > 0) {
      const closingTimeFormatted = formatTime(closingHour, closingMinute);
      return `Open Now until ${closingTimeFormatted}`;
    } else {
      return 'Open Now';
    }
  }

  // 4. If closed, find the next opening time
  // First, check for openings later today
  let opensLaterToday = false;
  for (const period of periods) {
    if (period.open.day === currentDay) {
      const openHour = period.open.hour;
      const openMinute = period.open.minute;
      // Check if the opening time is later than the current time
      if ((openHour > currentHour) || (openHour === currentHour && openMinute > currentMinute)) {
        opensLaterToday = true;
        nextOpeningDay = currentDay;
        break; // Found the next opening is later today
      }
    }
  }


  // If not opening later today, check subsequent days
  if (!opensLaterToday) {
    for (let i = 1; i <= 7; i++) { // Check the next 7 days
      const searchDay = (currentDay + i) % 7;
      for (const period of periods) {
        if (period.open.day === searchDay) {
          nextOpeningDay = searchDay;
          // Break both loops as we found the earliest next opening day
          i = 8; // Force outer loop to terminate
          break;
        }
      }
    }
  }

  // 5. Format the 'Closed' message
  if (nextOpeningDay !== -1) {
    return `Closed today. Opening again on ${dayNames[nextOpeningDay]}`;
  } else {
    // Should not happen with a valid schedule, but handle it just in case
    return 'Closed indefinitely';
  }
}

/**
 * Formats the time in 12-hour format with am/pm.
 * @param {number} hour - The hour (0-23).
 * @param {number} minute - The minute (0-59).
 * @returns {string} - The formatted time string (e.g., 10:30pm).
 */
function formatTime(hour, minute) {
  const period = hour < 12 ? 'am' : 'pm';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const formattedMinute = minute < 10 ? `0${minute}` : minute;
  return `${formattedHour}:${formattedMinute}${period}`;
}


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

function checkAvailability(info, callback) {
  if (info !== null && info !== undefined && !(Array.isArray(info) && info.length === 0)) {
    return callback(info);
  } else {
    return "Information not available at the moment.";
  }
}


export function buildSimpleCard(htmlParentElement, place) {

  //If pictures are not available, dont create the card.
  if (!place.photos || place.photos.length === 0 || !place.photos[0].getURI) {
    return;
  }

  htmlParentElement.insertAdjacentHTML('beforeend', `
    <a href="./placeDetails/?place=${place.id}" class="card-link">
      <div class="card" data-id=${place.id}>
        <div class="card-image">
          <img src="${checkAvailability(place?.photos, () => place.photos[0].getURI())}" alt="image placeholder" class="suggestion-place-image">
          <svg class="suggestion-check-icon" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
      <style>.cls-1{fill:currentColor;}</style>
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
    </a>
  `);
}

export function buildFavoriteCard(htmlParentElement, place){
  htmlParentElement.insertAdjacentHTML('beforeend', `
    <div class='card'>
      <div class="picture-container">
        <img src="${checkAvailability(place?.photos, () => place.photos[0].getURI())}" alt="${place.displayName}'s picture" width='300' height='300'>
      </div>
      <div class="place-information">
        <h2 classs'place-name'>${place.displayName}</h2>
        <span class='stars-container'>
          ${generateStars(place.rating)}
          <p>${place.rating}</p>
        </span>
        <span class='place-price'>
         Estimated Cost: ${generatePriceLevel(place.priceLevel)}
        </span>
        <span class='place-open'>
          ${checkAvailability(
            place.regularOpeningHours?.periods,
            (periods) => getOpeningStatusString(periods))}
        </span>
        <span class='small-review'>
        <svg xmlns="http://www.w3.org/2000/svg" width='24' viewBox="0 0 512 512"><path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z"/></svg>
            ${resizeText(place.reviews[0].text)}
        </span>
        <span class='place-types'>
            ${place.types.slice(0, 2).map(type => `<div class='type'>${capitalizeEachWord(replaceUnderscoresWithSpaces(type))}</div>`).join('')}
        </span>
      </div>
    </div>
    `)
}

export function buildDetailedCard(htmlParentElement, place) {
  htmlParentElement.insertAdjacentHTML('beforeend', `
<div class="place-details-container">
  <div class="place-details-pictures-container">
    <img src="${checkAvailability(place?.photos, () => place.photos[0].getURI())}" alt="${place.displayName}'s picture">
  </div>
  <div class="place-details-mainInformation">
    <section class="place-details-mainInformation-reviewSummary">
    <h1 class='place-title'>${place.displayName}</h1>
    <div class="review-summary">
      <div class="stars-container">${generateStars(place.rating)} <p>${place.rating}</p></div>
      <div class="reviews-container">
      <svg xmlns="http://www.w3.org/2000/svg" width='24' viewBox="0 0 512 512"><path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z"/></svg>
      <p>
      ${place.reviews.length} Reviews
      </p>
      </div>
    </div>
    <div class='open-until'>
      ${checkAvailability(
    place.regularOpeningHours?.periods,
    (periods) => getOpeningStatusString(periods))}
    </div>
    <div class='buttons-list'>
      <button class='button-review'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width='24' viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
      <span>Write a review</span>
      </button>
      <button class='button-share'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" width='18' viewBox="0 0 448 512"><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"/></svg>
      <span>Share this Place</span>
      </button>
      <button class='button-favorites'>
        <svg class="suggestion-heart-icon" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <span>Add to Favorites</span>
      </button>
    </div>
    </section>
    <section class="place-details-mainInformation-contactInformation">
      <h2 class='subtitle'>Contact Information</h2>
      <span class='contactInformation'>
      ${checkAvailability(place?.websiteURI, () => `<a href="${place.websiteURI}">Visit the official website!</a>`)}
        <svg xmlns="http://www.w3.org/2000/svg" width='24' viewBox="0 0 512 512"><path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-128c0-17.7-14.3-32-32-32L352 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>
      </span>
      <span class='contactInformation'>
      ${checkAvailability(place?.internationalPhoneNumber, () => `<p>${place.internationalPhoneNumber}</p>`)}
        <svg xmlns="http://www.w3.org/2000/svg" width='24' viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
      </span>
      <span class='contactInformation'>
        <adress>
        ${checkAvailability(place?.formattedAddress, () => `${place.formattedAddress}`)}
        </adress>
        <svg xmlns="http://www.w3.org/2000/svg" width='24' viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
      </span>
    </section>
  </div>
  <div class='place-details-location-hours'>
    <h2 >Location & Hours</h2>
    <div class="location-hours">
      <div class="map-picture">
        <div id="map"></div>
        <address>${checkAvailability(place?.formattedAddress, () => `${place.formattedAddress}`)}</address>
      </div>
      <div class='schedule-container'>
      ${checkAvailability(
      place.regularOpeningHours?.weekdayDescriptions,
      (days) => days.map(day => `<div class="weekdayDescription">${day}</div>`).join(''),
      ''
    )}
      </div>
    </div>
  </div>
  <div class='place-details-review-highlights'>
    <h2>Review Highlights</h2>
    <div class='reviews'>
    ${checkAvailability(place?.reviews, () => place.reviews.map(review => {
      return `
          <div class='review-box'>
          <img src="${review.authorAttribution.photoURI}" alt=""> 
          <p class='review-text'>${review.text}</p>
          </div>`}).join(''))}
    </div>
  </div>
</div>
    `)
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
        <span id="place-address">
          <div class="subtitle">Address:</div>
          ${place.formattedAddress}</span>

          <div class="suggestions-section-cost">
            <a href="/placeDetails/?place=${place.id}" class="subtitle">Detailed Information</a>
        </div>
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