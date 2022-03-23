import { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { useLocalStorage } from "react-use";
import QuotationTable from "./QuotationTable";

function Quotation() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dateRef = useRef();
  const itemRef = useRef();
  const priceRef = useRef();
  const qtyRef = useRef();

  const [localDataItems, setLocalDataItems, remove] = useLocalStorage(
    "data-items",
    JSON.stringify([])
  );

  const [dataItems, setDataItems] = useState(JSON.parse(localDataItems));

  const [quotations, setQuotations] = useState([]);
  const [quotationOptions, setQuotationOptions] = useState([]);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/quotations`)
      .then((res) => res.json())
      .then((data) => {
        data = data.filter((e) => "code" in e);

        console.log(data);
        const z = data.map((v) => (
          <option key={v._id} value={v._id}>
            {v.name}
          </option>
        ));
        setQuotations(data);
        setQuotationOptions(z);
      });
  }, []);

  const deleteQuotation = () => {
    let item = quotations.find((v) => itemRef.current.value === v._id);
    console.log("Item to be deleted", item);
    fetch(`${API_URL}/quotations`, {
      method: "DELETE",
      body: JSON.stringify({
        _id: item._id,
      }),
    })
      .then((res) => res.json)
      .then((data) => {
        console.log("Delete ", data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addItem = () => {
    let item = quotations.find((v) => itemRef.current.value === v._id);
    console.log(item);
    var itemObj = {
      _id: item._id,
      date: dateRef.current.value,
      code: item.code,
      name: item.name,
      price: priceRef.current.value,
      qty: qtyRef.current.value,
    };

    dataItems.push(itemObj);
    setDataItems([...dataItems]);
    setLocalDataItems(JSON.stringify(dataItems));
    console.log("after", dataItems);
  };

  const updateDataItems = (dataItems) => {
    setDataItems([...dataItems]);
    setLocalDataItems(JSON.stringify(dataItems));
  };

  const clearDataItems = () => {
    setDataItems([]);
    setLocalDataItems(JSON.stringify([]));
  };

  const quotationChange = () => {
    console.log("quotationChange", itemRef.current.value);
    let item = quotations.find((v) => itemRef.current.value === v._id);
    console.log("quotationChange", item);
    priceRef.current.value = item.price;
    console.log(priceRef.current.value);
  };  
  return (
    <Container>
      <Row>
        <Col md={4} style={{ backgroundColor: "orange" }}>
          <Row>
            <Col>
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="date"
                ref={dateRef}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              Item
              <Form.Select ref={itemRef} onChange={quotationChange}>
                {quotationOptions}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                ref={priceRef}
                value={price}
                onChange={(e) => setPrice(priceRef.current.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" ref={qtyRef} defaultValue={1} />
            </Col>
          </Row>
          <hr />
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={addItem}>
              Add
            </Button>
            <Button variant="success" onClick={deleteQuotation}>
              Save
            </Button>
          </div>
          {/* {JSON.stringify(dataItems)} */}
        </Col>
        <Col md={8}>
          <QuotationTable
            data={dataItems}
            clearDataItems={clearDataItems}
            updateDataItems={updateDataItems}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Quotation;