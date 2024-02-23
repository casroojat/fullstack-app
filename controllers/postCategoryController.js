import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

export const getPostCategory = async (req, res)=>{
    try {
        const response = await prisma.postCategory.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getPostCategoryById = async (req, res)=>{
    try {
        const response = await prisma.postCategory.findUnique({
            where: {
                id: req.params.id
            }
        });
        if(!response) return res.status(404).json({msg: 'Sorry, Data not found'});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createPostCategory = async (req, res)=>{
    const {name, information} = req.body
    try {
        await prisma.postCategory.create({
            data:{
                name : name,
                information : information
            }
        })
        res.status(201).json({msg: 'Post category created'})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updatePostCategory = async (req, res)=>{

}

export const deletePostCategory = async (req, res)=>{

}
