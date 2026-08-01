package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "modernc.org/sqlite"
)

func main() {

	//Initialise SQL DB
	db, err := sql.Open("sqlite", "/data/guestbook.db")
	if err != nil {
		log.Fatal(err)
	}

	//Initialize Guestbook Table if non existent
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS entries (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	message TEXT NOT NULL,
	date DATETIME NOT NULL,
	avatar TEXT NOT NULL DEFAULT 'phantom'
	)`)

	if err != nil {
		log.Fatal(err)
	}

	//Initialize Blog Comments Table if non existent
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS blog_comments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	post_slug TEXT NOT NULL,
	name TEXT NOT NULL,
	message TEXT NOT NULL,
	date DATETIME NOT NULL
	)`)

	if err != nil {
		log.Fatal(err)
	}

	// Initialize Poll Votes Table if non existent
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS poll_votes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	vote TEXT NOT NULL,
	ip TEXT NOT NULL,
	date DATETIME NOT NULL
	)`)

	if err != nil {
		log.Fatal(err)
	}

	database := Database{db: db}

	//Rate limit cleanup routine
	rateLimitCleanup(2*time.Hour, 1*time.Hour)

	//Initialise handlers
	http.HandleFunc("/api/guestbook", database.guestbookHandler)
	http.HandleFunc("/api/comments", database.commentsHandler)
	http.HandleFunc("/api/poll", database.pollHandler)

	//Listen and serve through http.Server in background
	server := &http.Server{
		Addr:    ":8080",
		Handler: corsMiddleware(http.DefaultServeMux),
	}
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("HTTP server error: %v", err)
		}
	}()

	// Listen for shutdown and wait
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	//After shutdown signal is received, wait 10 seconds and shut down
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server shutdown error: %v", err)
	}
}