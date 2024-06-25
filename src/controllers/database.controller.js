import pool from "../db.js";


export const createUser = async (req, res) => {
    const {nombre, contrasena, correo} = req.body;

    try {
        const result = await pool.query(
            'insert into Usuario(nombre, correo, contraseña, creditos) values($1, $2, $3, 20) returning *', 
            [nombre, correo, contrasena]);

        res.json(result.rows[0]);
    } catch (e) {
       res.json({error: e.message});
    }
}

export const validarUsuario = async (req, res) => {
    const {contrasena, correo} = req.body;

    try {
        const result = await pool.query(
            'select * from usuario where correo = $1', 
            [correo]);
        if (result.rows.length > 0) {
            let v = false;
            let person = {};
            for (let i = 0; i <result.rows.length; i++ ) {
                const x = result.rows[i];
                console.log(x)
                if (x.contraseña === contrasena) {
                    v = true
                    person = x;
                    break;
                }
            }
            if (v) {person.login = true; res.json(person);}
            else res.json({login: false})
        } else {
            res.json({login: false})
        }
    } catch (e) {
        res.json({login: false})
    }
}


export const crearProyecto = async (req, res) => {
    const {nombre, descripcion} = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO Proyecto(Nombre, Descripcion) VALUES($1, $2) RETURNING *',
        [nombre, descripcion]);
        res.json(result.rows[0]);
    } catch (e) {
        res.status(404).json({mensaje: e});
    }
}

export const getUsuarios = async (req, res) => {
    try {
        const result = await pool.query('select * from usuario');
        res.json(result.rows);
    } catch (e) {
       res.json({error: e.message});
    }
}

export const getProyectos = async (req, res) => {
    try {
        const result = await pool.query('select * from Proyecto');
        res.json(result.rows);
    } catch (e) {
       res.json({error: e.message});
    }
}




export const getUsuariosById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('select * from Usuario where id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       res.json({error: e});
    }
}

export const getProyectById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(`select nombre, descripcion, TO_CHAR(FechaCreacion, 'DD/MM/YYYY HH24:MI') as fechaCrea, TO_CHAR(fechamodificacion, 'DD/MM/YYYY HH24:MI') as fechaModi, imagen
        from proyecto where id = $1;
        `, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       res.json({error: e});
    }
}





export const deleteProyecto = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('delete from video where id = $1 returning *', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }
        
    } catch (e) {
        res.json({error: e.message});
    }
}


export const updateUser = async (req, res, next) => {
    const {id} = req.params;
    const {nombre, contrasena} = req.body;
    try {
        const result = await pool.query(
            'update Usuario set nombre = $1, contrasena = $2 where id = $3 returning *', 
            [nombre, contrasena, id]);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       next(e);
    }
}
export const updateNameDescProyect = async (req, res, next) => {
    const {id} = req.params;
    const {
        nombre,
        descripcion,
    } = req.body;
    try {
        const result = await pool.query(
            `update video set nombre = $1, descripcion = $2 where id = $3 returning *`, 
            [nombre, descripcion, id]);
        // const result = await pool.query(
        //     `select TO_CHAR(fechamodificacion, 'DD/MM/YYYY HH24:MI') from Proyecto`);
        // const result = await pool.query(
        //     `SELECT CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE '-04:00'`);
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }

    } catch (e) {
       next(e);
    }
}

export const updateImageProyect = async (req, res) => {
    const { id } = req.params;
    const imagen = req.file.buffer; 

    console.log(req.file);

    try {
        const result = await pool.query(
            `update Proyecto set imagen = $1 where id = $2 returning *`, 
            [imagen, id]); 
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({mensaje: 'No encontre nada con ese id'});
        }
    } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        res.status(500).send('Error interno del servidor');
    }
};






//LOS VIDEOS QUE TIENE UN GUION
export const getVideoUsuario = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('select * from video where id_usuario = $1', [id]);
        res.json(result.rows);
    } catch (e) {
       res.json({error: e.message});    
    }
}


