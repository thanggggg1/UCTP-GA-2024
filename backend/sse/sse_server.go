package sse

import (
	"github.com/r3labs/sse/v2"
	"log"
	"net/http"
)

var sseServer *sse.Server

func init() {
	sseServer = sse.New()
	sseServer.CreateStream("messages")
}

func SendSSEMessage(event string, data []byte) {
	formattedData := append(data, []byte("\n\n")...) // Add the required newlines
	sseServer.Publish("messages", &sse.Event{
		Event: []byte(event),
		Data:  formattedData,
	})
	log.Printf("Message sent: %s", data)
}

func SSEHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Content-Encoding", "none")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	sseServer.ServeHTTP(w, r)
}

func ClearStream() {
	sseServer.RemoveStream("messages")
	sseServer.CreateStream("messages")
	log.Println("Stream 'messages' cleared")
}
