const mongoose = require('mongoose')
const { initializeDatabase } = require('./db/db.connect')
const Hotel = require('./model/hodel.model')

const express = require('express')
const app = express()
app.use(express.json())

initializeDatabase()

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//--------- 1 ---------

async function readAllHotels()
{
  try {
    const hotels =await Hotel.find()
    return hotels
  }
  catch (error)
  {
    throw error
  }
}

app.get('/hotels',async (req,res) => {
  
  try {
    const hotels =await readAllHotels()
    if (hotels.length)
    {
res.json(hotels)
    }
    else
    {
      res.status(404).json({error:'Hotel Not Found'})
      }
    
  }
  catch (error)
  {
res.status(500).json({error:'Cant fetch hotels'})
  }

})

//--------- 2 ---------

async function readHotelByname(hotelName)
{
  try {
    const hotel =await Hotel.findOne({ name: hotelName })
    return hotel
  }
  catch (error)
  {
   throw error
  }
}

app.get('/hotels/:hotelName',async (req,res) =>
{
  try {

    const hotel =await readHotelByname(req.params.hotelName)
    
    res.json(hotel)
    
  }
  catch(error)
  {
    res.status(500).json({ error:"Can't Fetch Hotel"})
  }

})

async function createHotel(newHotel)
{
  try {
    const hotel = new Hotel(newHotel)
    const saveHotel = await hotel.save()
    return saveHotel
  }
  catch (error)
  {
    throw error
  }
}

app.post('/hotels',async (req,res) => {
  
  try {
    const savedHotel = await createHotel(req.body)
    res.status(201).json({message:'Hotel added successfully',hotel:savedHotel})
  }
  catch (error)
  {
    res.status(500).json({error:"cant add Hotel"})
  }

})

async function deleteHotel(hotelId)
{
  try {
    const deletedHotel =await Hotel.findByIdAndDelete(hotelId)
    return deletedHotel
  }
  catch (error)
  {
    console.log(error)
  }
}

app.delete('/hotels/:hotelId',async (req,res) => {
  
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId)
    res.status(200).json({message:'Hotel Deleted Successfully.'})
  }
  catch (error)
  {
    res.status(500).json({error:'cant Delete Hotel'})
  }

})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`)
})
