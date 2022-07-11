'use strict'

const Event = require('../models/event.model');
const Hotel = require('../models/hotel.model');
const TypeEvent = require('../models/typeEvent.model')
const { validateData, checkUpdated} = require('../utils/validate');


//Función de Testeo//
exports.testEvent = (req, res)=>{
    return res.send({message: 'Function test Event is running'}); 
}


//Agregar Tipo de Servicio//
exports.saveEvent  = async (req, res)=>{
    try{
        const params = req.body; 
        const data = {
            name: params.name,
            description: params.name,
            date: params.date,
            hotel: params.hotel,
            //typeEvent: params.typeEvent,
        };
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);
            
        const hotelExist = await Hotel.findOne({_id: data.hotel});
        if(!hotelExist) return res.send({message: 'Hotel not found'});

        //const typeEventExist = await TypeEvent.findOne({_id: data.typeEvent});
        //if(!typeEventExist) return res.send({message: 'TypeEvent not found'});

        const existEvent = await Event.findOne({ $and: [{name: data.name}, {hotel: data.hotel}]});
        if(!existEvent){
            const event= new Event(data);
            await event.save();
            return res.send({message: 'Event saved Successfully', event});
        }else return res.status(400).send({message: 'Event already exist'});
    
    }catch(err){
        console.log(err); 
        return err; 
    }

}



//Mostrar todos los Eventos//
exports.getEvents = async (req, res)=>{
    try{
        const events = await Event.find().populate('hotel');
        return res.send({message: 'Events:', events})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar un  Evento //
exports.getEvent = async (req, res)=>{
    try
    {
        const eventId = req.params.id
        const event = await Event.findOne({_id: eventId});
        if (!event) return res.send({message: 'Event not found'})
        return res.send({message: 'Event:', event})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Mostrar un  Evento por Hotel //
exports.getEventHotel = async (req, res)=>{
    try
    {
        const hotelId = req.params.id
        const event = await Event.find({hotel: hotelId});
        if (!event) return res.send({message: 'Events not found'})
        return res.send({message: 'Event:', event})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Actualizar un Evento //
exports.updateEvent= async (req, res)=>{
    try{
        const params = req.body;
        const eventId = req.params.id;

        const data = {
            name: params.name,
            description: params.name,
            date: params.date,
            typeEvent: params.typeEvent,
        };

        const check = await checkUpdated(data);
        if(check === false) return res.status(400).send({message: 'Data not recived'});

        const msg = validateData(data);
        if(!msg)
        {
            const eventExist = await Event.findOne({_id: eventId});
            if(!eventExist) return res.status.send({message: 'Event  not found'});

            const hotel = await Hotel.findOne({admin: req.user.sub});
            if(!hotel) return res.send({message: 'Hotel not found'});

            let alreadyName = await Event.findOne({ $and: [{name: data.name}, {hotel: hotel}]});
                if(alreadyName && eventExist.name != data.name) return res.status(400).send({message: 'Event Already Exist'});
    
            const updatedEvent = await Event.findOneAndUpdate({_id: eventId}, data, {new: true});
            return res.send({message: 'Update Event', updatedEvent});

        }else return res.status(400).send({message: 'Some parameter is empty'})

        }catch(err){
        console.log(err);
        return err; 
    }
}




//Eliminar un Evento //
exports.deleteEvent= async (req, res)=>{
    try{
        const eventId = req.params.id;
        const eventExist = await Event.findOne({_id: eventId});
        if(!eventExist) return res.status(400).send({message: 'Event not found or already deleted.'});     

        const eventDeleted = await Event.findOneAndDelete({_id: eventId});
        return res.send({message: 'Delete Event.', eventDeleted });
          
    }catch(err){
        console.log(err); 
        return err; 
    }
}