require('dotenv').config();

const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const cipherjs = require('cipherjs');
const DES = require('node_triple_des');
const {nanoid} = require('nanoid');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const AFFINE_M = 7;
const AFFINE_B = 20;
const DES_KEY = "AJDSASDQWEQJDKASDH"; 

const superEncrypt = (plainText)=>{
  let cipherText = cipherjs.Affine.encrypt(plainText, AFFINE_M, AFFINE_B);
  cipherText = DES.encrypt(DES_KEY, cipherText);
  return cipherText;
}

const superDecrypt = (cipherText)=>{
  let plainText = DES.decrypt(DES_KEY, cipherText);
  plainText = cipherjs.Affine.decrypt(DES_KEY, plainText);
  return plainText;
}

const loginHandler = async(req,res,next)=>{
  try {
    const {email, password} = req.body;

    let hashedPassword = md5(password);

    const encryptedEmail = superEncrypt(email);

    const currentUser = await User.findOne(
      {where: {email: encryptedEmail}}
    );
    
    if(!currentUser){
      const error = new Error('Wrong email or password');
      error.statusCode = 400;
      throw error;
    }

    if(currentUser.password !== hashedPassword){
      const error = new Error('Wrong email or password');
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign({
      userId: currentUser.id, 
    }, JWT_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '3d'
    })

    res.status(200).json({
      status: "SUCCESS",
      message: "LOGIN SUCCESSFULL!",
      token
    })

  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message
    })
  }
}

const registerHandler = async(req,res,next)=>{
  try {
    const id = uuidv4();
    const nanoId = nanoid();
    const {email, fullName, username, password} = req.body;

    const encryptedEmail = superEncrypt(email);
    const encryptedFullName = superEncrypt(fullName);
    const encryptedUsername = superEncrypt(username);

    let hashedPassword = md5(password);

    const path = `./directories/${nanoId}`

    fs.access(path, (error)=>{
      if (error) { 
        fs.mkdir(path, (error) => { 
          if (error) { 
            throw error; 
          } else { 
            console.log("New Directory created successfully !!"); 
          } 
        }); 
      } else { 
        console.log("Given Directory already exists !!"); 
      } 
    })

    const currentUser = await User.create({
      id,
      email : encryptedEmail,
      fullName : encryptedFullName,
      username : encryptedUsername, 
      password: hashedPassword
    })

    currentUser.createDirectory({id: nanoId});

    const token = jwt.sign({
      userId: currentUser.id, 
    }, JWT_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '3d'
    })

    res.status(201).json({
      status: "SUCCESS",
      message: "REGISTER SUCCESSFULL!",
      token
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message
    })
  }
}

module.exports = {
  loginHandler, registerHandler
}