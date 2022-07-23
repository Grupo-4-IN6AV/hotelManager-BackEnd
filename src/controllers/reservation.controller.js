'use strict'

const Reservation = require('../models/reservation.model');
const Room = require('../models/room.model');
const Hotel = require('../models/hotel.model');
const Service = require('../models/service.model');

const { validateData, detailsShoppingCart } = require('../utils/validate');



//Función de Testeo//
exports.testReservation = (req, res) => {
    return res.send({ message: 'Function test Reservation is running' });
}





//Función para enviar una reservación
exports.saveR = async (req, res) => {
    try {
        const user = req.user.sub;
        const params = req.body;
        const data = {
            entryDate: params.entryDate,
            exitDate: params.exitDate,
            room: params.room,
            hotel: params.hotel,
            user: user
        };

        const msg = validateData(data);
        if (msg) return res.status(400).send(msg);

        const finishDateEntry = new Date(params.entryDate);
        const finishDateExit = new Date(params.exitDate);


        //VERIFICAR FECHAS VALIDAS//
        //fechas correctas//

        if (finishDateEntry > finishDateExit)
            return res.status(400).send({ message: 'Dates Reservations not Correct.' })

        //Verificar con Fecha Actual//

        /*PARAMETRO DE ENTRADA DATA*/
        const dateLocalOne = new Date();
        const dateLocal = (dateLocalOne).toLocaleString('UTC', { timeZone: 'America/Guatemala' });
        const splitDate = dateLocal.split(' ');
        const splitDateOne = splitDate[0].split('/');
        if (splitDateOne[0] < 10) {
            splitDateOne[0] = '0' + splitDateOne[0];
        }
        if (splitDateOne[1] < 10) {
            splitDateOne[1] = '0' + splitDateOne[1];
        }
        const setDate = splitDateOne[2] + '-' + splitDateOne[1] + '-' + splitDateOne[0];
        const dateNow = new Date(setDate);

        if (finishDateEntry < dateNow || finishDateExit < dateNow)
            return res.status(400).send({ message: 'Dates Reservations Not Correct.' })

        //Verificar la Hotel//
        const verificHotel = await Hotel.findOne({ _id: params.hotel })
        if (!verificHotel) return res.status(400).send({ message: 'Hotel not found.' });


        //Verificar la Habitación//
        const verificRoom = await Room.findOne({ _id: params.room })
        if (!verificRoom) return res.status(400).send({ message: 'Room not found.' });


        const totalDaysOne = finishDateEntry.getTime();
        const totalDaysTwo = finishDateExit.getTime();
        const countDays = totalDaysTwo - totalDaysOne;
        const finishTotalNights = (countDays / (1000 * 60 * 60 * 24))
        const finishTotalDays = finishTotalNights + 1;


        const reservations = await Reservation.find({ "room.room": data.room })
        for (let reservation of reservations) {
            if (finishDateEntry >= reservation.entryDate && finishDateEntry < reservation.exitDate)
                return res.status(400).send({ message: 'This Room Not Available in this Dates 1.' })
            if (finishDateExit >= reservation.entryDate && finishDateExit <= reservation.exitDate)
                return res.status(400).send({ message: 'This Room Not Available in this Dates 2.' })
        }



        const setRoom = {
            room: params.room,
            price: verificRoom.price,
        }

        const checkdata = {
            user: req.user.sub,
            room: setRoom,
            entryDate: finishDateEntry,
            exitDate: finishDateExit,
            totalDays: finishTotalDays,
            totalNights: finishTotalNights,
        }

        checkdata.subTotal = setRoom.price * finishTotalNights;
        checkdata.IVA = parseFloat(checkdata.subTotal) * 0.12;
        checkdata.total = parseFloat(checkdata.subTotal) + parseFloat(checkdata.IVA);
        if (params.NIT == '' || params.NIT == undefined || params.NIT == null) { checkdata.NIT = 'C/F' }
        else { checkdata.NIT = params.NIT }

        const addReservation = new Reservation(checkdata);
        await addReservation.save();
        const reservation = await detailsShoppingCart(addReservation._id);
        //Actualizar la fecha disponible//
        const updateDateAvailable = await Room.findOneAndUpdate({ _id: params.room }, { dateAvailable: finishDateExit }, { new: true });

        //Actualizar Estado de las Habitaciones//
        const updateStateRoom = await Room.findOneAndUpdate({ _id: params.room }, { state: true }, { new: true });
        return res.send({ message: 'Added New Reservation.', reservation });

    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error creando la Reservación.' });
    }
}



