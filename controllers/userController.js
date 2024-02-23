import {PrismaClient} from '@prisma/client';
import argon2, { hash } from 'argon2';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

export const getUsers = async (req, res)=>{
    try {
        const response = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                department: true,
                role: true
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async (req, res)=>{
    try {
        const response = await prisma.users.findUnique({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                name: true,
                department: true,
                role: true
            }
        });
        if(!response) return res.status(404).json({msg: 'Sorry, Data not found'});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async (req, res)=>{
    const {name, email, password, confPassword, department, role} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: 'Password and Confirm Password not match'});
    const hashPassword = await argon2.hash(password);
    try {
        await prisma.users.create({
            data:{
                name: name,
                email: email,
                password: hashPassword,
                department: department,
                role: role
            }
        });
        res.status(201).json({msg: 'User registered succesfully'})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }

}

export const updateUser = async (req, res)=>{
    const user = await prisma.users.findUnique({
        where:{
            id: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: 'Sorry, User not found'});
    const {name, email, password, confPassword, department, role} = req.body;

    let hashPassword;
    if(password === null || password === ""){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }

    if(password !== confPassword) return res.status(400).json({msg: 'Password and Confirm Password not match'});

    try {
        await prisma.users.update({
            where:{
                id: user.id
            },
            data:{
                name: name,
                email: email,
                password: hashPassword,
                department: department,
                role: role
            }
        });
        res.status(200).json({msg: 'User updated succesfully'})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async (req, res)=>{
    const user = await prisma.users.findUnique({
        where:{
            id: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: 'Sorry, User not found'});
    try {
        await prisma.users.delete({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: 'User deleted succesfully'})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}