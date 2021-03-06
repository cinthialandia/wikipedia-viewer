import React, { useState, useCallback } from "react";
import { debounce } from "debounce";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import "./App.scss";

interface Result {
  title: string;
  pageid: number;
  snippet: string;
}

interface Results {
  query: {
    searchinfo: {
      totalhits: number;
    };
    search: Result[];
  };
}

function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const wikiApi = useCallback(
    debounce(async (keyword: string) => {
      if (keyword === "") {
        setResults([]);
        setLoading(false);
        return;
      }
      const baseURL =
        "https://en.wikipedia.org//w/api.php?origin=*&action=query&format=json&list=search&utf8=1&srsearch=";
      let response = await fetch(`${baseURL}${keyword}`);
      let results = (await response.json()) as Results;
      let arrResults = results.query.search;

      setResults(arrResults);
      setLoading(false);
    }, 700),
    [setLoading, setResults]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    wikiApi(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Wikipedia Viewer
          <span aria-label="world" role="img">
            🌎
          </span>
        </h1>
        <div className="random-link">
          <a
            href="https://en.wikipedia.org/wiki/Special:Random"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to read a random article
          </a>
        </div>
        <Form className="form-input">
          <Form.Control
            className="input"
            autoComplete="off"
            type="text"
            placeholder="Search"
            onChange={handleChange}
          />
        </Form>
      </header>
      <div className="container-result">
        {loading ? (
          <Spinner
            className="loading"
            animation="border"
            style={{ color: "#3d2645" }}
          />
        ) : (
          results.map(({ title, snippet, pageid }) => (
            <Card key={pageid} className="result">
              <div key={pageid}>
                <a
                  href={`https://en.wikipedia.org/?curid=${pageid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card.Title className="title-result">{title}</Card.Title>
                  <Card.Text
                    className="info-result"
                    dangerouslySetInnerHTML={{ __html: snippet }}
                  ></Card.Text>
                </a>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
