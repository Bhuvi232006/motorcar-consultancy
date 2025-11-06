const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/motorcar_consultancy';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// MongoDB connection
let db;
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db();
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/consult', (req, res) => {
  res.sendFile(path.join(__dirname, 'consult.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkout.html'));
});

// POST Routes for form submissions

// Service selection submission
app.post('/api/select-service', async (req, res) => {
  try {
    const { service, timestamp } = req.body;
    
    const serviceSelection = {
      service: service,
      selectedAt: timestamp || new Date(),
      createdAt: new Date()
    };

    const result = await db.collection('service_selections').insertOne(serviceSelection);
    
    res.json({
      success: true,
      message: 'Service selection recorded',
      id: result.insertedId,
      data: serviceSelection
    });
  } catch (error) {
    console.error('Error saving service selection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record service selection',
      error: error.message
    });
  }
});

// Checkout form submission
app.post('/api/checkout', async (req, res) => {
  try {
    const {
      fullName,
      email,
      whatsapp,
      pincode,
      service,
      totalAmount,
      carDetails,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !whatsapp || !service) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, email, whatsapp, and service are required'
      });
    }

    const consultationRequest = {
      customerInfo: {
        fullName: fullName,
        email: email,
        whatsapp: whatsapp,
        pincode: pincode || null
      },
      serviceDetails: {
        service: service,
        totalAmount: totalAmount || 0
      },
      carDetails: carDetails || null,
      additionalInfo: additionalInfo || null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('consultation_requests').insertOne(consultationRequest);
    
    res.json({
      success: true,
      message: 'Consultation request submitted successfully',
      orderId: result.insertedId,
      data: consultationRequest
    });
  } catch (error) {
    console.error('Error saving consultation request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit consultation request',
      error: error.message
    });
  }
});

// Contact form submission (general inquiries)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, and message are required'
      });
    }

    const contactSubmission = {
      name: name,
      email: email,
      phone: phone || null,
      subject: subject || 'General Inquiry',
      message: message,
      status: 'new',
      createdAt: new Date()
    };

    const result = await db.collection('contact_submissions').insertOne(contactSubmission);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      id: result.insertedId,
      data: contactSubmission
    });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// GET Routes for retrieving data (admin use)

// Get all consultation requests
app.get('/api/consultation-requests', async (req, res) => {
  try {
    const requests = await db.collection('consultation_requests')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching consultation requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation requests',
      error: error.message
    });
  }
});

// Get consultation request by ID
app.get('/api/consultation-requests/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const request = await db.collection('consultation_requests')
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Consultation request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching consultation request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation request',
      error: error.message
    });
  }
});

// Get all service selections
app.get('/api/service-selections', async (req, res) => {
  try {
    const selections = await db.collection('service_selections')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      count: selections.length,
      data: selections
    });
  } catch (error) {
    console.error('Error fetching service selections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service selections',
      error: error.message
    });
  }
});

// Get all contact messages
app.get('/api/contact-messages', async (req, res) => {
  try {
    const messages = await db.collection('contact_submissions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages',
      error: error.message
    });
  }
});

// Admin route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MotorCar Consultancy API is running',
    timestamp: new Date(),
    mongodb: db ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`MotorCar Consultancy server running on http://localhost:${PORT}`);
  console.log(`MongoDB: ${MONGODB_URI}`);
});

module.exports = app;