package main

import (
	"bytes"
	context "context"
	"encoding/base64"
	"encoding/json"
	pb "hello-world/rpc"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"

	"github.com/guregu/dynamo"

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

	server := grpc.NewServer(grpc.UnaryInterceptor(interceptor))
	pb.RegisterWidgetServiceServer(server, &widgetService{})
	reflection.Register(server)

	mux := http.NewServeMux()
	mux.Handle("/", grpcweb.WrapServer(
		server,
		grpcweb.WithOriginFunc(func(origin string) bool {
			return true
		}),
		grpcweb.WithAllowNonRootResource(true),
	))

	algnhsa.ListenAndServe(mux, &algnhsa.Options{
		RequestType:        algnhsa.RequestTypeAPIGateway,
		BinaryContentTypes: []string{"*/*"},
	})
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

func genDB() (*dynamo.DB, error) {
	config := aws.NewConfig()
	sess, err := session.NewSession(config)
	if err != nil {
		return nil, err
	}

	db := dynamo.New(sess, &aws.Config{Region: aws.String("ap-northeast-1")})

	return db, nil
}

func encodePagingKey(key dynamo.PagingKey) string {
	if key == nil {
		return ""
	}
	jsonStr, _ := json.Marshal(key)
	return base64.StdEncoding.EncodeToString(jsonStr)
}

func decodePagingKey(token string) dynamo.PagingKey {
	dec, _ := base64.StdEncoding.DecodeString(token)
	var currentKey dynamo.PagingKey
	_ = json.Unmarshal(dec, &currentKey)
	return currentKey
}

type widget struct {
	ID        string
	UserID    string
	Msg       string
	CreatedAt time.Time
}

const tableName = "aws-sam-grpc-sample-widgets"

type widgetService struct {
}

func (s *widgetService) List(ctx context.Context, req *pb.Cursor) (*pb.WidgetList, error) {
	db, err := genDB()
	if err != nil {
		return nil, err
	}

	table := db.Table(tableName)

	var widgets []*widget
	key, err := table.
		Get("UserID", "1").
		Index("UserID-CreatedAt-Index").
		Order(false).
		SearchLimit(2).
		StartFrom(decodePagingKey(req.NextCursor)).
		AllWithLastEvaluatedKey(&widgets)
	if err != nil {
		return nil, err
	}

	resItems := make([]*pb.Widget, 0, len(widgets))
	for _, widget := range widgets {
		resItems = append(resItems, &pb.Widget{
			Id:        widget.ID,
			UserId:    widget.UserID,
			Msg:       widget.Msg,
			CreatedAt: widget.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return &pb.WidgetList{
		Items:      resItems,
		NextCursor: encodePagingKey(key),
	}, nil
}

func (s *widgetService) Add(ctx context.Context, req *pb.AddRequest) (*pb.Widget, error) {
	db, err := genDB()
	if err != nil {
		return nil, err
	}

	table := db.Table(tableName)

	widget := &widget{
		ID:        uuid.New().String(),
		UserID:    req.UserId,
		Msg:       req.Msg,
		CreatedAt: time.Now(),
	}

	if err := table.Put(widget).Run(); err != nil {
		return nil, err
	}

	return &pb.Widget{
		Id:        widget.ID,
		UserId:    widget.UserID,
		Msg:       widget.Msg,
		CreatedAt: widget.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}
