package compress

import (
	"bytes"
	"compress/gzip"
	"encoding/json"
	"io/ioutil"
)

// CompressData compresses raw data to reduce storage size.
func CompressData(data interface{}) ([]byte, error) {
	var buf bytes.Buffer
	gzipWriter := gzip.NewWriter(&buf)
	defer gzipWriter.Close()

	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	_, err = gzipWriter.Write(jsonData)
	if err != nil {
		return nil, err
	}

	err = gzipWriter.Close()
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// DecompressData decompresses gzip compressed data.
func DecompressData(data []byte) ([]byte, error) {
	reader, err := gzip.NewReader(bytes.NewReader(data))
	if err != nil {
		return nil, err
	}
	defer reader.Close()

	return ioutil.ReadAll(reader)
}
