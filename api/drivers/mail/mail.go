package mail

import (
	"context"
	"os"

	"github.com/resend/resend-go/v2"
)

type client struct {
	resend *resend.Client
}

type Client interface {
	Send(ctx context.Context, from string, to []string, subject string, html string) error
}

func NewClient() Client {
	apiKey := os.Getenv("RESEND_API_KEY")
	return &client{resend: resend.NewClient(apiKey)}
}

func (c *client) Send(ctx context.Context, from string, to []string, subject string, html string) error {
	params := &resend.SendEmailRequest{
		From:    from,
		To:      to,
		Subject: subject,
		Html:    html,
	}

	_, err := c.resend.Emails.SendWithContext(ctx, params)
	return err
}
