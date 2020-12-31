package main

import (
	"bytes"
	"context"
	"flag"
	"fmt"
	"os"
	"strconv"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/joho/godotenv"
)

func main() {
	env, err := readSSM(os.Getenv("SSM_PATH"))
	if err != nil {
		panic(err)
	}
	envMap, err := godotenv.Parse(bytes.NewBufferString(env))
	if err != nil {
		panic(err)
	}
	for k, v := range envMap {
		if err := os.Setenv(k, v); err != nil {
			panic(err)
		}
	}

	run := func(ctx context.Context, params *params) {
		rawTaskName := params.Args[0]
		fmt.Printf("hello cicd, %s, %s", os.Getenv("MESSAGE"), rawTaskName)
	}

	isLocal, _ := strconv.ParseBool(os.Getenv("LOCAL"))

	if isLocal {
		flag.Parse()
		args := flag.Args()

		taskName := args[0]

		params := &params{
			Args: []string{
				taskName,
			},
		}

		ctx := context.Background()
		run(ctx, params)
	} else {
		lambda.Start(run)
	}
}

func readSSM(path string) (string, error) {
	config := aws.NewConfig()
	sess, err := session.NewSession(config)
	if err != nil {
		return "", err
	}

	svc := ssm.New(sess, &aws.Config{
		Region: aws.String("ap-northeast-1"),
	})

	res, _ := svc.GetParameter(&ssm.GetParameterInput{
		Name:           aws.String(path),
		WithDecryption: aws.Bool(true),
	})

	val := *res.Parameter.Value

	return val, nil
}

type params struct {
	Args []string `json:"args"`
}