exports.addService = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const params = req.body;
        const user = req.user.sub;
        const data = {
            services: params.services
        };

        let msg = validateData(data);
        if (msg) return res.status(400).send(msg);

        //Verificar que exista el Servicio//
        const serviceExist = await Service.findOne({ _id: params.services });
        if (!serviceExist) return res.status(400).send({ message: 'Service not found' });

        //Verificar que exista el Servicio en la Reservación//
        const serviceExistReservation = await Reservation.findOne({ $and: [{ _id: reservationId }, { 'services.service': params.services }] });
        if (serviceExistReservation) return res.status(400).send({ message: 'Service is already in this Reservation' });

        const reservationExist = await Reservation.findOne({ $and: [{ _id: reservationId }, { user: user }] });
        //Verificar que Exista la Reservación //
        if (!reservationExist)
            return res.status(400).send({ message: 'Reservation not found' });


        const setService = {
            service: data.services,
            price: serviceExist.price,
        }

        const subTotal = reservationExist.subTotal + (setService.price * reservationExist.totalDays);

        const IVA = parseFloat(setService.price * reservationExist.totalDays) * 0.12;
        const IVATotal = (reservationExist.IVA) + IVA;
        const total = (parseFloat(subTotal) + parseFloat(IVATotal));

        const newReservation = await Reservation.findOneAndUpdate({ _id: reservationExist._id },
            {
                $push: { services: setService },
                subTotal: subTotal,
                IVA: IVATotal,
                total: total
            },
            { new: true });
        const reservation = await detailsShoppingCart(newReservation._id);
        return res.send({ message: 'Added New Service to Reservation.', reservation })

    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error agregando servicio.' });
    }
}




exports.deleteService = async (req, res) => {
    try {
        const reservationID = req.params.id;
        const params = req.body;
        let data = {
            serviceID: params.serviceID
        };

        //Valida data obligatoria
        let msg = validateData(data);
        if (msg) return res.status(400).send(msg);

        const reservation = await Reservation.findOne({ _id: reservationID });
        if (!reservation) return res.status(400).send({ message: 'Reservation not found.' });


        const service = await Service.findOne({ _id: data.serviceID });
        if (!service) return res.status(400).send({ message: 'Service not found.' });
        const servicesReservation = reservation.services;

        const subTotal = reservation.subTotal - (service.price * reservation.totalDays);
        const IVA = parseFloat(service.price * reservation.totalDays) * 0.12;
        const IVATotal = (reservation.IVA) - IVA;
        const total = (parseFloat(subTotal) + parseFloat(IVATotal));
        const deleteServiceReservation = await Reservation.findOneAndUpdate(
            { _id: reservationID },
            {subTotal: subTotal, IVA: IVATotal, total:total }, { new: true }).lean();


        for (let serv of servicesReservation) {
            if (serv.service == data.serviceID) {

                //Eliminar el Servicio//
                const deleteServiceReservation = await Reservation.findOneAndUpdate(
                    { _id: reservationID },
                    { $pull: { 'services': { 'service': data.serviceID } } }, { new: true }).lean();
                //Eliminar el  Servicio a la Reservación //
                return res.send({ message: 'Service deleted successfully ', deleteServiceReservation });

            }
            if(serv.service != data.serviceID) return res.send({message: 'Service alredy delete'})
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error deleting Match.', err });
    }
}


































//Eliminar una Reservación  //
exports.deleteReservation = async (req, res) => {
    try {
        const reservationID = req.params.id;

        const reservationExist = await Reservation.findOne({ _id: reservationID });
        if (!reservationExist) return res.status(400).send({ message: 'Reservation not found or already deleted.' });

        const date = new Date();
        const dateLocal = (date).toLocaleString('UTC', { timeZone: 'America/Guatemala' });
        const splitDate = dateLocal.split(' ');
        const splitDateOne = splitDate[0].split('/');
        if (splitDateOne[0] < 10) {
            splitDateOne[0] = '0' + splitDateOne[0];
        }
        if (splitDateOne[1] < 10) {
            splitDateOne[1] = '0' + splitDateOne[1];
        }
        const setDate = splitDateOne[2] + '-' + splitDateOne[1] + '-' + splitDateOne[0];
        const setDateRoom = new Date(setDate);


        const reservationExisted = await Reservation.find({ _id: reservationID });
        for (let reservationDeleted of reservationExisted) {

            const idUpdatedRoom = await Room.findByIdAndUpdate({ _id: reservationDeleted.room.room }, { state: false }, { dateAvailable: setDateRoom });

        }

        const reservationDeleted = await Reservation.findOneAndDelete({ _id: reservationID });
        return res.send({ message: 'Delete Reservation.', reservationDeleted });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error deleting Reservation' });

    }
}