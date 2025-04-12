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