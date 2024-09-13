import { Injectable } from "@angular/core";
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';
import { User } from "src/app/models/userModel";

@Injectable({
    providedIn: 'root'
  })
  export class FirebaseUserService {
    private userCollection : CollectionReference<DocumentData>;
    constructor(private firestore: Firestore) {
      this.userCollection = collection(this.firestore, 'users');
    }

    getUser(userId: string) {
      const usersDocumentReference = doc(
        this.firestore,
        `users/${userId}`
      );
      return docData(usersDocumentReference);
    }

    updateUser(userId: string, users: User) {
      const usersDocumentReference = doc(
        this.firestore,
        `users/${userId}`
      );
      return updateDoc(usersDocumentReference, { ...users });
    }

  }