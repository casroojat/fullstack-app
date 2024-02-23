import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

export const verifyUser = async (req, res, next)=>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Please Login to your account"})
    }
    const user = await prisma.users.findUnique({
        where:{
            id: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: 'Sorry, User not found'});
    req.userId = user.id;
    req.role = user.role;
    req.department = user.department;
    next();
}

export const adminOnly = async (req, res, next)=>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Please Login to your account"})
    }
    const user = await prisma.users.findUnique({
        where:{
            id: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: 'Sorry, User not found'});
    if(user.role !== 'admin') return res.status(403).json({msg: 'access to the requested resource is forbidden, Please contact your Administrator'});
    next();
}