'use strict'

const User = require('../models/user.model');
const Reservation = require('../models/reservation.model');

const {validateData, encrypt, alreadyUser, checkPassword, 
    checkUpdate, checkPermission, checkUpdateAdmin, validExtension} = require('../utils/validate');
const jwt = require('../services/jwt');

//Connect Multiparty Upload Image//
const fs = require('fs');
const path = require('path');

//FUNCIONES PÚBLICAS
exports.userTest = async (req, res)=>{
    await res.send({message: 'User Test is running.'})
}


exports.register = async(req, res)=>{
    try{
        const params = req.body;
        let data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: 'CLIENT'
        };
        let msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        let already = await alreadyUser(data.username);
        if(already) return res.status(400).send({message: 'Username already in use'});
        data.surname = params.surname;
        data.phone = params.phone;
        data.password = await encrypt(params.password);

        let user = new User(data);
        await user.save();
        return res.send({message: 'User created successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving user'});
    }
}


exports.login = async(req, res)=>{
    try{
        const params = req.body;
        let data = {
            username: params.username,
            password: params.password
        }
        let msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        let already = await alreadyUser(params.username);
        if(already && await checkPassword(data.password, already.password)){
            let token = await jwt.createToken(already);
            delete already.password;

            return res.send({message: 'Login successfuly', already, token});
        }else return res.status(401).send({message: 'Invalid credentials'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Failed to login'});
    }
}


//FUNCIONES PRIVADAS
//CLIENT
exports.updateAccount = async(req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update this user'});
        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.send({message: 'User not found'});
        const validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'Cannot update this information or invalid params'});
        let alreadyname = await alreadyUser(params.username);
        if(alreadyname && userExist.username != params.username) return res.status(400).send({message: 'Username already in use'});
        const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new: true}).lean();
        if(userUpdate) return res.send({message: 'User updated', userUpdate});
        return res.send({message: 'User not updated'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Failed to update user'});
    }
}


exports.delete = async(req, res)=>{
    try{
        const userId = req.params.id;
        const persmission = await checkPermission(userId, req.user.sub);
        if(persmission === false) return res.status(403).send({message: 'You dont have permission to delete this user'});

        const reservationsExist = await Reservation.find({ user: userId });
        for (let reservationDeleted of reservationsExist) 
        {
            const deleteReservation = await Reservation.findOneAndDelete({ _id: reservationDeleted._id });
        }

        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(userDeleted) return res.send({message: 'Account deleted', userDeleted});
        return res.send({message: 'User not found or already deleted'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting user'});
    }
}


exports.changePassword = async(req,res)=>
{
    //Eliminar solo por token o se puede ingresar id de la empresa?//
    const userID = req.params.id;

    //INGRESAR CONTRASEÑA PARA ELIMINAR//
    const params = req.body;

    const password = params.password;
    const newPassword = params.newPassword;

    const data =
    {
        password: password,
        newPassword: newPassword
    }

    let msg = validateData(data);
    if(msg) return res.status(400).send(msg);

    const persmission = await checkPermission(userID, req.user.sub);
    if(persmission === false) return res.status(403).send({message: 'You dont have permission to Change Password.'});

    const userExist = await User.findOne({_id:userID});

    if(userExist && await checkPassword(password, userExist.password))
    {
        data.newPassword = await encrypt(params.newPassword);
        const changePassword = await User.findOneAndUpdate(
            {_id:userID},{password:data.newPassword},{new:true})
        return res.send({message:'Password Updated Successfully'})
    }
    else
    {
        return res.status(400).send({message:'The password is not correct'})
    }
}


//FUNCIONES PRIVADAS
//ADMIN

exports.saveUser = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: params.role
        };
        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const userExist = await alreadyUser(params.username);
        if(userExist) return res.status(400).send({message: 'Username already in use'});
        if(params.role != 'ADMIN' && params.role != 'CLIENT'  && params.role != 'ADMIN HOTEL') return res.status(400).send({message: 'Invalid role'});
        
        data.surname = params.surname;
        data.phone = params.phone;
        data.password = await encrypt(params.password);

        const user = new User(data);
        await user.save();
        return res.send({message: 'User saved successfully', user});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving user'});
    }
}

exports.updateUser = async(req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.send({message: 'User not found'});
        const emptyParams = await checkUpdateAdmin(params);
        if(emptyParams === false) return res.status(400).send({message: 'Empty params or params not update'});
        if(userExist.role === 'ADMIN') return res.status(400).send({message: 'User with ADMIN role cant update'});
        const alreadyUsername = await alreadyUser(params.username);
        if(alreadyUsername && userExist.username != alreadyUsername.username) return res.status(400).send({message: 'Username already taken'});
        if(params.role != 'ADMIN HOTEL' && params.role != 'CLIENT') return res.status(400).send({message: 'Invalid role'});
        const userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new: true});
        if(!userUpdated) return res.send({message: ' User not updated'});
        return res.send({message: 'User updated successfully', username: userUpdated.username});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error updating user'});
    }
}



