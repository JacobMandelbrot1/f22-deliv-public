import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { categories } from '../utils/categories';
import { addEntry } from '../utils/mutations';
import { updateEntry } from '../utils/mutations';
import { deleteEntry } from '../utils/mutations';
import { sortEntry } from '../utils/mutations';
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";

import {db} from "../utils/firebase";


// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened. 
   This can be "add" (for adding a new entry) or 
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function EntryModal({ entry, type, user }) {

   // State variables for modal status

   // TODO: For editing, you may have to add and manage another state variable to check if the entry is being edited.

   const [open, setOpen] = useState(false);
   const [name, setName] = useState(entry.name);
   const [link, setLink] = useState(entry.link);
   const [description, setDescription] = useState(entry.description);
   const [category, setCategory] = React.useState(entry.category);
   const [rating, setRating] = useState(entry.rating);

   // Modal visibility handlers

   const handleClickOpen = () => {
      setOpen(true);
      setName(entry.name);
      setLink(entry.link);
      setDescription(entry.description);
      setCategory(entry.category);
      setRating(entry.rating)
   };

   const handleClose = () => {
      setOpen(false);
   };

   // Mutation handlers

   const handleAdd = () => {
      const newEntry = {
         name: name,
         link: link,
         description: description,
         user: user?.displayName ? user?.displayName : "GenericUser",
         category: category,
         rating: rating,
         userid: user?.uid,
      };

      addEntry(newEntry).catch(console.error);
      handleClose();
   };

   // TODO: Add Edit Mutation Handler

   const handleEdit = () => {

      const updatedEntry = {
         name: name,
         link: link,
         description: description,
         user: entry.user,
         category: category,
         rating: rating,
         userid: entry.userid,
         id: entry.id
      };

      updateEntry(updatedEntry).catch(console.error);
      handleClose();
   };

   // TODO: Add Delete Mutation Handler

   const handleDelete = () => {

      const deletingEntry = {
         name: name,
         link: link,
         description: description,
         user: entry.user,
         category: category,
         userid: entry.userid,
         id: entry.id
      }

      deleteEntry(deletingEntry).catch(console.error);
      handleClose();
   };

   // const Sort = () => {
   //    query(collection(db, "cities"), orderBy("rating"));
   //    // const query = collection(db, 'entries')
   //    //     .orderBy("rating")
   //    // const [entry, setEntries] = useState([]);
   //    //
   //    // const q = entry.user?.id ? query(collection(db, "entries"), where("userid", "==", entry.userid)) : collection(db, "entries");
   //    //
   //    // /* NOTE: onSnapshot allows the page to update automatically whenever there is
   //    // an update to the database. This means you do not have to manually update
   //    // the page client-side after making an add/update/delete. The page will automatically
   //    // sync with the database! */
   //    // onSnapshot(q, (snapshot) => {
   //    //    // Set Entries state variable to the current snapshot
   //    //    // For each entry, appends the document ID as an object property along with the existing document data
   //    //    setEntries(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
   //    // })
   //
   //
   //    // db.collection("entries").orderBy("rating").get()
   //    //FirebaseFirestore.getInstance().collection("entries".orderBy("price"))
   //    // const q = query(entry, orderBy("rating", "desc"), limit(5));
   //    //sortEntry().catch(console.error);
   // };

   // Button handlers for modal opening and inside-modal actions.
   // These buttons are displayed conditionally based on if adding or editing/opening.
   // TODO: You may have to edit these buttons to implement editing/deleting functionality.

   const openButton =
      type === "edit" ? <IconButton onClick={handleClickOpen}>
         <OpenInNewIcon />
      </IconButton>
         : type === "add" ? <Button variant="contained" onClick={handleClickOpen}>
            Add entry
         </Button>
              : type === "add" ? <Button variant="contained" onClick={handleClickOpen}>
                     Sort
                  </Button>

            : null;

   // const sortButton =
   //     type === "add" ? <Button variant="contained" onClick={Sort}>
   //        Sort
   //     </Button>
   //
   //     : null;


   const actionButtons =
      type === "edit" ?
         <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDelete}>Delete</Button>
            <Button variant="contained" onClick={handleEdit}>Edit</Button>
         </DialogActions>
         : type === "add" ?
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button variant="contained" onClick={handleAdd}>Add Entry</Button>
            </DialogActions>
            : null;

   return (
      <div>
         {openButton}
         {/*{sortButton}*/}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{type === "edit" ? name : "Add Entry"}</DialogTitle>
            <DialogContent>
               {/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
               <TextField
                  margin="normal"
                  id="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="link"
                  label="Link"
                  placeholder="e.g. https://google.com"
                  fullWidth
                  variant="standard"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="description"
                  label="Description"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
               />

               <TextField
                   margin="normal"
                   id="rating"
                   label="Rating"
                   fullWidth
                   variant="standard"
                   multiline
                   maxRows={8}
                   value={rating}
                   onChange={(event) => setRating(event.target.value)}
               />

               <FormControl fullWidth sx={{ "margin-top": 20 }}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={category}
                     label="Category"
                     onChange={(event) => setCategory(event.target.value)}
                  >
                     {categories.map((category) => (<MenuItem value={category.id}>{category.name}</MenuItem>))}
                  </Select>
               </FormControl>

            </DialogContent>
            {actionButtons}
         </Dialog>
      </div>
   );
}