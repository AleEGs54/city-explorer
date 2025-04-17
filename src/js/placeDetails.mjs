import { buildDetailedCard, buildInformativeCard } from "./userInterface.mjs";
import { toShare } from "./utils.mjs"; 



export default class PlaceDetails {
    constructor(data) {
        this.data = data;
    }


    displayDetailedCard() {
        const main = document.querySelector('main');
        buildDetailedCard(main,this.data);
        toShare(document.querySelector('.button-share'), window.location.href, true, 'Copied!');

    }

    displayInformativeCard(htmlParentElement){
        const element = document.querySelector(htmlParentElement);
        buildInformativeCard(element,this.data);
    }



}