exports.deleteUser = async(req, res)=>{
    try{
        const userId = req.params.id;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'User not found'});
        if(userExist.role === 'ADMIN') return res.status(400).send({message: ' Could not deleted User with ADMIN role'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(!userDeleted) return res.status(400).send({message: 'User not deleted'});


        const reservationsExist = await Reservation.find({ user: userId });
        for (let reservationDeleted of reservationsExist) 
        {
            const deleteReservation = await Reservation.findOneAndDelete({ _id: reservationDeleted._id });
        }

        return res.send({message: 'User deleted Successfully', userDeleted})
    }catch(err) {
        console.log(err);
        return res.status(500).send({err, message: 'Error removing account'});
    }
}


exports.getUser = async (req, res) =>{
    try{
        const userId = req.params.id;

        const user = await User.findOne({ _id: userId});
        if (!user) return res.status(400).send({ message: 'This user does not exist.' })
        else return res.send({message:'User Found:', user});

    }catch (err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting User.', err});
    }
};


exports.searchUser = async (req, res)=>{
    try{
        const params = req.body;
        const data ={
            name: params.name
        }
    
        const users = await User.find({name: {$regex: params.name, $options:'i'}});
        return res.send({message:'User Founds', users});
            
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error searching Users.', err});
    }
}


exports.getUsers = async (req, res) =>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENT'},{role:'ADMIN HOTEL'}]});
        if (!users) return res.status(400).send({ message: 'This user does not exist.' })
        else return res.send({message:'User Found:', users});
    }
    catch (err)
    {
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersByUp = async(req, res)=>{
    try
    {
        const users = await User.find({$or:[{role:'CLIENT'},{role:'ADMIN HOTEL'}]}).sort({name: 'asc'});
        return res.send({users});
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersByDown = async(req, res)=>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENT'},{role:'ADMIN HOTEL'}]}).sort({name: 'desc'});
        return res.send({users});   
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersSurnameByUp = async(req, res)=>{
    try
    {
        const users = await User.find({$or:[{role:'CLIENT'},{role:'ADMIN HOTEL'}]}).sort({surname: 'asc'});
        return res.send({users});
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersSurnameByDown = async(req, res)=>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENT'},{role:'ADMIN HOTEL'}]}).sort({surname: 'desc'});
        return res.send({users});   
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersClient = async(req, res)=>
{
    try
    {
        const users = await User.find({role:'CLIENT'});
        return res.send({users});   
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersAdminHotel = async(req, res)=>
{
    try
    {
        const users = await User.find({role:'ADMIN HOTEL'});
        return res.send({users});   
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}

//Función para agregar una IMG a una COMPANY
exports.addImageUser=async(req,res)=>
{
    try
    {
        const userID = req.params.id;

        const permission = await checkPermission(userID, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update this User.'});
        const alreadyImage = await User.findOne({_id: req.user.sub});
        let pathFile = './uploads/users/';
        if(alreadyImage.image) fs.unlinkSync(pathFile+alreadyImage.image);
        if(!req.files.image || !req.files.image.type) return res.status(400).send({message: 'Havent sent image'});
        
        const filePath = req.files.image.path; 
       
        const fileSplit = filePath.split('\\'); 
        const fileName = fileSplit[2]; 

        const extension = fileName.split('\.'); 
        const fileExt = extension[1]; 

        const validExt = await validExtension(fileExt, filePath);
        if(validExt === false) return res.status(400).send('Invalid extension');
        const updateUser = await User.findOneAndUpdate({_id: req.user.sub}, {image: fileName}, {new: true}).lean();        if(!updateUser) return res.status(404).send({message: 'User not found'});
        if(!updateUser) return res.status(404).send({message: 'User not found'});
        delete updateUser.password;
        return res.send(updateUser);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({err, message: 'Error Add Image User Company'});
    }
}

exports.getImageUser = async(req, res)=>
{
    try
    {
        const fileName = req.params.fileName;
        const pathFile = './uploads/users/' + fileName;

        const image = fs.existsSync(pathFile);
        if(!image) return res.status(404).send({message: 'Image not found'});
        return res.sendFile(path.resolve(pathFile));
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({err, message: 'Error getting image'});
    }
}
