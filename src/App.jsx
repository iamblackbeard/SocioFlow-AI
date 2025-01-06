import { useState, useEffect, useRef } from "react";
import { LangflowClient } from "./langflow/langflow";

const LangflowComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const responseRef = useRef(null);

  const handleSubmit = async () => {
    setInputValue("")
    const langflowClient = new LangflowClient(
      "/api",
      import.meta.env.VITE_LANGFLOW_TOKEN
    );
    console.log(import.meta.env.VITE_LANGFLOW_TOKEN);
    const tweaks = {
      // Your tweaks configuration here
    };

    try {
      const stream = false;
      setIsStreaming(stream);
      setIsLoading(true);
      const response = await langflowClient.runFlow(
        "5fb89765-f392-4542-9b28-9c81bd906c43", // Flow ID
        "d6ab1cff-4a30-44b6-b143-5bbd6077642f", // Langflow ID
        inputValue,
        "chat",
        "chat",
        tweaks,
        stream,
        (data) => console.log("Stream Update:", data), // onUpdate
        () => console.log("Stream Closed"), // onClose
        (error) => console.error("Stream Error:", error) // onError
      );

      if (!stream && response) {
        setResponse(response.outputs[0].outputs[0].artifacts.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (response) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response]);
  return (
    <div className="container">
    <div className="head">
    <h1>SocioFlow-AI: Social Media Analytics Tool</h1>
      <p>
        This is to analyze engagement data from mock social media accounts,
        leveraging LangFlow and DataStax Astra DB. The module will provide
        actionable insights into the performance of different types of social
        media posts (e.g., carousels, reels, and static images).
      </p>
    </div>
    

      {isLoading ? (
        <p className="loading">Fetching response...</p>
      ) : (
        response && (
          <p className="response" ref={responseRef}>
            Response: <br /> {response}
          </p>
        )
      )}
      {error && <p className="error">{error}</p>}
      <div className="input_fields">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your message here"
          rows="2"
        />
        <button onClick={handleSubmit} disabled={isStreaming}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default LangflowComponent;
