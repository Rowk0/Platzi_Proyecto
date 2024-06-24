//Exportamos expres.js para usarlo
const express = require("express")

const cors = require("cors")

//creamos aplicacion con express.js
const app = express()

//usar archivo estatico (html, js, etc)
app.use(express.static("public"))

//prevenir posibles errores relacionados con cors
app.use(cors())

//habilitar json en POST
app.use(express.json())

//lista jugadores
const jugadores = []

class Jugador {
    constructor(id) {
        this.id = id
    }

    asignarMokepon(mokepon) {
        this.mokepon = mokepon
    }

    actualizarPosicion(x, y) {
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques) {
        this.ataques = ataques
    }
}

class Mokepon {
    constructor(nombre) {
        this.nombre = nombre
    }
}

//le decimos a express.js que cuando en la url raiz reciba una peticion, responda hola
app.get("/unirse", (req, res) => {
    //darle id aleatorio
    const id = `${Math.random()}`

    //crear jugador
    const jugador = new Jugador(id)

    //introducir al jugador en la lista
    jugadores.push(jugador)

    //permitimos que la otra pagina es segura
    // * = cualquier origen es valido
    res.setHeader("Access-Control-Allow-Origin", "*")

    res.send(id)
})


app.post("/mokepon/:jugadorId", (req, res) => {
    //acceder a la variable /:jugadorId
    const jugadorId = req.params.jugadorId || ""

    //extrayendo body del json
    const nombre = req.body.mokepon || ""

    const mokepon = new Mokepon(nombre)
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    //jugador en la lista
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarMokepon(mokepon)
    }

    console.log(jugadores)
    console.log(jugadorId)
    res.end()
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

    //filtrar jugadores
    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

    res.send({
        enemigos
    })
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

//que escuche continuamente en el puerto 8080 las peticiones de los clientes
app.listen(8080, () => {
    console.log("servidor funcionando")
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
    
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end()
})

//para activar servidor: poner (cd OneDrive) luego (cd Escritorio) como pone arriba
//en el terminal, y cuando llegues a mokepon pones (node index.js)

//mi direccion ip: 192.168.1.97 (wi-fi)