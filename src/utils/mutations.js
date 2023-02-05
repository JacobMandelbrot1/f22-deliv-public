import { addDoc, collection, deleteDoc, doc, updateDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from './firebase';


// Functions for database mutations

export const emptyEntry = {
   name: "",
   link: "",
   description: "",
   user: "",
   category: 0,
}

export async function addEntry(entry) {
   await addDoc(collection(db, "entries"), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      rating: entry.rating,
      // The ID of the current user is logged with the new entry for database user-access functionality.
      // You should not remove this userid property, otherwise your logged entries will not display.
      userid: entry.userid,
   });
}

export async function updateEntry(entry) {
   // TODO: Create Mutation to Edit Entry
   console.log(entry)

   await updateDoc(doc(db, "entries", entry.id), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      rating: entry.rating,
      // The ID of the current user is logged with the new entry for database user-access functionality.
      // You should not remove this userid property, otherwise your logged entries will not display.
      userid: entry.userid,
   });

}

export async function deleteEntry(entry) {
   await deleteDoc(doc(db,"entries", entry.id))
}

export async function sortEntry() {
   // console.log("HI")
   query(collection(db, "cities"), orderBy("rating"));
   //const q = query(collection(db, "cities"), orderBy("rating"));
   // const querySnapshot = await getDocs(q);
   // querySnapshot.forEach((doc) => {
   //    // doc.data() is never undefined for query doc snapshots
   //    console.log(doc.id, " => ", doc.data());
   // });
}