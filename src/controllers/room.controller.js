'use strict'

const TypeRoom = require('../models/typeRoom.model');
const Hotel = require('../models/hotel.model');
const Room = require('../models/room.model');
const Reservation = require('../models/reservation.model');

const { validateData, checkUpdated} = require('../utils/validate');


//Función de Testeo//
exports.testRoom = (req, res)=>{
    return res.send({message: 'Function test Room is running'}); 
}




//Agregar una Habitación//
exports.saveRoom  = async (req, res)=>{
    try{
        const params = req.body; 
        
        const date = new Date();
        const dateLocal = (date).toLocaleString('UTC', { timeZone: 'America/Guatemala' });
        const splitDate = dateLocal.split(' ');
        const splitDateOne = splitDate[0].split('/');
        if (splitDateOne[0] < 10) 
        {
            splitDateOne[0] = '0' + splitDateOne[0];
        }
        if (splitDateOne[1] < 10) 
        {
            splitDateOne[1] = '0' + splitDateOne[1];
        }
        const setDate = splitDateOne[2]+'-'+splitDateOne[1]+'-'+splitDateOne[0];
        const setDateRoom  = new Date(setDate);
        const data = {
            name: params.name,
            description: params.description,
            price: params.price,
            dateAvailable: setDateRoom,
            state: 'false',
            typeRoom: params.typeRoom,
            hotel: params.hotel,
        };
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);
            
        const typeRoomExist = await TypeRoom.findOne({_id: data.typeRoom});
        if(!typeRoomExist) return res.send({message: 'TypeRoom not found'});

        const hotelExist = await Hotel.findOne({_id: data.hotel});
        if(!hotelExist) return res.send({message: 'Hotel not found'});

        const roomExist = await Room.findOne({ $and: [{name: data.name}, {hotel: data.hotel}]});
        if(!roomExist){
            const room= new Room(data);
            await room.save();
            return res.send({message: 'Room saved', room});
        }else return res.status(400).send({message: 'Room already exist'});
    
    }catch(err){
        console.log(err); 
        return err; 
    }

}



//Mostrar todas las Habitaciones//
exports.getRooms = async (req, res)=>{
    try{
        const rooms = await Room.find().populate('hotel typeRoom');
        return res.send({message: 'Rooms:', rooms})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar una Habitación//
exports.getRoom = async (req, res)=>{
    try{
        const roomId = req.params.id
        const room = await Room.findOne({_id: roomId});
        if (!room) return res.send({message: 'Room not found'})
        return res.send({message: 'Room:', room})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar una Habitación por Nombre//
exports.getRoomName = async (req, res)=>{
    try{
        const params = req.body;
        const room = await Room.find({name: {$regex: params.name, $options: 'i'}});
        if (!room) return res.send({message: 'Room not found'})
        return res.send({message: 'Room:', room})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Ordenar las habitaciones por Hotel//
exports.getRoomHotel = async (req, res)=>{
    try{
        const hotelId = req.params.id
        const hotel = await Hotel.find({_id: hotelId});
        if (!hotel) return res.send({message: 'Hotel not found'})

        const rooms = await Room.find({hotel: hotelId});
        return res.send({message: 'Rooms:', rooms})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Mostrar las Habitaciones Disponibles//
exports.getRoomsAvailables = async (req, res)=>{
    try{
        const rooms = await Room.find({state: false});
        return res.send({message: 'Rooms:', rooms})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Mostrar las Habitaciones Ocupadas//
exports.getRoomsNotAvailables = async (req, res)=>{
    try{
        const rooms = await Room.find({state: true});
        return res.send({message: 'Rooms:', rooms})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Actualizar una Habitación//
exports.updateRoom= async (req, res)=>{
    try{
        const params = req.body;
        const roomId = req.params.id;

        const data = {
            name: params.name,
            description: params.name,
            price: params.price,
            dateAvailable: params.dateAvailable,
            state: params.state,
            typeRoom: params.typeRoom,
            hotel: params.hotel,
        };

        const check = await checkUpdated(data);
        if(check === false) return res.status(400).send({message: 'Data not recived'});

        const msg = validateData(data);
        if(!msg)
        {

            const roomExist = await Room.findOne({_id: roomId});
            if(!roomExist) return res.status.send({message: 'Room not found'});

            const hotelExist = await Hotel.findOne({_id: data.hotel});
            if(!hotelExist) return res.status.send({message: 'Hotel not found'});

            const typeRoomExist = await TypeRoom.findOne({_id: data.typeRoom});
            if(!typeRoomExist) return res.status.send({message: 'TypeRoom not found'});

            let alreadyName = await Room.findOne({ $and: [{name: data.name}, {hotel: data.hotel}]});
                if(alreadyName && roomExist.name != data.name) return res.status(400).send({message: 'Room Already Exist'});
    
            const updatedRoom= await Room.findOneAndUpdate({_id: roomId}, data, {new: true});
            return res.send({message: 'Update Room', updatedRoom});

        }else return res.status(400).send({message: 'Some parameter is empty'})

        }catch(err){
        console.log(err);
        return err; 
    }
}


//Eliminar una Habitación //
exports.deleteRoom= async (req, res)=>{
    try{
        const roomId = req.params.id;
        const roomExist = await Room.findOne({_id: roomId});
        if(!roomExist) return res.status(400).send({message: 'Room not found or already deleted.'});     
        
        const reservationExist = await Reservation.find({room: roomId});
        for(let reservationDeleted of reservationExist){
            const reservationDeleted = await Reservation.findOneAndDelete({ hotel: hotelId});
           
        }

        const roomDeleted = await Room.findOneAndDelete({_id: roomId});
        return res.send({message: 'Delete Room.', roomDeleted });
          
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting Room'});
        
    }
}