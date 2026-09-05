package mail

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

const resendEndpoint = "https://api.resend.com/emails"

type Client interface {
	SendMail(to string, subject string, body string) error
}

type client struct {
	apiKey      string
	fromAddress string
	httpClient  *http.Client
}

// NewMailClient - Resend経由でメールを送信するmail.Clientを生成する
func NewMailClient() client {
	return client{
		apiKey:      os.Getenv("RESEND_API_KEY"),
		fromAddress: os.Getenv("MAIL_FROM_ADDRESS"),
		httpClient:  &http.Client{Timeout: 10 * time.Second},
	}
}

type sendEmailRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	Text    string   `json:"text"`
}

// SendMail - Resend APIを叩いてメールを送信する
// RESEND_API_KEYが未設定の場合は送信を行わず、内容をコンソールに出力する
func (c client) SendMail(to string, subject string, body string) error {
	if c.apiKey == "" {
		fmt.Println("[mail] RESEND_API_KEY未設定のため送信をスキップし、内容をコンソールに出力します")
		fmt.Printf("To: %s\nSubject: %s\n\n%s\n", to, subject, body)
		return nil
	}

	reqBody, err := json.Marshal(sendEmailRequest{
		From:    c.fromAddress,
		To:      []string{to},
		Subject: subject,
		Text:    body,
	})
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, resendEndpoint, bytes.NewReader(reqBody))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("resend api error: status=%d body=%s", resp.StatusCode, string(respBody))
	}

	return nil
}
