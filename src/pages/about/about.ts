import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  segments: string = "recife";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
  }


  dismiss() {

    this.viewCtrl.dismiss();

  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

}
