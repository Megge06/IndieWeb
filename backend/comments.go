package main

import (
	"encoding/json"
	"net/http"
	"time"
)

type BlogComment struct {
	ID       int       `json:"id"`
	PostSlug string    `json:"post_slug"`
	Name     string    `json:"name"`
	Message  string    `json:"message"`
	Date     time.Time `json:"date"`
}

type UserBlogComment struct {
	PostSlug string `json:"post_slug"`
	Name     string `json:"name"`
	Message  string `json:"message"`
}

// Handles GET/POST requests for blog comments
func (d *Database) commentsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case http.MethodGet:
		postSlug := r.URL.Query().Get("post")
		if postSlug == "" {
			http.Error(w, "missing post slug", http.StatusBadRequest)
			return
		}

		rows, err := d.db.Query("SELECT id, post_slug, name, message, date FROM blog_comments WHERE post_slug = ? ORDER BY date ASC", postSlug)
		if err != nil {
			http.Error(w, "database error", http.StatusInternalServerError)
			return
		}
		defer func() { _ = rows.Close() }()

		comments := []BlogComment{}
		for rows.Next() {
			var c BlogComment
			err := rows.Scan(&c.ID, &c.PostSlug, &c.Name, &c.Message, &c.Date)
			if err != nil {
				http.Error(w, "scan error", http.StatusInternalServerError)
				return
			}
			comments = append(comments, c)
		}
		_ = json.NewEncoder(w).Encode(comments)
	case http.MethodPost:
		if !allowRateLimit(rateLimitKey(r)) {
			http.Error(w, "rate limited", http.StatusTooManyRequests)
			return
		}

		var uc UserBlogComment
		err := json.NewDecoder(r.Body).Decode(&uc)
		if err != nil {
			http.Error(w, "decoding error", http.StatusBadRequest)
			return
		}

		if uc.PostSlug == "" || uc.Name == "" || uc.Message == "" {
			http.Error(w, "input error", http.StatusBadRequest)
			return
		}

		if len(uc.PostSlug) > 100 || len(uc.Name) > 50 || len(uc.Message) > 1000 {
			http.Error(w, "input too long", http.StatusBadRequest)
			return
		}

		_, err = d.db.Exec("INSERT INTO blog_comments (post_slug, name, message, date) VALUES (?, ?, ?, ?)",
			uc.PostSlug, uc.Name, uc.Message, time.Now())
		if err != nil {
			http.Error(w, "insertion error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
