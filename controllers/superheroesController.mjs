import { obtenerSuperheroesPorId,obtenerTodosLosSuperheroes, obtenerSuperheroesPorAtributo,
  obtenerSuperheroesMayoresDe30, crearSuperheroe, actualizarSuperheroe, borrarSuperheroePorId, borrarSuperheroePorNombre } from "../services/superheroService.mjs";
import { renderizarSuperheroe, renderizarListaSuperheroes } from "../views/responseView.mjs";


export async function  obtenerSuperheroePorIdController(req, res) {
 try{ 
     const {id}=req.params;
     const superheroe =await obtenerSuperheroesPorId(id);
     if (!superheroe)
         return res.status(404).send ({mensaje:'Superheroe no encontrado'});
     const superheroeFormateado=renderizarSuperheroe(superheroe)
     res.status(200).json(superheroeFormateado);

 } catch (error){
     res.status(500).send ({mensaje: 'Error al obtener el superheroe', error:error.message})
 }
 
}


export async function  obtenerTodosLosSuperheroesController(req, res) {
 try{ 
     const superheroes =await obtenerTodosLosSuperheroes();
    res.render('dashboard', { superheroes });
 } catch (error){
     res.status(500).send ({mensaje: 'Error al obtener los superheroes', error:error.message})
 }
 
}


export async function  obtenerSuperheroesPorAtributoController(req, res) {
 try{ 
     const {atributo, valor}=req.params;
     const superheroes =await obtenerSuperheroesPorAtributo(atributo, valor);
     if (superheroes.length===0)
         return res.status(404).send ({mensaje:'No se encontraron superheroes con ese atributo'});
     const superheroesFormateados=renderizarListaSuperheroes(superheroes)
     res.status(200).json(superheroesFormateados);

 } catch (error){
     res.status(500).send ({mensaje: 'Error al buscar los superheroes', error:error.messaje})
 }
 
}

export async function  obtenerSuperheroesMayoresDe30Controller(req, res) {
 try{ 
    
     const superheroes =await obtenerSuperheroesMayoresDe30();
     if (superheroes.length===0)
         return res.status(404).send ({mensaje:'No se encontraron superheroes mayores de 30 años'});
     const superheroesFormateados=renderizarListaSuperheroes(superheroes)
     res.status(200).json(superheroesFormateados);

 } catch (error){
     res.status(500).send ({mensaje: 'Error al obtener los superheroes mayores de 30', error:error.messaje})
 }
 
}


export async function crearSuperheroeController(req, res) {
 try {
     // Convertir campos separados por coma en arrays
     const datosSuperheroe = {
         ...req.body,
         poderes: req.body.poderes?.split(',').map(p => p.trim()).filter(p => p !== ''),
         debilidad: req.body.debilidad?.split(',').map(d => d.trim()).filter(d => d !== ''),
         aliados: req.body.aliados?.split(',').map(a => a.trim()).filter(a => a !== ''),
         enemigos: req.body.enemigos?.split(',').map(e => e.trim()).filter(e => e !== ''),
         creador: req.body.creador?.split(',').map(c => c.trim()).filter(c => c !== '')
     };

     // Validación básica
     if (!datosSuperheroe.nombreSuperHeroe || !datosSuperheroe.nombreReal) {
         return res.status(400).send({ mensaje: "El nombre del superhéroe y el nombre real son obligatorios" });
     }

     const nuevoSuperheroe = await crearSuperheroe(datosSuperheroe);
    res.redirect ('/api/dashboard');
   
 } catch (error) {
     res.status(500).send({ mensaje: "Error al crear el superhéroe", error: error.message });
 }
}



export async function actualizarSuperheroeController(req, res) {
 try {
 const {id}= req.params;
 const nuevosDatos= req.body;
 const superheroeActualizado = await actualizarSuperheroe(id,nuevosDatos);
res.redirect('http://localhost:3000/api/dashboard');

 } catch (error) {
     res.status(500).send({mensaje:'Superheroe con ID incorrecto o inexistente'}); 
 }
}


export async function borrarSuperheroePorNombreController(req, res) {
 const { nombreSuperHeroe } = req.params; // Nombre del superhéroe que se quiere borrar

 try {
     const superheroeBorrado = await borrarSuperheroePorNombre(nombreSuperHeroe);

     if (!superheroeBorrado) {
         return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
     }

     // Devolver el superhéroe borrado
     res.status(200).json(superheroeBorrado);
 } catch (error) {
     res.status(500).send({ mensaje: 'Error al borrar el superhéroe', error: error.message });
 }


}

export async function borrarSuperheroeIdController(req, res) {
 const { id } = req.params; //id a borrar

 try {
     const superheroeBorrado = await borrarSuperheroePorId(id);

     if (!superheroeBorrado) {
         return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
     }

     // Devolver el superhéroe borrado
     res.redirect ('http://localhost:3000/api/heroes')
 } catch (error) {
     res.status(500).send({ mensaje: 'Error al borrar el superhéroe', error: error.message });
 }

 
}

export const modificarSuperheroeFormularioController = async ( req, res ) => {
 try {
     const { id } = req.params;
     const superheroeaEditar = await obtenerSuperheroesPorId( id );
     
     res.render('editSuperhero', { superheroeaEditar });
 } catch (error) {
     res.status(500).send({
         mensaje: `Error al cargar formulario`,
         error: error.mensaje
     });
 }
}