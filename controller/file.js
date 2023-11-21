const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { nanoid } = require('nanoid');
const cipherjs = require('cipherjs');
const DES = require('node_triple_des');
const fs = require('fs');
const Folder = require('../model/Folder');
const { Op } = require('sequelize');

const AFFINE_M = 7;
const AFFINE_B = 20;
const DES_KEY = "AJDSASDQWEQJDKASDH";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; 

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

const createFolder = async(req,res,next)=>{
  try {
    const { name } = req.body;
    const decoded = jwt.verify(req.token, JWT_SECRET_KEY);
    const currentUser = await User.findOne({where: {id: decoded.userId}});
    if(!currentUser){
      const error = new Error("You need to login");
      error.statusCode = 403;
      throw error;
    }

    const currentDir = await currentUser.getDirectory();

    const nanoId = nanoid();

    const encryptedName = superEncrypt(name);

    const path = `./directories/${currentDir.id}/${nanoId}`

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
    const userFolder = await Folder.findOne({
      where:{
        [Op.or]:[
          {name: encryptedName },
          {directoryId: currentDir.id}
        ]
      }
    })

    if(userFolder){
      const error = new Error(`Folder ${name} already exist!`);
      error.statusCode = 400;
      throw error;
    }

    await Folder.create({
      id: nanoId, name: encryptedName, directoryId: currentDir.id
    })
    res.status(201).json({
      status: "SUCCESS",
      message: "CREATE FOLDER SUCCESSFULL!",
    })

  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message
    })
  }
}

module.exports = { 
  createFolder
}