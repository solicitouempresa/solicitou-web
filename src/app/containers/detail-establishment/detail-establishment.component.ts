import { Component, OnInit } from '@angular/core';
import { FirebaseEstablishmentService } from 'src/app/services/firebase-service-establishment/firebase-establishment.service';
import { MenuModel } from 'src/app/models/menuModel';
import { EstablishmentModel } from 'src/app/models/establishment';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { GeopositioningService } from 'src/app/services/geolocation/geopositioning.service';
import { EstablishmentGeopositioningModel } from 'src/app/models/establishmentGeopositioning.model';
import { MatDialog } from '@angular/material/dialog';
import { EstablishmentCardDialogComponent } from 'src/app/dialog/establishment-card-dialog/establishment-card-dialog.component';

@Component({
  selector: 'app-detail-establishment',
  templateUrl: './detail-establishment.component.html',
  styleUrls: ['./detail-establishment.component.scss']
})
export class DetailEstablishmentComponent implements OnInit {
  public loading = true;
  public idEstablishment: any;
  public nameEstablishment: any;
  public establishment: any;
  public menuListStart: MenuModel[] | undefined;
  public menuListFilter: MenuModel[] | undefined;
  public categoryProducts: CategoryProductModel[] = [];
  public selected: any;
  public user:any;
  isOpen: boolean = false;
  operationHours: string;
  latitude: number;
  longitude: number;
  establishmentGeopositioningModel:EstablishmentGeopositioningModel;

  isFreeDelivery: boolean = true; // ou false baseado na lógica do seu app
  deliveryFee: number = 5.99;

  constructor(public dialog: MatDialog, private firebaseEstablishmentService: FirebaseEstablishmentService, private route: ActivatedRoute, private routeNavigate: Router, private geopositioningService:GeopositioningService) { 

    this.user = localStorage.getItem('user');
  }

  ngOnInit(): void {
    this.loading = true;
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.nameEstablishment = this.route.snapshot.paramMap.get('urlname');

    this.nameEstablishment ? this.firebaseEstablishmentService.getUrlName(this.nameEstablishment).then(
      result => {
        this.idEstablishment = result?.id;
        this.handleLoadingPage();
        localStorage.setItem('currentUrlName', result.urlName);
      }
    ) : this.handleLoadingPage();
  }

  handleLoadingPage() {
    this.loadCategoryProduct(this.idEstablishment);
  
        this.firebaseEstablishmentService.getId(this.idEstablishment).subscribe(resp => {
          this.establishment = resp;
      
          this.getGeolocation().then(() => {
            this.establishmentGeopositioningModel = this.geopositioningService.getGeolocationEstablishmentId(
              this.establishment,
              this.latitude,
              this.longitude
            );
            
            this.establishment = {
              ...this.establishment,
              distance: this.establishmentGeopositioningModel
            };
            
            this.isOpen = this.establishment.hours ? this.checkIfOpen(this.establishment.hours) : false;
            this.operationHours = this.establishment.hours ? this.getHours(this.establishment.hours) : '';

            this.loading = false;
            this.loadAllProducts();
          }).catch((error) => {
            console.error('Erro ao obter geolocalização', error);
            this.loading = false;
          });
        });
  }

  getHours(hours: any): string {
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    return hours[currentDay];
  }

  checkIfOpen(hours: any): boolean {
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

    if (hours[currentDay]) {
      const [open, close] = hours[currentDay].split('-').map((time: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: NumberConstructor): [any, any]; new(): any; }; }; }) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      });
      return currentTime >= open && currentTime <= close;
    }

    return false; // Fechado se não houver horário para o dia atual
  }

  openEstablishmentCard(establishment: EstablishmentModel) {
    const dialogRef = this.dialog.open(EstablishmentCardDialogComponent, {
      width: '1200px',
      data: { establishment: establishment }
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  slugToTitle(slug: string): string {
    const lowerCaseWords = new Set(['da', 'do', 'de', 'a', 'o', 'e', 'para', 'com', 'em']);

    // Função para adicionar acentos de volta
    const addAccents = (str: string) => str
      .replace(/a/g, 'á')                         // Simplesmente adicionando acento para exemplo, ajuste conforme necessário
      .replace(/e/g, 'é')
      .replace(/i/g, 'í')
      .replace(/o/g, 'ó')
      .replace(/u/g, 'ú');
  
    return slug
      .split('-')                               // Divide o slug em palavras
      .map(word => lowerCaseWords.has(word) ? word : this.capitalize(word)) // Capitaliza palavras conforme necessário
      .join(' ');      
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  loadAllProducts() {
    this.firebaseEstablishmentService.getMenu(this.idEstablishment).subscribe(resp => {
      this.menuListStart = resp.filter(f => f.statusActive === true).sort(this.compare);
      this.menuListFilter = this.menuListStart.filter(f => f.statusActive === true && f.categoryMenu === this.selected).sort(this.compare);
      this.loading = false;
    });
  }

  goToDetailProduct(id: string) {
      this.routeNavigate.navigate(['detail-product/' + this.nameEstablishment + '/' + id]);  
  }

  loadCategoryProduct(id?: string) {
    this.firebaseEstablishmentService.getAllCategoryProduct(this.idEstablishment).subscribe((response: CategoryProductModel[]) => {
      this.categoryProducts = response.sort(this.compareCategoryProduct);
      this.selected = this.categoryProducts[0]?.name;
    });
  }

  compare(a: MenuModel, b: MenuModel) {
    if (a.sequence < b.sequence)
      return -1;
    if (a.sequence > b.sequence)
      return 1;
    return 0;
  }

  compareCategoryProduct(a: CategoryProductModel, b: CategoryProductModel) {
    if (a.sequence < b.sequence)
      return -1;
    if (a.sequence > b.sequence)
      return 1;
    return 0;
  }

  getEstablishmentIcon(typeEstablishment: string): string {
    switch (typeEstablishment.toLowerCase()) {
      case 'comida':
        return 'restaurant';
      case 'farmácia':
        return 'local_pharmacy';
      case 'cabeleireiro':
        return 'content_cut';
      case 'mercado':
        return 'store';
      default:
        return 'business';
    }
  }

  goToAddItem(itemId: string, event: Event): void {
    event.stopPropagation(); // Evita que o clique na div principal seja acionado
    // Redireciona ou executa a ação desejada para o botão +
     
}


  redirectToLocation(address: string): void {
    if (address) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
}

  changeTab(event:any){
    if(this.menuListStart){
      this.menuListFilter = this.menuListStart.filter(f => f.statusActive === true && f.categoryMenu == event.tab.textLabel).sort(this.compare);
    } else {
      this.menuListFilter = [];
    }
   
  }

  getGeolocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.geopositioningService.getCurrentPosition().then((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        resolve(); 
      }).catch((error) => {
        reject(error);
      });
    });
  }

}
