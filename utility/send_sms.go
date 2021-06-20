package utility

import (
	"encoding/json"
	"errors"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Global Errors for Debugging
var (
	errText error = errors.New("error sending SMS message")
	errLoad error = errors.New("error loading dotenv file")
)

// SendSMS func -- POST API call that sends an SMS via twilio
func SendSMS() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(errLoad)
	}

	accountSid := os.Getenv("TWILIO_SID")
	authToken := os.Getenv("TWILIO_TOKEN")
	urlStr := "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json"

	msg := os.Getenv("MSG")

	quotes := [1]string{msg}

	rand.Seed(time.Now().Unix())

	msgData := url.Values{}

	msgData.Set("To", os.Getenv("TEST"))
	msgData.Set("From", os.Getenv("TWILIO_NUMBER"))
	msgData.Set("Body", quotes[0])
	msgDataReader := *strings.NewReader(msgData.Encode())

	client := &http.Client{}
	req, _ := http.NewRequest("POST", urlStr, &msgDataReader)
	req.SetBasicAuth(accountSid, authToken)
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, _ := client.Do(req)

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		var data map[string]interface{}
		decoder := json.NewDecoder(resp.Body)
		err := decoder.Decode(&data)
		if err != nil {
			log.Fatal(errText)
		}
	}
}
