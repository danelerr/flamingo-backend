import { Router } from "express";

import { 
    rootCode, 
    getVideo, 
    getDetalleVideo,
    getMiniatura,
    getListaVideos,
    uploadVideo,
    uploadVideoBD
 } from "../controllers/video.controller.js";


import multer from 'multer';


const router = Router();

const upload = multer();


router.get('/', rootCode);

router.get('/videos/:filename', getVideo);

router.get('/detalles/:filename', getDetalleVideo);

router.get('/miniatura/:filename', getMiniatura);

router.get('/lista-videos', getListaVideos);

router.post('/subir-video', upload.single('archivo'), uploadVideo);

router.post('/subir-video-bd', uploadVideoBD);

export default router;









/* ENDPOINT EN DESARROLLO */
// const outputVideoPath = 'videos/combined-video.mp4'; 

// router.get('/exportar', (req, res) => {
//     const inputVideos = Object.values(`videos/${fileName}.mp4`).map(videoPath => {
//         return `-i "${path.join(__dirname, videoPath)}"`;
//     }).join(' ');

//     console.log(inputVideos);
//     ffmpeg()
//         .input(inputVideos)
//         .inputFormat('mp4')
//         .on('end', () => {
//             console.log('Combinación de videos completa');
//             res.sendFile(path.join(__dirname, outputVideoPath));
//         })
//         .on('error', (err) => {
//             console.error('Error al combinar videos:', err);
//             res.status(500).send('Error al combinar videos');
//         })
//         .mergeToFile(path.join(__dirname, outputVideoPath), __dirname);
// });