import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Table, Form, Col } from "react-bootstrap";
import MyModal from "../modal/modal";
import "./pokedex.css";

//fetches data from server, returns an array of 20 pokemon
function GrabData(page) {
  const [pokemons, setPokemon] = useState([]); //pokemon state variable
  const body = {
    page: page, // page variable
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

//fetches data from sever, returns an array of all pokemon
function AllData() {
  const [pokemons, setPokemon] = useState([]); //pokemon state variable

  useEffect(() => {
    fetch("/api/allpokemon/")
      .then((res) => res.json())
      .then((pokemon) => setPokemon(pokemon));
  }, []);
  return pokemons;
}

//main function
function Pokedex() {
  const [page, setPage] = useState(0); //page state
  const [params, setParams] = useState(""); //serach params state
  const [modalShow, setModalShow] = useState(false); //modal state
  const [infoUrl, setInfoUrl] = useState(""); //pokemon url state (for retriving certain pokemons infromation function)
  const [reverse, setReverse] = useState(false); //reverse order state
  const [sorted, setSort] = useState(false); //alphabetical order state

  let data = GrabData(page); //1 page worth of data  20 pokemon
  let allData = AllData().results; //full pokemon list
  let pokemons; //array object contain all pokemon displayed in curtain table

  if (reverse === true) {
    pokemons = [...data.results].reverse(); //reverses order of list by number
  } else if (sorted === true) {
    pokemons = [...data.results].sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    }); //sorts alphabecital (only a-z not z-a)
  } else {
    pokemons = data.results; //normal order
  }

  //search function
  if (pokemons != null && params.length > 0) {
    pokemons = allData;
    pokemons = pokemons.filter(function (poke) {
      return poke.name.includes(params.toLowerCase()); //filters pokemon to ones that contain the letters in the params
    });
  }

  function handleClickNext() {
    //next page
    let newPage = page + 20;
    setPage(newPage);
  }
  function handleClickPrev() {
    //prev page
    let newPage = page - 20;
    setPage(newPage);
  }

  function moreInfo(url) {
    //opens modal of pokemon with more info
    setInfoUrl(url);
    setModalShow(true);
  }
  function onParamChange(e) {
    //handles search params
    setParams(e.target.value);
  }

  function handleOrder() {
    //changes ordered by number
    setReverse(!reverse);
    setSort(false);
  }
  function handleAOrder() {
    //changes order alphabetically
    setSort(!sorted);
  }

  if (pokemons != null) {
    //if pokemons array has values
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
          hidden={!data.previous} //hidden if there is no prev page
          onClick={handleClickPrev}
        >
          Prev
        </Button>
        <Button
          className="mb-3 addbtn"
          variant="success"
          hidden={!data.next} //hidden if there is no next page
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
  } else return <h1>loading</h1>; //stil awaiting promise
}

export default Pokedex;
