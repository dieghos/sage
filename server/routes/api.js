var express = require('express');
var router = express.Router();

/**
* Importa los controladores
*/
var file_controller = require('../controllers/fileController');
var upload_controller = require('../controllers/uploadController');
var authentication_controller = require('../controllers/authenticationController');
var user_controller = require('../controllers/userController');

//Creacion del administrador.
authentication_controller.create_admin();

/*******************************************************************************
************************** RUTAS DE AUTENTICACION*******************************
*******************************************************************************/

/**
* Autentica un usuario y devuelve un token para utilizar el sistema.
* @param {{ string }} username - Nombre de usuario
* @param {{ string }} password -Contraseña
* @returns {{ string }} Token valido por 2 horas
*/
router.post('/login',authentication_controller.login);

/*=============================================================================
* Verifica si posee un token para utilizar las rutas que estan a continuación.
*=============================================================================*/
router.use('/', authentication_controller.verify);

/**
* Registra un usuario para utilizar el sistema
* @param {{string}} username - Nombre del usuario
* @param {{string}} password - Contraseña
*/
router.post('/register', authentication_controller.register);

/*******************************************************************************
************************** RUTAS DE SUBIDA DE ARCHIVOS**************************
*******************************************************************************/

/**
* Sube un archivo al servidor
*/
router.post('/file', upload_controller.upload_file);

/**
* Borra un archivo del servidor
*/
router.post('/file/delete',upload_controller.delete_file);


/*******************************************************************************
****************************** RUTAS DE EXPEDIENTES*****************************
*******************************************************************************/

/**
* Devuelve los expedientes que se encuentren en el servidor de forma paginada.
* @param {{ string }} limit - cantidad de expedientes a devolver.
* @param {{ string }} page - numero de pagina a devolver
* @param {{ string }} query - filtro (por numero, descripcion o etx)
* @returns files,count
*/
router.get('/files', file_controller.file_list);

/**
* Devuelve el detalle de un expediente.
*/
router.get('/files/:_id', file_controller.file_detail);

/**
*  Crea expedientes en la base de datos.
* @param {{ files[] }} files - array de objetos.
*/
router.post('/files', file_controller.file_create);

/**
* Actualiza los datos de un expediente.
*/
router.put('/files/:_id', file_controller.file_update);

/**
* Borra un expediente.
*/
router.delete('/files/:_id', file_controller.file_delete);

/*******************************************************************************
****************************** RUTAS DE USUARIOS********************************
*******************************************************************************/

router.get('/users', user_controller.users_list);

router.get('/users/:_id', user_controller.user_detail);

router.put('/users/:_id', user_controller.update_user);

module.exports = router;
