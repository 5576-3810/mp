import React, { useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';



function App() {
  const baseUrl="https://localhost:44362/api/gestores";
const [data, setData]=useState([]);
const [modalInsertar, setModalInsertar]=useState(false);
const [modalEditar, setModalEditar]=useState(false);
const [modalEliminar, setModalEliminar]=useState(false);
const [gestorseleccionado, setGestorSeleccionado]=useState({
id: '',
nombre: '',
numero: '',
descripcion: ''

})





const handleChange=e=>{
  const {name, value}=e.target;
  setGestorSeleccionado({
    ...gestorseleccionado,
    [name]:value
  });
  console.log(gestorseleccionado);
}


const abrirCerrarModalInsertar=()=>{
setModalInsertar(!modalInsertar);

}

const abrirCerrarModalEditar=()=>{
  setModalEditar(!modalEditar);
  
  }


  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
    
    }

const peticionGet=async()=>{
await axios.get(baseUrl)
.then(Response=>{
  setData(Response.data);
}).catch(error=>{
  console.log(error);
})
}

const peticionPost=async()=>{
  //delete gestorseleccionado.id;
  gestorseleccionado.id=parseInt(gestorseleccionado.id);
  gestorseleccionado.numero=parseInt(gestorseleccionado.numero);
  await axios.post(baseUrl, gestorseleccionado)
  .then(Response=>{
    setData(data.concat(Response.data));
    abrirCerrarModalInsertar();
  }).catch(error=>{
    console.log(error);
  })
  }


  const peticionPut=async()=>{
    gestorseleccionado.numero=parseInt(gestorseleccionado.numero)
    await axios.put(baseUrl+"/"+gestorseleccionado.id, gestorseleccionado)
    .then(Response=>{
      var respuesta=Response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(gestor=>{
          if (gestor.id===gestorseleccionado.id){
          gestor.nombre=respuesta.nombre;
          gestor.numero=respuesta.numero;
          gestor.descripcion=respuesta.descripcion;
          }
      })
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
    }

    const peticionDelete=async()=>{
      await axios.delete(baseUrl+"/"+gestorseleccionado.id)
      .then(Response=>{
        setData(data.filter(gestor=>gestor.id!==Response.data));
        abrirCerrarModalEliminar();
      }).catch(error=>{
        console.log(error);
      })
      }





  const seleccionarGestor=(gestor, caso)=>{
    setGestorSeleccionado(gestor);
    (caso === "Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

useEffect(()=>{
peticionGet();
},[])

  return (

    <body>
    <div className="App">

    <br/><br/><br/>
    <h2><center>Consulta de fiscalías de MP</center></h2>
    <br/>
    <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Igresar nueva fiscalía</button>
    <br/>
    <br/>
      <table  className="table table-bordered dt-responsive display">
        <thead>
        <tr>
          <th>No. fiscalía</th>
          <th>Nombre</th>
          <th>Número</th>
          <th>Descripción</th>
           <th>Acciones</th>
        </tr>
       </thead>
       <tbody>
        {data.map(gestor=>(
        <tr key={gestor.id}>
          <td>{gestor.id}</td>
          <td>{gestor.nombre}</td>
          <td>{gestor.numero}</td>
          <td>{gestor.descripcion}</td>

          <td>
            <button className='btn btn-primary' onClick={()=>seleccionarGestor(gestor, "Editar")}>Editar</button>{""}
            <button className='btn btn-danger' onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Eliminar</button>{""}
          </td>
          </tr>
        ))}
       </tbody>
      </table>

              <Modal isOpen={modalInsertar} >
                <ModalHeader>
                  Insertar datos
                </ModalHeader>
                <ModalBody>
                <div className="form-group">
                <label>No numero:</label>
                <br/>
                <input type="text" className="form-control" name="id" onChange={handleChange}/>  
                <label>Nombre:</label>
                <br/>
                <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
                <label>Número:</label>
                <br/>
                <input type="text" className="form-control" name="numero" onChange={handleChange}/>
                <label>Detalle:</label>
                <br/>
                <input type="text" className="form-control" name="descripcion" onChange={handleChange}/>
                </div>

                </ModalBody>
                <ModalFooter>
                <button className='btn btn-primary' onClick={()=>peticionPost()}>Insertar</button>{" "}
                <button className='btn btn-danger' onClick={abrirCerrarModalInsertar}>Cancelar</button>
                </ModalFooter>
              </Modal>


              <Modal isOpen={modalEditar} >
                <ModalHeader>
                  Editar datos
                </ModalHeader>
                <ModalBody>
                <div className="form-group">
                <label>ID:</label>
                <br/>
                <input type="text" className="form-control" name="id" value={gestorseleccionado && gestorseleccionado.id}/>  
                <br/>
                <label>Nombre:</label>
                <br/>
                <input type="text" className="form-control" name="nombre" onChange={handleChange} value={gestorseleccionado && gestorseleccionado.nombre}/>
                <label>fiscalía:</label>
                <br/>
                <input type="text" className="form-control" name="numero" onChange={handleChange} value={gestorseleccionado && gestorseleccionado.numero}/>
                <label>detalle:</label>
                <br/>
                <input type="text" className="form-control" name="descripcion" onChange={handleChange} value={gestorseleccionado && gestorseleccionado.descripcion}/>
                </div>

                </ModalBody>
                <ModalFooter>
                <button className='btn btn-primary' onClick={()=>peticionPut()}>Editar</button>{" "}
                <button className='btn btn-danger' onClick={abrirCerrarModalEditar}>Cancelar</button>
                </ModalFooter>
              </Modal>


              <Modal isOpen={modalEliminar} >
                <ModalHeader>
                  ¿Esta seguro de eliminaro? {gestorseleccionado && gestorseleccionado.nombre}?
                </ModalHeader>
                <ModalBody>
           
                </ModalBody>
                <ModalFooter>
                <button className='btn btn-danger' onClick={()=>peticionDelete()}>si</button>{" "}
                <button className='btn btn-primary' onClick={abrirCerrarModalEliminar}>no</button>
                </ModalFooter>
              </Modal>


    </div>
    </body>

    
  );
}

export default App;


