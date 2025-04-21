# Mi API

Esta es una API simple creada con Node.js, Express y SQLite. Incluye un frontend estático y está dockerizada para facilitar su despliegue.

## Características

- **GET /**: Devuelve un mensaje de bienvenida.
- **POST /incidents**: Crea un nuevo incidente, recibiendo los datos en formato JSON.
- **GET /incidents**: Devuelve todos los incidentes registrados.
- **GET /incidents/{id}**: Obtiene un incidente específico por su ID.
- **PUT /incidents/{id}**: Actualiza el estado de un incidente específico.
- **DELETE /incidents/{id}**: Elimina un incidente específico.
- Frontend incluido (HTML/CSS) accesible desde la raíz `/`.

## Requisitos

### Para correr sin Docker:
- Tener Node.js instalado
- Tener npm para manejar dependencias
- Tener SQLite instalado

### Para correr con Docker:
- Tener Docker y Docker Compose instalados

---

## Instalación

### Sin Docker:

```bash
# Clona este repositorio
git clone https://github.com/dils1809/MiApi.git
cd MiApi

# Instala dependencias
npm install

# Inicia el servidor
npm start

# Abre en el navegador
http://localhost:3000


--------


# Con docker
    ## Construye y levanta el contenedor
    docker-compose up --build

# Abre en el navegador
http://localhost:3000
