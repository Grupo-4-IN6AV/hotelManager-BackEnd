'use strict'

const TypeRoom = require('../models/typeRoom.model');
const Hotel = require('../models/hotel.model')
const Room = require('../models/room.model')

const { validateData, checkUpdated} = require('../utils/validate');


//Función de Testeo//
exports.testTypeRoom = (req, res)=>{
    return res.send({message: 'Function testTypeRoom is running'}); 
}




//Agregar Tipo de Habitación//
exports.saveTypeRoom  = async (req, res)=>{
    try{
        const params = req.body; 
        const data = {
            name: params.name,
            description: params.name,
            numberPersons: params.numberPersons,
            hotel: params.hotel
        };
        const msg = validateData(data);
        if(msg)
            return res.status(400).send(msg);
        
        const hotelExist = await Hotel.findOne({_id: data.hotel});
        if(!hotelExist) return res.send({message: 'Hotel not found'});

        const existTypeRoom = await TypeRoom.findOne({$and:[{name: data.name},{hotel:data.hotel}]});
        if(!existTypeRoom){
            if(params.numberPersons<0)
                return res.status(400).send({message:'The number persons cannot be less than 0.'})
            const typeRoom= new TypeRoom(data);
            await typeRoom.save();
            return res.send({message: 'TypeRoom saved', typeRoom});
        }else return res.status(400).send({message: 'TypeRoom already exist'});
    
    }catch(err){
        console.log(err); 
        return err; 
    }

}



//Mostrar todos los Tipos de Habitación//
exports.getTypeRoomsHotels = async (req, res)=>{
    try{
        const hotelId = req.params.id;
        const typeRooms = await TypeRoom.find({$and:[{name:{$ne:'DEFAULT'}},{hotel: hotelId}]})
        return res.send({message: 'TypeRoom:', typeRooms})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Mostrar todos los Tipos de Servicios//
exports.searchTypesRooms = async (req, res)=>{
    try{
        const params = req.body;
        const typesRooms = await TypeRoom.find({$and:[{name:{$ne:'DEFAULT'}},{name: {$regex: params.name, $options:'i'}}]});
        return res.send({message: 'Types Rooms:', typesRooms})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar todos los Tipos de Habitación//
exports.getMasterTypesRooms = async (req, res)=>{
    try{
        const typeRooms = await TypeRoom.find({name:{$ne:'DEFAULT'}}).populate('hotel');
        return res.send({message: 'TypeRoom:', typeRooms})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar un  Tipo de Habitación//
exports.getTypeRoom = async (req, res)=>{
    try
    {
        const typeRoomId = req.params.id
        const typeRoom = await TypeRoom.findOne({_id: typeRoomId}).populate('hotel');
        return res.send({message: 'TypeRoom:', typeRoom})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Actualizar Tipo de Evento //
exports.updateTypeRoom = async (req, res)=>{
    try{
        const params = req.body;
        const typeRoomId = req.params.id;

        const check = await checkUpdated(params);
        if(check === false) return res.status(400).send({message: 'Data not recived'});

        const msg = validateData(params);
        if(!msg)
        {
            if(params.numberPersons<0)
            return res.status(400).send({message:'The number persons cannot be less than 0.'})
            
            const typeRoomExist = await TypeRoom.findOne({$and:[{_id:typeRoomId},{hotel: params.hotel}]});
            if(!typeRoomExist) return res.status(400).send({message: 'TypeRoom not found'});

            let alreadyName = await TypeRoom.findOne({$and:[{name:params.name},{hotel: params.hotel}]});
                if(alreadyName && typeRoomExist.name != params.name) 
                return res.status(400).send({message: 'TypeRoom Already Exist'});
    
            const updatedTypeRoom = await TypeRoom.findOneAndUpdate({_id: typeRoomId}, params, {new: true});
            return res.send({message: 'Update TypeRoom', updatedTypeRoom});

        }else return res.status(400).send({message: 'Some parameter is empty'})

        }catch(err){
        console.log(err);
        return err; 
    }
}




//Eliminar Tipo de Habitación //
exports.deleteTypeRoom = async (req, res)=>{
    try{
        const typeRoomId = req.params.id;
        const typeRoomExist = await TypeRoom.findOne({_id: typeRoomId});
        if(!typeRoomExist) return res.status(400).send({message: 'TypeRoom not found or already deleted.'});     
        const searchDefault = await TypeRoom.findOne({$and:[{name:'DEFAULT'},{hotel:typeRoomExist.hotel}]})
        if(!searchDefault)
        {
            const paramsDefault =
            {
                name: 'DEFAULT',
                description: 'DEFAULT',
                numberPersons: 1,
                hotel: typeRoomExist.hotel
            }
            var typeRoom = new TypeRoom(paramsDefault);
            await typeRoom.save();
            const updateRooms = await Room.updateMany(
                {typeRoom : typeRoomExist._id},
                {typeRoom: typeRoom._id}
            )
        }
        else
        {
            const updateRooms = await Room.updateMany(
                {typeRoom : typeRoomExist._id},
                {typeRoom: searchDefault._id}
            )
            const typeRoomDeletd = await TypeRoom.findOneAndDelete({_id: typeRoomExist});
            return res.send({message: 'Delete TypeRoom.', typeRoomDeletd });
        }
          
    }catch(err){
        console.log(err); 
        return err; 
    }
}




//FUNCIONES DEL ADMINISTRADOR DEL HOTEL//
exports.getTypeRoomHotel = async(req, res)=>
{
    try
    {
        const administrator = req.user.sub;
        //BUSCAR HOTEL//
        const hotel = await Hotel.findOne({admin:administrator})
        if(!hotel)
            return res.status(400).send({message:'Not Found Hotel.'})
        
        const typesRooms = await TypeRoom.find({$and:[{hotel: hotel._id},{name:{$ne:'DEFAULT'}}]}).populate('hotel');

        return res.send({message: 'Types Rooms Found', typesRooms });
          
    }
    catch(err)
    {
        console.log(err); 
        return err; 
    }
}