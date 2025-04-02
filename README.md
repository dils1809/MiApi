# Mi API

Esta es una API simple creada con **Node.js**, **Express** y **SQLite**.

## Características


- **GET /**: Devuelve un mensaje de bienvenida.
- **POST /incidents**: Crea un nuevo incidente, recibiendo los datos en formato JSON.
- **GET /incidents**: Devuelve todos los incidentes registrados.
- **GET /incidents/{id}**: Obtiene un incidente específico por su ID.
- **PUT /incidents/{id}**: Actualiza el estado de un incidente específico.
- **DELETE /incidents/{id}**: Elimina un incidente específico.


## Requisitos

- Tener **Node.js** instalado en tu máquina.
- Tener **npm** para manejar dependencias.
- Tener **SQLite** para la base de datos.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/dils1809/MiApi.git


## Entra al directorio del proyecto
    cd MiApi

## Instala las dependencias
    npm install

## Inicia el servidor
    npm start


## ------------------- LINK DEL SERVIDOR ----------------
    http://localhost:3000/

## Uso 
    POST /incidents: Para crear un nuevo incidente, envía un JSON con los datos:
        {
            "reporter": "Juan Pérez",
            "description": "La computadora no enciende."
        }

    GET /incidents: Para obtener todos los incidentes.

    GET /incidents/{id}: Para obtener un incidente específico por ID.
    
    PUT /incidents/{id}: Para actualizar el estado de un incidente específico.
        {
    "status": "en proceso"
    }
    
    DELETE /incidents/{id}: Para eliminar un incidente específico.