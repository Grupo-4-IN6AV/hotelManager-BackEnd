'use strict'

const Service = require('../models/service.model');
const Hotel = require('../models/hotel.model');
const { validateData, checkUpdated} = require('../utils/validate');


//Función de Testeo//
exports.testService = (req, res)=>{
    return res.send({message: 'Function test Service is running'}); 
}


//Agregar Tipo de Servicio//
exports.saveService  = async (req, res)=>{
    try{
        const params = req.body; 
        const data = {
            name: params.name,
            description: params.name,
            price: params.price,
            hotel: params.hotel,
        };
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);
            
        const hotelExist = await Hotel.findOne({_id: data.hotel});
        if(!hotelExist) return res.send({message: 'Hotel not found'});
        
        if(data.price<0)
            return res.status(400).send({message:'The price cannot be less than 0.'})

        const existService = await Service.findOne({$and:[{name: data.name},{hotel:data.hotel}]});
        if(!existService){
            const service = new Service(data);
            await service.save();
            return res.send({message: 'Service saved successfully', service});
        }else return res.status(400).send({message: 'Service already exist'});
    
    }catch(err){
        console.log(err); 
        return err; 
    }

}



//Mostrar todos los Tipos de Servicios//
exports.getServices = async (req, res)=>{
    try{
        const services = await Service.find().populate('hotel');
        return res.send({message: 'Services:', services})
    }catch(err){
        console.log(err); 
        return err; 
    }
}


//Mostrar un  Servicio//
exports.getService = async (req, res)=>{
    try
    {
        const serviceId = req.params.id
        const service = await Service.findOne({_id: serviceId}).populate('hotel');
        if (!service) return res.send({message: 'Service not found'})
        return res.send({message: 'Service:', service})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



//Actualizar un Servicio//
exports.updateService= async (req, res)=>{
    try{
        const params = req.body;
        const serviceId = req.params.id;

        const data = {
            name: params.name,
            description: params.name,
            price: params.price,
        };

        const check = await checkUpdated(data);
        if(check === false) return res.status(400).send({message: 'Data not recived'});

        const msg = validateData(data);
        if(!msg)
        {
            const serviceExist = await Service.findOne({_id: serviceId});
            if(!serviceExist) return res.status.send({message: 'Service  not found'});

            let alreadyName = await Service.findOne({$and:[{name: data.name},{hotel: serviceExist.hotel}]});
                if(alreadyName && serviceExist.name != data.name) return res.status(400).send({message: 'Service Already Exist'});
    
            const updatedService = await Service.findOneAndUpdate({_id: serviceId}, data, {new: true});
            return res.send({message: 'Service updated Successfully', updatedService});

        }else return res.status(400).send({message: 'Some parameter is empty'})

        }catch(err){
        console.log(err);
        return err; 
    }
}




//Eliminar un Servicio //
exports.deleteService= async (req, res)=>{
    try{
        const serviceId = req.params.id;
        const serviceExist = await Service.findOne({_id: serviceId});
        if(!serviceExist) return res.status(400).send({message: 'Service not found or already deleted.'});     

        const serviceDeletd = await Service.findOneAndDelete({_id: serviceId});
        return res.send({message: 'Service deleted Successfully', serviceDeletd });
          
    }catch(err){
        console.log(err); 
        return err; 
    }
}