'use strict'

const User = require('../models/user.model');
const {validateData, encrypt, alreadyUser, checkPassword, checkUpdate, checkPermission, checkUpdateAdmin} = require('../utils/validate');
const jwt = require('../services/jwt');

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
exports.update = async(req, res)=>{
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
        if(alreadyname && userExist.username != params.username) return res.send({message: 'Username already in use'});
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
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(userDeleted) return res.send({message: 'Account deleted', userDeleted});
        return res.send({message: 'User not found or already deleted'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting user'});
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
            username: params.username
        }

        const msg = validateData(data);

        if(!msg){
            const user = await User.find({username: {$regex: params.username, $options:'i'}});
            return res.send({message:'User Founds', user});
            
        }else return res.status(400).send(msg);
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