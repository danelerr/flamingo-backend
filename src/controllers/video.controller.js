import pool from "../db.js";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Para el endopoint "/"
export const rootCode = async (req, res) => {
    res.send('Backend de Flamingo🦩🦩🦩🦩');
}

// Para el endpoint '/video/:nobmre'
export const getVideo = (req, res) => {
    const fileName = req.params.filename;
    const filePath = `videos/${fileName}.mp4`;
    console.log(__dirname);
    if (!filePath) {
        return res.status(404).send('Archivo no encontrado');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end =  parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = end - start + 1;

        const file = fs.createReadStream(filePath, {start, end});
        const head = {
          'Content-Range': `bytes ${start} - ${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4' 
        }
        res.writeHead(206, head); 
        file.pipe(res);
   } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4' 
        }
        res.writeHead(200, head); 
        fs.createReadStream(filePath).pipe(res);
   }
}

// para el endpoint '/detalles/:filename
export const getDetalleVideo = (req, res) => {
    const fileName = req.params.filename;
    const filePath =`videos/${fileName}.mp4`;

    if (!filePath) {
        return res.status(404).send('Archivo no encontrado');
    }

    const videoDetails = {
        nombre: fileName,
        miniatura: `http://177.222.103.79:3000/miniatura/${fileName}`
    };

    res.json(videoDetails);
}

// Para el endpoint '/miniatura/:filename'
export const getMiniatura = (req, res) => {
    const fileName = req.params.filename;
    const filePath = `videos/${fileName}.mp4`;;
    if (!filePath) {
        return res.status(404).send('Archivo no encontrado');
    }

    // Generar miniatura usando fluent-ffmpeg
    ffmpeg(filePath)
        .on('end', () => {
            console.log('Generación de miniatura completa');
            const ruta = __dirname.substring(0, __dirname.lastIndexOf('src')) + `/miniaturas/${fileName}.png`;
            console.log(ruta);
            res.sendFile(ruta);
        })
        .on('error', (err) => {
            console.error('Error al generar la miniatura:', err);
            res.status(500).send('Error al generar la miniatura');
        })
        .screenshots({
            count: 1,
            folder: __dirname + '/../../miniaturas',
            filename: `${fileName}.png`,
        });
}

const videosFolderPath = './videos';

// para el endpoint '/lista-videos
export const getListaVideos = (req, res) => {
    fs.readdir(videosFolderPath, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio de videos:', err);
            return res.status(500).send('Error al obtener la lista de videos');
        }
        
        const videoFiles = files.map((file) => file.substring(0, file.lastIndexOf('.')));
        
        res.json(videoFiles);
    });
}

export const uploadVideo = (req, res) => {
    const archivo = req.file;

    if (!archivo) {
        console.log('entra aqui')
        return res.status(400).send('No se ha proporcionado ningún archivo.');
    };
    const ruta = __dirname.substring(0, __dirname.lastIndexOf('src')) + `/videos/${archivo.originalname}`;

    fse.writeFile(ruta, archivo.buffer, (err) => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
            return res.status(500).send('Error al escribir el archivo');
        }

        res.send('Archivo recibido y copiado en el backend');
    });
}



export const uploadVideoBD = async (req, res) => {
    const {nombre, id} = req.body;

    try {
        const result = await pool.query(
            ' insert into video(nombre, id_usuario, codigo) values($1, $2, $3) returning *', 
            [nombre, id, nombre]);
            
        res.send('pruebita');
    } catch (e) {
       res.json({error: e.message});
    }
}