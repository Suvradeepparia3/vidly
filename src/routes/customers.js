const { Customer, validate } = require('../models/customer')
const express = require('express');
const router = express.Router();


// ======== List all customers ========
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    return res.status(200).send(customers);
});

// ======== Create a new customer ========
router.post('/', async (req, res) => {
    // Validate
    const { error } = validate(req.body);
    
    // If validation fails, return the error
    if (error) return res.status(400).send(error);

    // Create a new customer object
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    // Add, the customer object to the list of customers. 
    // In real world we will save this to a DB. 
    // customers.push(customer);
    customer = await customer.save();

    // Return a copy of the created object to the client 
    // as per specification. 
    return res.status(200).send(customer);

});

// ======== Change the values of a customer ========
router.put('/:id', async (req, res) => {

    // Validate the insertable data
    const { error } = validate(req.body);

    // If validation fails, return the error
    if (error) return res.status(400).send(error);

    // Create a new object to hold the new details. 
    // All options should ideally be optional
    let customerNewDetails = {
        name: req.body.name
    }
    if (req.body.phone) { customerNewDetails.phone = req.body.phone; };
    if (req.body.isGold) { customerNewDetails.isGold = req.body.isGold; };
    
    // Get customers from the database
    const customer = await Customer.findByIdAndUpdate(req.params.id, customerNewDetails, { new: true });

    // If object with said id does not exist, return an error
    if (!customer) return res.status(404).send(`Object with id ${req.params.id} not found!`);

    return res.status(200).send(customer);

});

// ======== Delete a customer by ID ========
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    // If object with said id does not exist, return an error
    if (!customer) return res.status(404).send(`Customer with id ${req.params.id} not found!`);

    return res.status(200).send(customer);
});

// ======== Get a customer by ID ========
router.get('/:id', async (req, res) => {

    const customer = await Customer.findById(req.params.id)

    // // Check that one object with the said id exists
    // let customer = customers.find(c => c.id === parseInt(req.params.id));

    // If object with said id does not exist, return an error
    if (!customer) return res.status(404).send(`Customer with id ${req.params.id} not found!`);
    
    return res.send(customer);
  });

  module.exports = router;
