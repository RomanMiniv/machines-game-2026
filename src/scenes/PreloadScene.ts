import { Scene } from "phaser";
import { LoaderUI } from "../components/LoaderUI";
import playerURL from "@assets/images/player.png";

export class PreloadScene extends Scene {
  constructor() {
    super({
      key: "PreloadScene"
    });
  }

  preload() {
    //  Load the assets for the game

    new LoaderUI(this).drawLoader();

    this.load.image("player", playerURL);

    // TODO: delete mock data
    this.load.image("test1", "https://www.justpushstart.com/wp-content/uploads/2010/12/popww5.jpg");
    this.load.image("test2", "https://princeofpersia.fandom.com/wiki/Prince_%28Sands_of_Time%29");
    this.load.image("test3", "https://www.thegamer.com/prince-of-persia-the-sands-of-time-remake-trophy-achievement-list-leaked-again/");
    this.load.image("test4", "https://d1lss44hh2trtw.cloudfront.net/assets/editorial/2023/05/prince-of-persia-remake.jpg");
    this.load.image("test5", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvSkpTn1beylRbu3--foS8cgw5CEnBTpPYrw&s");
  }

  create() {
    this.scene.start("MenuScene");
  }
}
