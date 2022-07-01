'use strict'

const TypeRoom = require('../models/typeRoom.model');
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
            
        };
        console.log(data)
        const msg = validateData(data);
        if(msg)
            return res.status(400).send(msg);
        
        const existTypeRoom = await TypeRoom.findOne({name: params.name});
        if(!existTypeRoom){
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
exports.getTypeRooms = async (req, res)=>{
    try{
        const typeRoom = await TypeRoom.find();
        return res.send({message: 'TypeRoom:', typeRoom})
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
        const typeRoom = await TypeRoom.findOne({_id: typeRoomId});
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
            const typeRoomExist = await TypeRoom.findOne({_id: typeRoomId});
            if(!typeRoomExist) return res.status.send({message: 'TypeRoom not found'});

            let alreadyName = await TypeRoom.findOne({name: params.name});
                if(alreadyName && typeRoomExist.name != params.name) return res.status(400).send({message: 'TypeRoom Already Exist'});
    
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

        const typeRoomDeletd = await TypeRoom.findOneAndDelete({_id: typeRoomExist});
        return res.send({message: 'Delete TypeRoom.', typeRoomDeletd });
          
    }catch(err){
        console.log(err); 
        return err; 
    }
}