import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  Form,
  Container,
  Table,
  Button,
  Modal,
} from "react-bootstrap";
import { FaTrashAlt, FaPencilAlt, FaPlus } from "react-icons/fa";
import style from "../mystyle.module.css";

export default function QuotationManagement() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [quotations, setQuotations] = useState([]);
  const [quotationRows, setQuotationRows] = useState([]);
  const [show, setShow] = useState(false);
  const [modeAdd, setModeAdd] = useState(false);
  const [quotation, setQuotation] = useState({
    date: Date(),
    code: "",
    name: "",
    price: 0,
  });

  // Input references
  const refDate = useRef();
  const refCode = useRef();
  const refName = useRef();
  const refPrice = useRef();

  useEffect(() => {
    fetch(`${API_URL}/quotations`)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.map((e, i) => {
          return (
            <tr key={i}>
              <td>
                {/* <FaPencilAlt
                  onClick={() => {
                    handleUpdate(e);
                  }}
                /> */}
                &nbsp;
                <FaTrashAlt
                  onClick={() => {
                    handleDelete(e);
                  }}
                />
              </td>
              <td>{e.date}</td>
              <td>{e.code}</td>
              <td>{e.name}</td>
              <td>{e.price}</td>
            </tr>
          );
        });

        setQuotations(data);
        setQuotationRows(rows);
      });
  }, []);

  const handleClose = () => {
    setModeAdd(false);
    setShow(false);
  };

  const handleDelete = (quotation) => {
    console.log(quotation);
    if (window.confirm(`Are you sure to delete [${quotation.name}]?`)) {
      fetch(`${API_URL}/quotations/${quotation._id}`, {
        method: "DELETE",
        mode: "cors",
      })
        .then((res) => res.json())
        .then((json) => {
          // Successfully deleted
          console.log("DELETE Result", json);
          for (let i = 0; i < quotations.length; i++) {
            if (quotations[i]._id === quotation._id) {
              quotations.splice(i,1);
              break;
            }
          }

          const rows = quotations.map((e, i) => {
            return (
              <tr key={i}>
                <td>
                  {/* <FaPencilAlt
                    onClick={() => {
                      handleUpdate(e);
                    }}
                  /> */}
                  &nbsp;
                  <FaTrashAlt
                    onClick={() => {
                      handleDelete(e);
                    }}
                  />
                </td>
                <td>{e.date}</td>
                <td>{e.code}</td>
                <td>{e.name}</td>
                <td>{e.price}</td>
              </tr>
            );
          });
  
          setQuotations(quotations);
          setQuotationRows(rows);     
          handleClose();
        });
    }
  };

  const handleShow = () => setShow(true);

  // const handleUpdate = (quotation) => {
  //   console.log("Update Quotation", quotation);
  //   console.log(refCode);
  //   refCode.current = quotation.code;

  //   setShow(true);
  //   setQuotation(quotation);
  // };

  const handleShowAdd = () => {
    setModeAdd(true);
    setShow(true);
  };

  const handleFormAction = () => {
    if (modeAdd) {
      // Add new quotation
      const newQuotation = {
        date: refDate.current.value,
        code: refCode.current.value,
        name: refName.current.value,
        price: refPrice.current.value,
      };
      console.log(newQuotation);

      fetch(`${API_URL}/quotations`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(newQuotation), // body data type must match "Content-Type" header
      })
        .then((res) => res.json())
        .then((json) => {
          // Successfully added the quotation
          console.log("POST Result", json);
          quotations.push(json)
          const rows = quotations.map((e, i) => {
            return (
              <tr key={i}>
                <td>
                  {/* <FaPencilAlt
                    onClick={() => {
                      handleUpdate(e);
                    }}
                  /> */}
                  &nbsp;
                  <FaTrashAlt
                    onClick={() => {
                      handleDelete(e);
                    }}
                  />
                </td>
                <td>{e.date}</td>
                <td>{e.code}</td>
                <td>{e.name}</td>
                <td>{e.price}</td>
              </tr>
            );
          });
  
          setQuotations(quotations);
          setQuotationRows(rows);          
          handleClose();
        });
    } else {
      // Update quotation
      const updatedQuotation = {
        _id: quotation._id,
        date: refDate.current.value,
        code: refCode.current.value,
        name: refName.current.value,
        price: refPrice.current.value,
      };
      console.log(updatedQuotation);

      fetch(`${API_URL}/quotations`, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(updatedQuotation), // body data type must match "Content-Type" header
      })
        .then((res) => res.json())
        .then((json) => {
          // Successfully updated the quotation
          console.log("PUT Result", json);
          for(let i=0; i<quotations.length; i++) {
            if (quotations[i]._id === updatedQuotation._id) {
              console.log(quotations[i],updatedQuotation)
              quotations[i] = updatedQuotation;
              break;
            }
          }

          const rows = quotations.map((e, i) => {
            return (
              <tr key={i}>
                <td>
                  {/* <FaPencilAlt
                    onClick={() => {
                      handleUpdate(e);
                    }}
                  /> */}
                  &nbsp;
                  <FaTrashAlt
                    onClick={() => {
                      handleDelete(e);
                    }}
                  />
                </td>
                <td>{e.date}</td>
                <td>{e.code}</td>
                <td>{e.name}</td>
                <td>{e.price}</td>
              </tr>
            );
          });
  
          setQuotations(quotations);
          setQuotationRows(rows);     
          handleClose();
        });
    }
  };

  return (
    <>
      <Container>
        <h1>Quotation Management</h1>
        {/* API_URL: {API_URL} */}
        <Button variant="outline-dark" onClick={handleShowAdd}>
          <FaPlus /> Add
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>&nbsp;</th>
              <th className={style.textLeft}>Date</th>
              <th className={style.textLeft}>Code</th>
              <th className={style.textLeft}>Name</th>
              <th className={style.textLeft}>Price/Unit</th>
            </tr>
          </thead>
          <tbody>{quotationRows}</tbody>
        </Table>
      </Container>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modeAdd ? "Add New Quotation" : "Update Quotation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>Date</Col>
              <Col>
                <input type="text" ref={refDate} defaultValue={quotation.date} />
              </Col>
            </Row>
            <Row>
              <Col>Code</Col>
              <Col>
                <input type="text" ref={refCode} defaultValue={quotation.code} />
              </Col>
            </Row>
            <Row>
              <Col>Name</Col>
              <Col>
                <input type="text" ref={refName} defaultValue={quotation.name} />
              </Col>
            </Row>
            <Row>
              <Col>Price</Col>
              <Col>
                <input
                  type="number"
                  ref={refPrice}
                  defaultValue={quotation.price}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormAction}>
            {modeAdd ? "Add" : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
