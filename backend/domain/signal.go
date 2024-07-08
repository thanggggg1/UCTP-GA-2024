package domain

type SignalType string

const (
	StatusSignal      SignalType = "status"
	DetailsSignal     SignalType = "details"
	OperationSignal   SignalType = "operation"
	DataSignal        SignalType = "data"
	ProgressBarSignal SignalType = "progressBar"
	ProgressSignal    SignalType = "progress"
)

type WSMessage struct {
	Type SignalType  `json:"type"`
	Data interface{} `json:"data"`
}
