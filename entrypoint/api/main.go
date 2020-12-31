package main

import (
	"bytes"
	context "context"
	"fmt"
	pb "hello-world/proto/go"
	"log"
	"net"
	"os"
	"strconv"

	"github.com/improbable-eng/grpc-web/go/grpcweb"

	"github.com/akrylysov/algnhsa"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
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

	interceptor := func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler) (resp interface{}, err error) {
		res, err := handler(ctx, req)
		if err != nil {

		}
		return res, err
	}

	grpcServer := grpc.NewServer(grpc.UnaryInterceptor(interceptor))
	pb.RegisterHelloServer(grpcServer, &hello{})
	reflection.Register(grpcServer)
	grpcWebServer := grpcweb.WrapServer(
		grpcServer,
		grpcweb.WithOriginFunc(func(origin string) bool {
			return true
		}),
		grpcweb.WithAllowNonRootResource(true),
	)

	isLocal, _ := strconv.ParseBool(os.Getenv("LOCAL"))

	if isLocal {
		port := "3000"
		log.Printf("listening grpc on port %s", port)
		li, err := net.Listen("tcp", ":"+port)
		if err != nil {
			log.Fatalf("failed to open grpc listener: %+v", err)
		}
		log.Printf("failed to serve grpc: %+v", grpcServer.Serve(li))
	} else {
		algnhsa.ListenAndServe(grpcWebServer, &algnhsa.Options{
			RequestType:        algnhsa.RequestTypeAPIGateway,
			BinaryContentTypes: []string{"*/*"},
		})
	}

	log.Println("unexpected end of process")
	os.Exit(1)
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

type hello struct {
}

func (s *hello) World(ctx context.Context, req *pb.Empty) (*pb.HelloWorld, error) {
	msg := fmt.Sprintf("hello cicd, %s", os.Getenv("MESSAGE"))

	return &pb.HelloWorld{
		Msg: msg,
	}, nil
}
