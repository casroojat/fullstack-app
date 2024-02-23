import {PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

export const getPost = async (req, res)=>{
    try {
        let response;
        if(req.role === 'admin'){
            response = await prisma.post.findMany({
                select:{
                    id: true,
                    title: true,
                    article: true,
                    image: true,
                    url_image: true,
                    createdAt: true,
                    postCategory:{
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        }else{
            response = await prisma.post.findMany({
                where:{
                    authorId: req.userId
                },
                select:{
                    id: true,
                    title: true,
                    article: true,
                    image: true,
                    url_image: true,
                    createdAt: true,
                    postCategory:{
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    author: {
                        select: {
                            id: true,
                            name: true        
                        }
                    }
                }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getPostById = async (req, res)=>{
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id
            }
        });
        if(!post) return res.status(404).json({msg: 'Post not found'})

        let response;
        if(req.role === 'admin'){
            response = await prisma.post.findUnique({
                where: {
                    id: post.id
                },
                select:{
                    id: true,
                    title: true,
                    article: true,
                    image: true,
                    url_image: true,
                    createdAt: true,
                    postCategory:{
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        }else{
            if(req.userId !== post.authorId) return res.status(403).json({msg: "Unauthorized access. please contact the administrator!"});
            response = await prisma.post.findUnique({
                where: {
                    id: post.id,
                    AND:[
                        {authorId: req.userId}
                    ]
                },
                select:{
                    id: true,
                    title: true,
                    article: true,
                    image: true,
                    url_image: true,
                    createdAt: true,
                    postCategory:{
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createPost = async (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No file uploaded"});
    const title = req.body.title;
    const postCategoryId = req.body.postCategoryId;
    const article = req.body.article;
    const image = req.files.image;
    const imageSize = image.data.length;
    const ext = path.extname(image.name);
    let timeStamp = Date.now().toString();
    const imageName = timeStamp + image.md5 + ext;
    const url_image = `${req.protocol}://${req.get("host")}/images/post/${imageName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid image type"});
    if(imageSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 Mb"});
    
    image.mv(`./public/images/post/${imageName}`, async(err)=>{
    if(err) return res.status(500).json({msg: err.message});
        try {
            await prisma.post.create({
                data:{
                    title: title,
                    article: article,
                    image: imageName,
                    url_image: url_image,
                    postCategoryId: postCategoryId,
                    authorId: req.userId
                }
            });
            res.status(201).json({msg: "Post created succesfuly"})
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    });
}

export const updatePost = async (req, res)=>{
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id
            }
        });
        if(!post) return res.status(404).json({msg: 'Post not found'});

        let imageName= "";
    
        if(req.files === null){
            imageName = post.image
        }else{
            const image = req.files.image;
            const imageSize = image.data.length;
            const ext = path.extname(image.name);
            let timeStamp = Date.now().toString();
            imageName = timeStamp + image.md5 + ext;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid image type"});
            if(imageSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 Mb"});
            
            const filePath = `./public/images/post/${post.image}`;
            fs.unlinkSync(filePath);

            image.mv(`./public/images/post/${imageName}`, async (err)=>{
                if(err) return res.status(500).json({msg: err.message});
            });
        }

        const title = req.body.title;
        const postCategoryId = req.body.postCategoryId;
        const article = req.body.article;
        const url_image = `${req.protocol}://${req.get("host")}/images/post/${imageName}`;

        if(req.role === 'admin'){
            
            await prisma.post.update({
                data: {
                    title: title,
                    article: article,
                    image: imageName,
                    url_image: url_image,
                    postCategoryId: postCategoryId,
                    authorId: post.authorId
                },
                where: {
                    id: post.id
                }
            })
        }else{
            if(req.userId !== post.authorId) return res.status(403).json({msg: "Unauthorized access. please contact the administrator!"});

            await prisma.post.update({
                data: {
                    title: title,
                    article: article,
                    image: imageName,
                    url_image: url_image,
                    postCategoryId: postCategoryId,
                    authorId: post.authorId
                },
                where: {
                    id: post.id,
                    AND:[
                        {authorId: req.userId}
                    ]
                }
            })
        }
        res.status(200).json({msg: "Post updated succesfully"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    } 
}

export const deletePost = async (req, res)=>{
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id
            }
        });
        if(!post) return res.status(404).json({msg: 'Post not found'})
        
        if(req.role === 'admin'){
            const filePath = `./public/images/post/${post.image}`;
            fs.unlinkSync(filePath);
            await prisma.post.delete({
                where: {
                    id: post.id
                }
            })
        }else{
            if(req.userId !== post.authorId) return res.status(403).json({msg: "Unauthorized access. please contact the administrator!"});
            const filePath = `./public/images/post/${post.image}`;
            fs.unlinkSync(filePath);
            await prisma.post.delete({
                where: {
                    id: post.id,
                    AND:[
                        {authorId: req.userId}
                    ]
                }
            })
        }
        res.status(200).json({msg: "Post deleted succesfully"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    } 
}
