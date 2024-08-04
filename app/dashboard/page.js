// app/dashboard/page.js
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry, setExpiry] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'pantryDetails'));
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        Expiry: doc.data().Expiry.toDate()
      }));
      setItems(itemsData);
    };
    fetchData();
  }, []);

  const addItem = async () => {
    const docRef = await addDoc(collection(db, 'pantryDetails'), {
      Item: newItem,
      Quantity: Number(quantity),
      Expiry: new Date(expiry),
    });
    setItems([...items, {
      id: docRef.id,
      Item: newItem,
      Quantity: Number(quantity),
      Expiry: new Date(expiry)
    }]);
    setNewItem('');
    setQuantity('');
    setExpiry('');
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'pantryDetails', id));
    setItems(items.filter(item => item.id !== id));
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setNewItem(item.Item);
    setQuantity(item.Quantity.toString());
    setExpiry(item.Expiry.toISOString().split('T')[0]);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setNewItem('');
    setQuantity('');
    setExpiry('');
  };

  const saveEdit = async () => {
    const itemRef = doc(db, 'pantryDetails', editingItem.id);
    await updateDoc(itemRef, {
      Item: newItem,
      Quantity: Number(quantity),
      Expiry: new Date(expiry),
    });
    setItems(items.map(item =>
      item.id === editingItem.id
        ? { ...item, Item: newItem, Quantity: Number(quantity), Expiry: new Date(expiry) }
        : item
    ));
    setEditingItem(null);
    setNewItem('');
    setQuantity('');
    setExpiry('');
  };

  const exportData = () => {
    const dataToExport = items.map(item => ({
      Item: item.Item,
      Quantity: item.Quantity,
      Expiry: item.Expiry.toISOString().split('T')[0]
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pantry Data');
    XLSX.writeFile(workbook, 'pantry_data.xlsx');
  };

  return (
    <Container
      maxWidth="false"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/dashboardBg.png)', // Replace with your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1, // Ensure background is below the content
        }}
      ></Box>
      <Box
        sx={{
          position: 'relative',
          zIndex: 2, // Ensure content is above the background
          textAlign: 'center',
          color: 'black',
          backgroundColor: '#68747D', // Greyish color with some transparency
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '70%', // Adjust width as needed
          margin: '20px auto',
          marginLeft: '30%', // Adjust this value to move the dashboard to the right
        }}
      >
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px', mb: '20px' }}>
          <TextField
            label="Item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            label="Expiry Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          {editingItem ? (
            <>
              <Button variant="contained" color="primary" onClick={saveEdit}>
                Save
              </Button>
              <Button variant="contained" onClick={cancelEditing}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={addItem}>
              Add
            </Button>
          )}
        </Box>
        <Paper elevation={3} sx={{ padding: '20px', borderRadius: '10px', backgroundColor: '#A1B5C1', color: 'white' }}>
          <List>
            {items.map((item) => (
              <ListItem key={item.id} sx={{ mb: '10px' }}>
                <ListItemText
                  primary={item.Item}
                  secondary={`Quantity: ${item.Quantity} - Expiry: ${item.Expiry.toDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => startEditing(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Button variant="contained" color="primary" onClick={exportData} sx={{ mt: 2 }}>
          Export Data
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;

