// Cargando los modulos de node
const http = require('http')
const url = require('url')
const fs = require('fs')

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

const formatDate = (date) => {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}
// 1. Crear un servidor en Node con el módulo http.
http
    .createServer(function (req, res) {
        const params = url.parse(req.url, true).query
        const nombre = params.archivo
        const contenido = params.contenido
        const nuevoNombre = params.nuevoNombre
        const fecha = new Date()

        // 2. Disponibilizar una ruta para crear un archivo a partir de los parámetros de la consulta recibida.
        if (req.url.includes('/crear')) {
            if (nombre) {
                // 7. Agrega la fecha actual al comienzo del contenido de cada archivo creado en formato
                // “dd/mm/yyyy”. Considera que si el día o el mes es menor a 10 concatenar un “0” a la
                // izquierda. (Opcional)
                fs.writeFile(nombre, `${formatDate(fecha)}\n` + contenido, 'utf8', () => {
                    res.write('Archivo creado con éxito!')
                    res.end()
                })
            } else {
                // 6. Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida.
                res.write('El archivo no fue creado. Por favor, ingresar el nombre')
                res.end()
            }
        }

        // 3. Disponibilizar una ruta para devolver el contenido de un archivo cuyo nombre es declarado en los parámetros de la consulta recibida.
        if (req.url.includes('/leer')) {
            fs.readFile(nombre, (err, data) => {
                // 6. Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida.
                if (err) {
                    res.write('No se encuentra el archivo')
                    res.end()
                } else {
                    res.write(data)
                    res.end()
                }
            })
        }

        // 4. Disponibilizar una ruta para renombrar un archivo, cuyo nombre y nuevo nombre es declarado en los parámetros de la consulta recibida.
        if (req.url.includes('/renombrar')) {
            fs.rename(nombre, nuevoNombre, (err, data) => {
                // 6. Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida.
                if (err) {
                    res.write('Error al renombrar el archivo')
                    res.end()
                } else {
                    // 8. En la ruta para renombrar, devuelve un mensaje de éxito incluyendo el nombre
                    // anterior del archivo y su nuevo nombre de forma dinámica . (Opcional)
                    res.write(`Archivo ${nombre} fue renombrado por ${nuevoNombre}`)
                    res.end()
                }
            })
        }

        // 5. Disponibilizar una ruta para eliminar un archivo, cuyo nombre es declarado en los parámetros de la consulta recibida.
        if (req.url.includes('/eliminar')) {
            fs.unlink(nombre, (err, data) => {
                // 6. Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida.
                if (err) {
                    res.write('El archivo no existe')
                    res.end()
                } else {
                    res.write(`Tu solicitud para eliminar el archivo ${nombre} se está procesando \n\n`)
                    setTimeout(() => {
                        res.write('Elmininacion exitosa')
                        res.end()
                    }, 3000)
                } 
            })
        }
    })
    .listen(8080, () => console.log('Escuchando el puerto 8080'))