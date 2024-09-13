import { Injectable } from '@angular/core';
import { FirebaseEstablishmentService } from '../firebase-service-establishment/firebase-establishment.service';
import { EstablishmentModel } from 'src/app/models/establishment';
import { EstablishmentGeopositioningModel } from 'src/app/models/establishmentGeopositioning.model';

@Injectable({
  providedIn: 'root'
})
export class GeopositioningService {

  constructor(private firebaseEstablishmentService: FirebaseEstablishmentService) { }

  public getGeolocationEstablishmentId(establishment: EstablishmentModel, userLatitude: number, userLongitude: number): EstablishmentGeopositioningModel {
    if (establishment.latitude !== undefined && establishment.longitude !== undefined) {
      const distanceInKm = this.calculateDistance(userLatitude, userLongitude, establishment.latitude, establishment.longitude);
      const distanceInMeters = distanceInKm * 1000;
      const metric = distanceInMeters > 1000 ? 'km' : 'm';
      const distance = metric === 'km' ? distanceInKm : distanceInMeters;
  
      return {
        establishment: establishment,
        distance: parseFloat(distance.toFixed(1)), 
        metric: metric,
        pointReference: {
          latitude: userLatitude,
          longitude: userLongitude
        },
        targetReference: {
          latitude: establishment.latitude,
          longitude: establishment.longitude
        },
        hasLatLng: true
      };
    } else {
      return {
        establishment: establishment,
        distance: 0,
        metric: 'Não existe Latitude e Logitude Cadastrado para esse estabelecimento',
        pointReference: {
          latitude: userLatitude,
          longitude: userLongitude
        },
        targetReference: {
          latitude: establishment.latitude ?? 0,
          longitude: establishment.longitude ?? 0 
        },
        hasLatLng: false
      };
    }
  }

  public getGeolocationEstablishmentList(establishments: EstablishmentModel[], userLatitude: number, userLongitude: number, categoryEstablishment?: any): EstablishmentGeopositioningModel[] {
    
    return establishments.map(establishment => {
      if (establishment.latitude !== undefined && establishment.longitude !== undefined) {
        const distanceInKm = this.calculateDistance(userLatitude, userLongitude, establishment.latitude, establishment.longitude);
        const distanceInMeters = distanceInKm * 1000;
        const metric = distanceInMeters > 1000 ? 'km' : 'm';
        const distance = metric === 'km' ? distanceInKm : distanceInMeters;

        return {
          establishment: establishment,
          distance: parseFloat(distance.toFixed(1)), 
          metric: metric,
          pointReference: {
            latitude: userLatitude,
            longitude: userLongitude
          },
          targetReference: {
            latitude: establishment.latitude,
            longitude: establishment.longitude
          },
          hasLatLng: true
        };
      } else {
        return {
          establishment: establishment,
          distance: 0,
          metric: 'Não existe Latitude e Logitude Cadastrado para esse estabelecimento',
          pointReference: {
            latitude: userLatitude,
            longitude: userLongitude
          },
          targetReference: {
            latitude: establishment.latitude ?? 0,
            longitude: establishment.longitude ?? 0 
          },
          hasLatLng: false
        };
      }
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  public getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocalização não é suportada pelo navegador.'));
      }
    });
  }
}
