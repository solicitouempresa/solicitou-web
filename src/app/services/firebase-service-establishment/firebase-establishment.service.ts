import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentData, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { EstablishmentModel } from 'src/app/models/establishment';
import { ItemProductModel } from 'src/app/models/itemProduct';
import { MenuModel } from 'src/app/models/menuModel';
import { NeighborhoodModel } from 'src/app/models/neighborhoodsModel';
import { OptionItemProduct } from 'src/app/models/optionItemProduct';
import { orderModel } from 'src/app/models/orderModel';

@Injectable({
  providedIn: 'root'
})
export class FirebaseEstablishmentService {
  private establishmentCollection: CollectionReference<DocumentData>;
  private menuEstablishment: CollectionReference<DocumentData> | undefined;
  private neighborhoodDelivery: CollectionReference<DocumentData>;
  private orders: CollectionReference<DocumentData>;
  private categoryProduct: CollectionReference<DocumentData>;
  private itemProduct: CollectionReference<DocumentData>;
  private optionItemProduct: CollectionReference<DocumentData>;
  constructor(private firestore: Firestore) {
    this.establishmentCollection = collection(this.firestore, 'headquarters/1/establishments'); //retornar estabelecimentos da matriz
  }

    //Listar todos estabelecimentos
    getAllEstablishments() {
      return collectionData(this.establishmentCollection, {
        idField: 'id',
      }) as Observable<EstablishmentModel[]>;
    }

    getId(id: string) {
      const establishmentDocumentReference = doc(this.firestore, `headquarters/1/establishments/${id}`);
      return docData(establishmentDocumentReference, { idField: 'id' });
    }

    updateEstablishment(establishment: EstablishmentModel) {
      const establishmentDocumentReference = doc(
        this.firestore,
        `headquarters/1/establishments/${establishment.id}`
      );
      return updateDoc(establishmentDocumentReference, { ...establishment });
    }


    async getName(name: string): Promise<any> {
      const establishmentsCollection = collection(this.firestore, 'headquarters/1/establishments');
      const q = query(establishmentsCollection, where('name', '==', name));
      const querySnapshot = await getDocs(q);
      const establishments = querySnapshot.docs.map(doc => doc.data());
      return establishments.length > 0 ? establishments[0] : null;
    }

    async getUrlName(urlName: string): Promise<any> {
      const establishmentsCollection = collection(this.firestore, 'headquarters/1/establishments');
      const q = query(establishmentsCollection, where('urlName', '==', urlName));
      const querySnapshot = await getDocs(q);
      const establishments = querySnapshot.docs.map(doc => doc.data());
      return establishments.length > 0 ? establishments[0] : null;
    }

    getMenu(id: string) {
      this.menuEstablishment = collection(this.firestore, `headquarters/1/establishments/${id}/menu`);
      return collectionData(this.menuEstablishment, {
        idField: 'id',
      }) as Observable<MenuModel[]>;
    }

    getIdProduct(idEstablishment:string, idProduct:string) {
      const establishmentDocumentReference = doc(this.firestore, `headquarters/1/establishments/${idEstablishment}/menu/${idProduct}`);
      return docData(establishmentDocumentReference, { idField: 'id' });
    }

    getNeighborhoodDelivery(id: string) {
      this.neighborhoodDelivery = collection(this.firestore, `headquarters/1/establishments/${id}/neighborhoods`);
      return collectionData(this.neighborhoodDelivery, {
        idField: 'id',
      }) as Observable<NeighborhoodModel[]>;
    }

      //Criar nova ordem de pedido
      createOrder(order: orderModel) {
        this.orders = collection(this.firestore, `headquarters/1/orders`);
        return addDoc(this.orders, order);
      }

      getllOrder() {
        this.orders = collection(this.firestore, `headquarters/1/orders`);
        return collectionData(this.orders, {
          idField: 'id',
        }) as Observable<orderModel[]>;
      }

      getAllOrdersByUserId(idClientDelivery: string) {
        const ordersCollectionPath = `headquarters/1/orders`; // O caminho para a coleção de pedidos
        const ordersQuery = query(
          collection(this.firestore, ordersCollectionPath),
          where('idClientDelivery', '==', idClientDelivery)
        );
        
        return collectionData(ordersQuery, { idField: 'id' }) as Observable<orderModel[]>;
      }


