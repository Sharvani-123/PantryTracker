// app/dashboard/page.js
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
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { parse } from 'json2csv'; // Import json2csv parse function

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry, setExpiry] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editItem, setEditItem] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editExpiry, setEditExpiry] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'pantryDetails'));
      const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    setItems([...items, { id: docRef.id, Item: newItem, Quantity: Number(quantity), Expiry: new Date(expiry) }]);
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
    setEditItem(item.Item);
    setEditQuantity(item.Quantity);
    setEditExpiry(new Date(item.Expiry.seconds * 1000).toISOString().split('T')[0]); // Format date for editing
  };

  const saveEdit = async () => {
    if (editingItem) {
      await updateDoc(doc(db, 'pantryDetails', editingItem.id), {
        Item: editItem,
        Quantity: Number(editQuantity),
        Expiry: new Date(editExpiry),
      });
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, Item: editItem, Quantity: Number(editQuantity), Expiry: new Date(editExpiry) } 
          : item
      ));
      setEditingItem(null);
      setEditItem('');
      setEditQuantity('');
      setEditExpiry('');
    }
  };

  const exportData = async () => {
    try {
      // Fetch the current items from Firestore
      const querySnapshot = await getDocs(collection(db, 'pantryDetails'));
      const itemsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          Expiry: new Date(data.Expiry.seconds * 1000).toLocaleDateString(), // Convert timestamp to date string
        };
      });

      // Convert JSON data to CSV format using json2csv library
      const csv = parse(itemsData);

      // Create a blob with the CSV data
      const blob = new Blob([csv], { type: 'text/csv' });

      // Create a download link and click it programmatically to trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'pantry_items.csv';
      link.click();

    } catch (error) {
      console.error('Error exporting data:', error);
      // Handle error as needed
    }
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
          <Button variant="contained" color="primary" onClick={addItem}>
            Add
          </Button>
        </Box>
        <Paper elevation={3} sx={{ padding: '20px', borderRadius: '10px', backgroundColor: '#A1B5C1', color: 'white' }}>
          <List>
            {items.map((item) => (
              <ListItem key={item.id} sx={{ mb: '10px' }}>
                <ListItemText
                  primary={item.Item}
                  secondary={`Quantity: ${item.Quantity} - Expiry: ${new Date(item.Expiry.seconds * 1000).toLocaleDateString()}`}
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
        {editingItem && (
          <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Edit Item</Typography>
            <Box sx={{ display: 'flex', gap: '10px', mb: '20px' }}>
              <TextField
                label="Item"
                value={editItem}
                onChange={(e) => setEditItem(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="Quantity"
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="Expiry Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editExpiry}
                onChange={(e) => setEditExpiry(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="contained" color="primary" onClick={saveEdit}>
                Save
              </Button>
            </Box>
          </Box>
        )}
        {/* Export Data button */}
        <Button variant="contained" color="primary" onClick={exportData} sx={{ mt: '20px' }}>
          Export Data
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
