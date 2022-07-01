'use strict'

const TypeEvent = require('../models/typeEvent.model');
const { validateData, checkUpdated} = require('../utils/validate');


//Función de Testeo//
exports.testTypeEvent = (req, res)=>{
    return res.send({message: 'Function testTypeEventis running'}); 
}


//Agregar Tipo de Evento//
exports.saveTypeEvent = async (req, res)=>{
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
        
        const existTypeEvent = await TypeEvent.findOne({name: params.name});
        if(!existTypeEvent){
            const typeEvent= new TypeEvent(data);
            await typeEvent.save();
            return res.send({message: 'TypeEvent saved', typeEvent});
        }else return res.status(400).send({message: 'TypeEvent already exist'});
    
    }catch(err){
        console.log(err); 
        return err; 
    }

}



//Mostrar todos los Tipos de Eventos//
exports.getTypeEvents = async (req, res)=>{
    try{
        const typeEvent = await TypeEvent.find();
        return res.send({message: 'TypeEvent:', typeEvent})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar un  Tipo de Evento//
exports.getTypeEvent = async (req, res)=>{
    try
    {
        const typeEventId = req.params.id
        const typeEvent = await TypeEvent.findOne({_id:typeEventId});
        return res.send({message: 'TypeEvent:', typeEvent})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Actualizar Tipo de Evento //
exports.updateTypeEvent = async (req, res)=>{
    try{
        const params = req.body;
        const typeEventId = req.params.id;

        const check = await checkUpdated(params);
        if(check === false) return res.status(400).send({message: 'Data not recived'});

        const msg = validateData(params);
        if(!msg)
        {
            const typeEventExist = await TypeEvent.findOne({_id: typeEventId});
            if(!typeEventExist) return res.status.send({message: 'TypeEvent not found'});

            let alreadyName = await TypeEvent.findOne({name: params.name});
                if(alreadyName && typeEventExist.name != params.name) return res.status(400).send({message: 'TypeEvent Already Exist'});
    
            const updatedTypeEvent = await TypeEvent.findOneAndUpdate({_id: typeEventId}, params, {new: true});
            return res.send({message: 'Update TypeEvent', updatedTypeEvent});

        }else return res.status(400).send({message: 'Some parameter is empty'})

        }catch(err){
        console.log(err);
        return err; 
    }
}




//Eliminar Tipo de Evento //
exports.deleteTypeEvent = async (req, res)=>{
    try{
        const typeEventId = req.params.id;
        const typeEventExist = await TypeEvent.findOne({_id: typeEventId});
        if(!typeEventExist) return res.status(400).send({message: 'TypeEvent not found or already deleted.'});     

        const typeEventDeletd = await TypeEvent.findOneAndDelete({_id: typeEventExist});
        return res.send({message: 'Delete TypeEvent.', typeEventDeletd });
          
    }catch(err){
        console.log(err); 
        return err; 
    }
}