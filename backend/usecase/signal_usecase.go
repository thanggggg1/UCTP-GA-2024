package usecase

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// WsHandler handles WebSocket connections.
func WsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
		return
	}

	// Initialize the genetic algorithm with the WebSocket connection.

	// Log to verify WebSocket connection is set
	log.Println("WebSocket connection established")

	// Run the genetic algorithm in a separate goroutine

	// Listen for messages from the WebSocket connection
	defer conn.Close()
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}
		log.Println("Received message:", string(msg))
	}
}
