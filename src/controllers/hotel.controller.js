'use strict'

const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const Event = require('../models/event.model');
const Room = require('../models/room.model');
const Service = require('../models/service.model');
const Reservation = require('../models/reservation.model');
const { validateData, checkUpdated} = require('../utils/validate');


//FunciÃ³n de Testeo//
exports.testHotel = (req, res)=>{
    return res.send({message: 'Function test Hotel is running'}); 
}




//Agregar un Hotel//
exports.saveHotel  = async (req, res)=>{
    try{
        const params = req.body; 
        const data = {
            name: params.name,
            description: params.name,
            address: params.address,
            email: params.email,
            phone: params.phone,
            admin: params.admin,
        };
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);
            
        const adminExist = await User.findOne({_id: data.admin});
        if(!adminExist) return res.send({message: 'Admin not found'});

        const existHotel = await Hotel.findOne({$and:[{name: data.name},{admin: data.admin}]});
        if(!existHotel){
            const hotel= new Hotel(data);
            await hotel.save();
            return res.send({message: 'Hotel saved successfully', hotel});
        }else return res.status(400).send({message: 'Hotel already exist'});
    
    }catch(err){
        console.log(err); 
        return err; 
    }

}



//Mostrar todos los Hoteles//
exports.getHotels = async (req, res)=>{
    try{
        const hotels = await Hotel.find().populate('admin');
        return res.send({message: 'Hotels:', hotels})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar un  Hotel//
exports.getHotel = async (req, res)=>{
    try{
        const hotelId = req.params.id
        const hotel = await Hotel.findOne({_id: hotelId}).populate('admin');
        if (!hotel) return res.send({message: 'Hotel not found'})
        return res.send({message: 'Hotel:', hotel})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar un  Hotel por Nombre//
exports.getHotelName = async (req, res)=>{
    try{
        const params = req.body;
        const hotel = await Hotel.find({name: {$regex: params.name, $options: 'i'}});
        if (!hotel) return res.send({message: 'Hotel not found'})
        return res.send({message: 'Hotels:', hotel})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Mostrar un  Hotel por Direccion//
exports.getHotelAddress = async (req, res)=>{
    try{
        const params = req.body;
        const hotel = await Hotel.find({address: {$regex: params.address, $options: 'i'}});
        if (!hotel) return res.send({message: 'Hotel not found'})
        return res.send({message: 'Hotels:', hotel})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Actualizar un Hotel//
exports.updateHotel= async (req, res)=>{
    try{
        const params = req.body;
        const hotelId = req.params.id;

        const data = {
            name: params.name,
            description: params.name,
            address: params.address,
            email: params.email,
            phone: params.phone,
            admin: params.admin,
        };

        const check = await checkUpdated(data);
        if(check === false) return res.status(400).send({message: 'Data not recived'});

        const msg = validateData(data);
        if(!msg)
        {
            const hotelExist = await Hotel.findOne({_id: hotelId});
            if(!hotelExist) return res.status.send({message: 'Hotel not found'});

            const adminExist = await User.findOne({_id: data.admin});
            if(!adminExist) return res.status.send({message: 'Admin not found'});

            let alreadyName = await Hotel.findOne({name: data.name});
                if(alreadyName && hotelExist.name != data.name) return res.status(400).send({message: 'Hotel Already Exist'});
    
            const updatedHotel= await Hotel.findOneAndUpdate({_id: hotelId}, data, {new: true});
            return res.send({message: 'Hotel updated successfully', updatedHotel});

        }else return res.status(400).send({message: 'Some parameter is empty'})

        }catch(err){
        console.log(err);
        return err; 
    }
}




//Eliminar un Hotel //
exports.deleteHotel= async (req, res)=>{
    try{
        const hotelId = req.params.id;
        const hotelExist = await Hotel.findOne({_id: hotelId});
        if(!hotelExist) return res.status(400).send({message: 'Hotel not found or already deleted.'});     

        const eventExist = await Event.find({hotel: hotelId});
        for(let eventDeleted of eventExist){
            const eventDeleted = await Event.findOneAndDelete({ hotel: hotelId});
            
        }

        const roomExist = await Room.find({hotel: hotelId});
        for(let roomDeleted of roomExist){
            const roomDeleted = await Room.findOneAndDelete({ hotel: hotelId});
            
        }
        
        const reservationExist = await Reservation.find({hotel: hotelId});
        for(let reservationDeleted of reservationExist){
            const dateNow = new Date();
            const dateReservation = await Reservation.findOne({hotel: hotelId});
            if(dateReservation.entryDate < dateNow ){
                const reservationDeleted = await Reservation.findOneAndDelete({ hotel: hotelId});
            }
            if(dateNow < dateReservation.exitDate){
                const reservationDeleted = await Reservation.findOneAndDelete({ hotel: hotelId});
            }

        }

        const hotelDeleted = await Hotel.findOneAndDelete({_id: hotelId});
        return res.send({message: 'Hotel deleted Successfully', hotelDeleted });
          
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting Hotel'});
        
    }
}