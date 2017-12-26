import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, ViewController, ModalController, Searchbar, AlertController } from 'ionic-angular';

import { AboutPage } from './../about/about';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef; //Acessa o elemento 'map' do DOM e declara do tipo ElementRef
  @ViewChild('searchbar') searchbar: Searchbar; //Acessa o elemento 'searchbar' do DOM e declara do tipo Searchbar
  private map: any; //Declaração da variável map 
  private start = ''; //Declaração da variável start
  private end = ''; //Declaração da variável end
  private directionsService = new google.maps.DirectionsService; //Objeto se comunica com serviço Directions da Google Maps API, que recebe solicitações de rotas e retorna resultados calculados
  private directionsDisplay = new google.maps.DirectionsRenderer; //Renderiza os resultados das rotas calculadas do 'DirectionsService'
  private autocompleteItems: any; //Declaração da variável 'autocompleteItems'
  private autocomplete: any; //Declaração da variável 'autocomplete'
  private acService: any; //Declaração da variável 'acService'
  private placesService: any; //Declaração da variável 'placesService'
  private latitude: number; //Declaração da variável 'latitude'
  private longitude: number; //Declaração da variável 'longitude'
  private locaisFundaj: any[]; //Declaração da variável 'locaisFundaj'
  private nameLocal = 'Selecione o local';
  private statusLocal = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {

          this.acService = new google.maps.places.AutocompleteService(); //Inicializa com a funcionalidade do autocomplete places do Google Maps API 
          this.autocompleteItems = []; //Inicializa a variável como um vetor vazio
          this.autocomplete = {

              query: ''

          };

          this.locaisFundaj = [

            {name: 'Universidade Federal de Pernambuco', value: 'Av. Prof. Moraes Rego, 1235 - Cidade Universitária, Recife - PE, 50670-901'},
            {name: 'Universidade Federal Rural de Pernambuco', value: 'R. Manuel de Medeiros, s/n - Dois Irmãos, Recife - PE, 52171-900'},
            {name: 'Instituto Federal de Pernambuco', value: 'Rua Edson Barbosa de Araújo, s/n, Bairro Manoela Valadares 56800-000, Afogados da Ingazeira - PE, 56800-000'},
            {name: 'Universidade Federal do Vale do São Francisco', value: 'Av. José de Sá Maniçoba, s/n - Centro, Petrolina - PE, 56304-917'},
            {name: 'Instituto Federal do Sertão Pernambuco', value: 'R. Cel. Amorim, 76 - Centro, Petrolina - PE, 56302-320'},
            {name: 'Universidade Federal de Pernambuco - Caruaru', value: 'Rodovia BR-104, Km 59, s/n - Nova Caruaru, Caruaru - PE, 55002-970'}

          ] 

  }

  selecionarLocal(local: any) {

      this.nameLocal = local.name;
      console.log(this.nameLocal);
      this.end = local.value;
      console.log(this.end);
      this.statusLocal = !this.statusLocal;

  }

  mudarStatus() {

      this.statusLocal = !this.statusLocal;

  }

  chooseItem(item: any) {

      console.log('modal > chooseItem > item > ', item.description); //Exibe no console o lugar selecionado

      this.searchbar.setValue(item.description); //Insere na tag <ion-searchbar></ion-searchbar> o lugar selecionado

      this.autocompleteItems = []; //Reinicializa o vetor autocompleteItems;

      this.start = item.description; //A variável 'start' recebe o lugar selecionado

      console.log(item.description); //Exibe no console o lugar selecionado

  }

  updateSearch() {

      console.log('modal > updatesearch'); //Exibe no console a informação

      //Verifica se a pesquisa é válida
      if(this.autocomplete.query == '') {

          this.autocompleteItems = []; //Vetor vazio

          return;

      }

      let self = this;


      this.acService.getPlacePredictions({ input: this.autocomplete.query }, (predictions, status) => {

          console.log('modal > getPlacePredictions > status > ', status); //Exibe no console o valor do status

          self.autocompleteItems = [];//Recebe um vetor vazio
          
          console.log(predictions); //Exibe no console o valor de predictions

          this.zone.run(() => {

              if(predictions == null) {

                 let alert = this.alertCtrl.create({

                    title: 'Endereço inválido',
                    subTitle: 'Por favor, tente novamente!',
                    buttons: ['OK']

                  });

                  alert.present();

              } else {

                        predictions.forEach((prediction) => {

                                 this.autocompleteItems.push(prediction);
                            

                          
                    
                    });

            }      

        });

    });

}

  initMap() { // este código inicializa o mapa no local desejado

    this.map = new google.maps.Map(this.mapElement.nativeElement, {

      zoom: 15,
      center: {lat: -8.0578381, lng: -34.8828969 } // latitude e longitudo

    });

    this.directionsDisplay.setMap(this.map);

  }

 calculateAndDisplayRoute() { // este código calcula a distância inicial e final

      this.directionsService.route({

        origin: this.start, // pega a origem
        destination: this.end, //pega o destino
        travelMode: 'DRIVING'

      }, (response, status) => {

            if (status === 'OK') {

                this.directionsDisplay.setDirections(response); // se ocorrer tudo bem

            } else {

                let alert = this.alertCtrl.create({

                      title: 'Rota inválida',
                      subTitle: 'Por favor, rota indisponível!',
                      buttons: ['OK']

                    });

                alert.present();
            
            }

        });

    }

    openModal() {
        const aboutModal = this.modalCtrl.create(AboutPage);
        aboutModal.present();
   }

  autoOpen() {

        const aboutModal = this.modalCtrl.create(AboutPage);

        setTimeout(() => aboutModal.present(), 2000);     

  }

  ionViewDidLoad() {

      this.initMap();

      this.autoOpen();

   }

}
