const Vendor= require('../models/Vendor');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const dotEnv=require('dotenv');
const { response } = require('express');
dotEnv.config();
const secretKey=process.env.WhatIsYourName
const vendorRegister= async(req, res)=>{
    const{username, email, password}=req.body;
    try{
        const vendorEmail= await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email already exist, try logging in");
        }
        const hashPassword= await bcrypt.hash(password, 10);
        const newVendor= new Vendor({
            username,
            email,
            password:hashPassword
        });
        await newVendor.save();
        res.status(201).json("Vendor registered successfully");
        console.log('registered')
    }
    catch(error){
        res.status(500).json({error:"Internal server error"})
        console.error(error);
    }
}

const vendorLogin= async(req,res)=>{
    const{email, password}=req.body;
    try{
        const vendor=await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password, vendor.password))){
            return res.status(401).json("Invalid email or password");
        }
        const token= jwt.sign({vendorId: vendor._id}, secretKey,{expiresIn:"1h"})

        res.status(200).json({success:"Loggedin Succesfully!", token})
            console.log(email, "this is token:", token);
    }
    catch(error){
        res.status(500).json({error:"Internal server error"})
        console.error(error);
    }

}
const getAllVendors= async(req, res)=>{
    try{
        const vendors= await Vendor.find().populate('firm');
        res.json({vendors})
        console.log("fetched");
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
}

const getVendorById=async(req,res)=>{
    const vendorId=req.params.id;

    try{
        const vendor=await Vendor.findById(vendorId);
        if(!vendor){
            return res.status(404).json({error:"Vendor not fount"})
        }
        res.status(200).json({vendor})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports={vendorRegister, vendorLogin, getAllVendors, getVendorById}


