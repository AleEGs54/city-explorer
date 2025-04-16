import { buildDetailedCard, buildFavoriteCard } from "./userInterface.mjs";



export default class PlaceDetails {
    constructor(data) {
        this.data = data;
    }


    displayDetailedCard() {
        const main = document.querySelector('main');
        buildDetailedCard(main,this.data);

    }

    displayFavoriteCard(){
        const main = document.querySelector('cards');
        buildFavoriteCard(main,this.data);
    }



}