      getIdOrder(idOrder:string) {
        const establishmentDocumentReference = doc(this.firestore, `headquarters/1/orders/${idOrder}`);
        return docData(establishmentDocumentReference, { idField: 'id'});
      }

      getIdEstablishmentOrder(idEstablishment:string) {
        const establishmentDocumentReference = doc(this.firestore, `headquarters/1/orders/${idEstablishment}`);
        return docData(establishmentDocumentReference, { idField: 'idEstablishment'});
      }


      updateOrder(order: orderModel, establishmentId:string) {
        const establishmentDocumentReference = doc(
          this.firestore,
          `headquarters/1/orders/${order.id}`
        );
        return updateDoc(establishmentDocumentReference, { ...order });
      }

      getAllCategoryProduct(idEstablishment:string) {
        this.categoryProduct = collection(this.firestore, `headquarters/1/establishments/${idEstablishment}/categoryproduct`);
        return collectionData(this.categoryProduct, {
          idField: 'id',
        }) as Observable<CategoryProductModel[]>;
      }

      getAllCategoryProductByName(nameEstablishment: string): Observable<CategoryProductModel[]> {
        const categoryProductCollection = collection(this.firestore, `headquarters/1/establishments/${nameEstablishment}/categoryproduct`);
        return collectionData(categoryProductCollection, { idField: 'name' }) as Observable<CategoryProductModel[]>;
      }

       // item product

    getAllItemProduct(idEstablishment:string, idProduct:string){
      this.itemProduct = collection(this.firestore, `headquarters/1/establishments/${idEstablishment}/menu/${idProduct}/itemproduct`);
      return collectionData(this.itemProduct, {
        idField: 'id',
      }) as Observable<ItemProductModel[]>;
    }

    createItemProduct(establishmentId:string, idProduct:string, itemProduct: ItemProductModel) {
      this.itemProduct = collection(this.firestore, `headquarters/1/establishments/${establishmentId}/menu/${idProduct}/itemproduct`);
      return addDoc(this.itemProduct, itemProduct);
    }

    updateItemProduct(establishmentId:string, idProduct:string, itemProduct: ItemProductModel) {
      const establishmentDocumentReference = doc(
        this.firestore,
        `headquarters/1/establishments/${establishmentId}/menu/${idProduct}/itemproduct/${itemProduct.id}`
      );
      return updateDoc(establishmentDocumentReference, { ...itemProduct });
    }

    getIdItemProduct(idEstablishment:string, idProduct:string, idItemProduct: string) {
      const establishmentDocumentReference = doc(this.firestore, `headquarters/1/establishments/${idEstablishment}/menu/${idProduct}/itemproduct/${idItemProduct}`);
      return docData(establishmentDocumentReference, { idField: 'id' });
    }

    // option item product

    getAllOptionItemProduct(idEstablishment:string, idProduct:string, idItemProduct:string){
      this.optionItemProduct = collection(this.firestore, `headquarters/1/establishments/${idEstablishment}/menu/${idProduct}/itemproduct/${idItemProduct}/optionitemproduct`);
      return collectionData(this.optionItemProduct, {
        idField: 'id',
      }) as Observable<OptionItemProduct[]>;
    }

    createOptionItemProduct(establishmentId:string, idProduct:string, idItemProduct: string, optionItemProduct:OptionItemProduct) {
      this.optionItemProduct = collection(this.firestore, `headquarters/1/establishments/${establishmentId}/menu/${idProduct}/itemproduct/${idItemProduct}/optionitemproduct`);
      return addDoc(this.optionItemProduct, optionItemProduct);
    }

    updateOptionItemProduct(establishmentId:string, idProduct:string, idItemProduct: string, optionItemProduct:OptionItemProduct) {
      const establishmentDocumentReference = doc(
        this.firestore,
        `headquarters/1/establishments/${establishmentId}/menu/${idProduct}/itemproduct/${idItemProduct}/optionitemproduct/${optionItemProduct.id}`
      );
      return updateDoc(establishmentDocumentReference, { ...optionItemProduct });
    }

    getIdOptionItemProduct(idEstablishment:string, idProduct:string, idItemProduct: string, idOptionItemProduct:string) {
      const establishmentDocumentReference = doc(this.firestore, `headquarters/1/establishments/${idEstablishment}/menu/${idProduct}/itemproduct/${idItemProduct}/optionitemproduct/${idOptionItemProduct}`);
      return docData(establishmentDocumentReference, { idField: 'id' });
    }



}
