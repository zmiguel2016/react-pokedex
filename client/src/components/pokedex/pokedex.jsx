import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Table, Form, Col } from "react-bootstrap";
import MyModal from "../modal/modal";
import "./pokedex.css";

// function MyModal(props) {
//   const [pokemons, setPokemon] = useState(null);
//   //console.log(props.pokemon);
//   const body = {
//     url: props.pokemon,
//   };

//   useEffect(() => {
//     if (body.url.length > 0) {
//       fetch("api/pokeinfo/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       })
//         .then((res) => res.json())
//         .then((pokemon) => setPokemon(pokemon));
//     }
//   }, [props]);
//   //if (pokemons != null) console.log(pokemons);
//   if (pokemons != null) {
//     let type;
//     if (pokemons.types[0].type.name === "grass") {
//       type = "success";
//     } else if (pokemons.types[0].type.name === "bug") {
//       type = "success";
//     } else if (pokemons.types[0].type.name === "fire") {
//       type = "danger";
//     } else if (pokemons.types[0].type.name === "water") {
//       type = "primary";
//     } else if (pokemons.types[0].type.name === "electric") {
//       type = "warning";
//     } else {
//       type = "info";
//     }
//     return (
//       <Modal
//         {...props}
//         size="lg"
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//           <img src={pokemons.sprites.front_default} alt=""></img>
//           <Modal.Title id="contained-modal-title-vcenter">
//             {pokemons.name}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Badge pill variant={type}>
//             {pokemons.types[0].type.name}
//           </Badge>
//           <h3>Stats</h3>
//           <div style={{ wordBreak: "break-all" }}>
//             <span>height: </span>
//             <span>{pokemons.height}</span>
//           </div>
//           <div style={{ wordBreak: "break-all" }}>
//             <span>weight: </span>
//             <span>{pokemons.weight}</span>
//           </div>
//           <div style={{ wordBreak: "break-all" }}>
//             <span>Base Power: </span>
//             <span>{pokemons.stats[0].base_stat}</span>
//           </div>
//           <div style={{ wordBreak: "break-all" }}>
//             <span>Base XP: </span>
//             <span>{pokemons.base_experience}</span>
//           </div>
//         </Modal.Body>
//       </Modal>
//     );
//   } else {
//     return (
//       <Modal
//         {...props}
//         size="lg"
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title id="contained-modal-title-vcenter">Loading</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h1>modal</h1>
//         </Modal.Body>
//       </Modal>
//     );
//   }
// }

function GrabData(page) {
  const [pokemons, setPokemon] = useState([]);
  const body = {
    page: page,
  };
  useEffect(() => {
    fetch("/api/pokemon/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((pokemon) => setPokemon(pokemon));
  }, [page]);
  return pokemons;
}

function AllData() {
  const [pokemons, setPokemon] = useState([]);

  useEffect(() => {
    fetch("/api/allpokemon/")
      .then((res) => res.json())
      .then((pokemon) => setPokemon(pokemon));
  }, []);
  return pokemons;
}

function Pokedex() {
  const [page, setPage] = useState(0);
  const [params, setParams] = useState("");
  const [modalShow, setModalShow] = useState(false); //modal state
  const [infoUrl, setInfoUrl] = useState("");
  const [reverse, setReverse] = useState(false);
  const [sorted, setSort] = useState(false);
  let data = GrabData(page);
  let allData = AllData().results;
  let pokemons;

  if (reverse === true) {
    pokemons = [...data.results].reverse();
  } else if (sorted === true) {
    pokemons = [...data.results].sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  } else {
    pokemons = data.results;
  }
  if (pokemons != null && params.length > 0) {
    pokemons = allData;
    pokemons = pokemons.filter(function (poke) {
      return poke.name.includes(params.toLowerCase());
    });
  }

  function handleClickNext() {
    let newPage = page + 20;
    setPage(newPage);
    // GrabData(page);
  }
  function handleClickPrev() {
    let newPage = page - 20;
    setPage(newPage);
  }

  function moreInfo(url) {
    setInfoUrl(url);
    setModalShow(true);
  }
  function onParamChange(e) {
    setParams(e.target.value);
  }
  function handleOrder() {
    setReverse(!reverse);
    setSort(false);
  }
  function handleAOrder() {
    setSort(!sorted);
  }

  if (pokemons != null) {
    return (
      <div className="pokeContainer">
        <Form className="mb-4">
          <Form.Row className="align-items-end">
            <Form.Group as={Col}>
              <Form.Control
                onChange={onParamChange}
                name="description"
                type="text"
                placeholder="Search Pokedex"
              />
            </Form.Group>
          </Form.Row>
        </Form>
        <Button
          className="mb-3"
          variant="success"
          hidden={!data.previous}
          onClick={handleClickPrev}
        >
          Prev
        </Button>
        <Button
          className="mb-3 addbtn"
          variant="success"
          hidden={!data.next}
          onClick={handleClickNext}
        >
          Next
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                # <span onClick={handleOrder}>&#8645;</span>
              </th>
              <th>
                Name <span onClick={handleAOrder}>&#8645;</span>
              </th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {pokemons.map((pokemon) => (
              <tr key={pokemon.url}>
                <td>
                  {pokemon.url
                    .replace("https://pokeapi.co/api/v2/pokemon/", "")
                    .replace("/", "")}
                </td>
                <td className="tableName">{pokemon.name}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => {
                      moreInfo(pokemon.url);
                    }}
                  >
                    Info
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <MyModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          pokemon={infoUrl}
        />
      </div>
    );
  } else return <h1>loading</h1>;
}

export default Pokedex;
