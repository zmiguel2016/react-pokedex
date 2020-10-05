import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Badge } from "react-bootstrap";
import "./modal.css";

function MyModal(props) {
  const [pokemons, setPokemon] = useState(null);
  //console.log(props.pokemon);
  const body = {
    url: props.pokemon,
  };

  useEffect(() => {
    if (body.url.length > 0) {
      fetch("api/pokeinfo/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((pokemon) => setPokemon(pokemon));
    }
  }, [props]);

  if (pokemons != null) {
    let type;
    if (pokemons.types[0].type.name === "grass") {
      type = "success";
    } else if (pokemons.types[0].type.name === "bug") {
      type = "success";
    } else if (pokemons.types[0].type.name === "fire") {
      type = "danger";
    } else if (pokemons.types[0].type.name === "water") {
      type = "primary";
    } else if (pokemons.types[0].type.name === "electric") {
      type = "warning";
    } else {
      type = "info";
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="modalHeader">
          <img src={pokemons.sprites.front_default} alt=""></img>
          <Modal.Title className="modalTitle">{pokemons.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Badge pill variant={type} className="badgeType">
            {pokemons.types[0].type.name}
          </Badge>
          <h3>Stats</h3>
          <div style={{ wordBreak: "break-all" }}>
            <span>Height: </span>
            <span>{pokemons.height}"</span>
          </div>
          <div style={{ wordBreak: "break-all" }}>
            <span>Weight: </span>
            <span>{pokemons.weight}lb</span>
          </div>
          <div style={{ wordBreak: "break-all" }}>
            <span>Base Power: </span>
            <span>{pokemons.stats[0].base_stat}</span>
          </div>
          <div style={{ wordBreak: "break-all" }}>
            <span>Base XP: </span>
            <span>{pokemons.base_experience}</span>
          </div>
        </Modal.Body>
      </Modal>
    );
  } else {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Loading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>...</h1>
        </Modal.Body>
      </Modal>
    );
  }
}

export default MyModal;
