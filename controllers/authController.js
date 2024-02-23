import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

export const login = async (req, res)=>{
    const user = await prisma.users.findUnique({
        where:{
            email: req.body.email
        }
    });
    if(!user) return res.status(404).json({msg: "Wrong email or password"});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(4000).json({msg: "Wrong email or password"});
    req.session.userId = user.id;
    const id = user.id;
    const name = user.name;
    const email = user.email;
    const department = user.department;
    const role = user.role;
    res.status(200).json({id, name, email, department, role});
}

export const Me = async (req, res)=>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Please Login to your account"})
    }
    const user = await prisma.users.findUnique({
        where:{
            id: req.session.userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            department: true,
            role: true
        }
    });
    if(!user) return res.status(404).json({msg: 'Sorry, User not found'});
    res.status(200).json(user);
}

export const LogOut = async (req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Logout Failed!"});
        res.status(200).json({msg: "Logout successfully"})
    });
}