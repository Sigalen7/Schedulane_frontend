export const connectItineraryWebSocket = (onUpdate, initialData) => {
  const ws = new WebSocket("ws://127.0.0.1:9000/ws/itinerary");

  ws.onopen = () => {
    console.log("Connected to itinerary WebSocket");
    // Send initial itinerary data to backend
    ws.send(JSON.stringify(initialData));
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onUpdate(message); 
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  return ws;
};
