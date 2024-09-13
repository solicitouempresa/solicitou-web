import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EstablishmentModel } from 'src/app/models/establishment';
import { EstablishmentGeopositioningModel } from 'src/app/models/establishmentGeopositioning.model';
import { ReviewModel } from 'src/app/models/review';
import { FirebaseEstablishmentService } from 'src/app/services/firebase-service-establishment/firebase-establishment.service';
import { GeopositioningService } from 'src/app/services/geolocation/geopositioning.service';

@Component({
  selector: 'app-list-establishments',
  templateUrl: './list-establishments.component.html',
  styleUrls: ['./list-establishments.component.scss']
})
export class ListEstablishmentsComponent implements OnInit {
  public loading: any;
  public establishmentListRestaurant: EstablishmentModel[] | undefined;
  public establishmentListCafeteria: EstablishmentModel[] | undefined;
  public establishmentListBakery: EstablishmentModel[] | undefined;
  public establishmentListJapanese: EstablishmentModel[] | undefined;
  stars: number[] = [1, 2, 3, 4, 5];
  visibleItems: any[] = [];
  itemsPerPage: number = 5;
  filteredEstablishments: any[] = [];
  searchTerm: string = '';
  moreVisible: boolean = true;
  isOpen: boolean = false;
  latitude: number;
  longitude: number;
  establishmentGeopositioningModel:EstablishmentGeopositioningModel[];

  constructor(private firebaseEstablishmentService: FirebaseEstablishmentService, private router: Router, private geopositioningService:GeopositioningService) {
    this.getGeolocation();
  }

  title = 'solicitou-web';

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem('user')!);
    var data  = JSON.parse(localStorage.getItem('completeUser')!);
    if(user != null && (data === null || data.displayName === null || data.displayName === '')) {
      this.router.navigate(['continue-signup']);
    } 
    this.loading = true;
      this.getGeolocation().then(() => {
        this.firebaseEstablishmentService.getAllEstablishments().subscribe(resp => {
          this.establishmentGeopositioningModel = this.geopositioningService.getGeolocationEstablishmentList(resp, this.latitude, this.longitude);
      
          type ExtendedEstablishmentModel = EstablishmentModel & {
            distance: number | null;
            isOpen: boolean;
          };
          
          this.establishmentListRestaurant = resp
            .map(establishment => {
              const geopositioning = this.establishmentGeopositioningModel.find(geo => geo.establishment.id === establishment.id);
              return {
                ...establishment,
                distance: geopositioning ? geopositioning.distance : null,
                isOpen: establishment.hours ? this.checkIfOpen(establishment.hours) : false
              };
            })
            .filter(f => f.statusActive === true)
            .sort((a, b) => {
              const aHasHours = a.hours !== undefined && a.hours !== null;
              const bHasHours = b.hours !== undefined && b.hours !== null;
          
              if (a.isOpen && !b.isOpen) {
                return -1;
              } else if (!a.isOpen && b.isOpen) {
                return 1;
              } else if (aHasHours && !bHasHours) {
                return -1;
              } else if (!aHasHours && bHasHours) {
                return 1;
              } else if (a.distance !== null && b.distance !== null) {
                return a.distance - b.distance;
              } else if (a.distance !== null) {
                return -1;
              } else if (b.distance !== null) {
                return 1;
              } else {
                return 0;
              }
            }) as ExtendedEstablishmentModel[];
               

          // this.establishmentListRestaurant
          // .filter(f => f.statusActive === true)
          // .sort((a, b) => {
          //   const aHasHours = a.hours !== undefined && a.hours !== null;
          //   const bHasHours = b.hours !== undefined && b.hours !== null;
      
          //   const aIsOpen = aHasHours ? this.checkIfOpen(a.hours) : false;
          //   const bIsOpen = bHasHours ? this.checkIfOpen(b.hours) : false;
      
          //   if (aIsOpen && !bIsOpen) {
          //     return -1;
          //   } else if (!aIsOpen && bIsOpen) {
          //     return 1;
          //   } else if (aHasHours && !bHasHours) {
          //     return -1;
          //   } else if (!aHasHours && bHasHours) {
          //     return 1;
          //   } else {
          //     return 0;
          //   }
          // });

          this.loadMore();
          this.loading = false;
        });
      }).catch((error) => {
        console.error('Erro ao obter geolocalização', error);
        this.loading = false;
      });
  
  }

  checkIfOpen(hours: any): boolean {
    if(hours === undefined) {
      return false;
    }
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

  filterEstablishments() {
    if (this.searchTerm) {
      this.filteredEstablishments = this.establishmentListRestaurant!.filter(establishment =>
        establishment.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.moreVisible = false;
    } else {
      this.filteredEstablishments = [];
      this.moreVisible = true;
    }
  }

  selectSuggestion(item: any) {
    this.searchTerm = item.name;
    this.filteredEstablishments = [];
    this.loadVisibleItems();
  }

  loadVisibleItems() {
    if (this.searchTerm) {
      this.visibleItems = this.establishmentListRestaurant!.filter(establishment =>
        establishment.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadMore();
    }
  }

  calculateAverageRating(review: ReviewModel[]): number {
    if (review?.length === 0) {
      return 0;
    }

    const totalRating = review.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / review.length;
    return averageRating;
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredEstablishments = [];
    this.loadVisibleItems();
    this.moreVisible = true;
  }

  loadMore() {
    const nextItems = this.establishmentListRestaurant?.slice(this.visibleItems.length, this.visibleItems.length + this.itemsPerPage);
    this.visibleItems = [...this.visibleItems, ...nextItems!];  
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  getUrlName(urlName: string) : string {
    return urlName;
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
  
  formatNumberToDecimal(number: number): string {
    return number.toFixed(1);
  }

}
