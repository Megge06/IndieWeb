package main

import (
	"database/sql"
	"encoding/json"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Struct for Guestbook entries in db
type Entry struct {
	Name    string    `json:"name"`
	Message string    `json:"message"`
	Date    time.Time `json:"date"`
	Avatar  string    `json:"avatar"`
}

// Struct for entries from user
type UserEntry struct {
	Name    string `json:"name"`
	Message string `json:"message"`
	Avatar  string `json:"avatar"`
}

// Handle the DB with a Struct to access it
type Database struct {
	db *sql.DB
}

// White-list map of all avatars
var allowedAvatars = map[string]bool{
	"akechi": true, "alibaba": true, "ann": true, "caroline": true,
	"chihaya": true, "futaba": true, "haru": true, "hifumi": true,
	"justine": true, "kawakami": true, "makoto": true, "mishima": true,
	"munehisa": true, "ohya": true, "phantom": true, "ryuji": true,
	"shinya": true, "sojiro": true, "takemi": true, "yoshida": true,
	"yusuke": true, "yoshizawa": true,
}

func rateLimitKey(r *http.Request) string {
	if ip := strings.TrimSpace(r.Header.Get("X-Real-IP")); ip != "" {
		return normalizeIP(ip)
	}
	host, _, _ := net.SplitHostPort(r.RemoteAddr)
	return normalizeIP(host)
}

func normalizeIP(ip string) string {
	parsed := net.ParseIP(ip)
	if parsed == nil {
		return ip
	}
	if v4 := parsed.To4(); v4 != nil {
		return v4.String()
	}
	return parsed.Mask(net.CIDRMask(64, 128)).String() + "/64"
}

// Handles requests to the guestbook
func (d *Database) guestbookHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case http.MethodGet:
		// Get requested entries from URL
		pageStr := r.URL.Query().Get("page")
		limitStr := r.URL.Query().Get("limit")

		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1
		}
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit < 1 || limit > 200 {
			limit = 50
		}

		offset := (page - 1) * limit

		// Get all entries
		rows, err := d.db.Query("SELECT name, message, date, avatar FROM entries ORDER BY date DESC LIMIT ? OFFSET ?", limit, offset)
		if err != nil {
			http.Error(w, "database error", http.StatusInternalServerError)
			return
		}
		defer func() { _ = rows.Close() }() // close when finished
		entries := []Entry{}
		// Put all entries into an array
		for rows.Next() {
			var e Entry
			err := rows.Scan(&e.Name, &e.Message, &e.Date, &e.Avatar)
			if err != nil {
				http.Error(w, "scan error", http.StatusInternalServerError)
				return
			}
			entries = append(entries, e)
		}
		// Put entries into json
		_ = json.NewEncoder(w).Encode(entries)
	case http.MethodPost:
		// Rate-limit before doing any work
		if !allowRateLimit(rateLimitKey(r)) {
			http.Error(w, "rate limited", http.StatusTooManyRequests)
			return
		}

		// Inserting new Entries
		userEntry := UserEntry{}
		err := json.NewDecoder(r.Body).Decode(&userEntry)
		if err != nil {
			http.Error(w, "decoding error", http.StatusBadRequest)
			return
		}
		//Check Message length
		if userEntry.Name == "" || userEntry.Message == "" {
			http.Error(w, "input error", http.StatusBadRequest)
			return
		}
		if len(userEntry.Name) > 50 || len(userEntry.Message) > 1000 {
			http.Error(w, "input too long", http.StatusBadRequest)
			return
		}

		// Fallback to default avatar
		if userEntry.Avatar == "" {
			userEntry.Avatar = "phantom"
		}

		if !allowedAvatars[userEntry.Avatar] {
			http.Error(w, "invalid avatar selection", http.StatusBadRequest)
			return
		}

		// The actual insertion
		_, err = d.db.Exec("INSERT INTO entries (name, message, date, avatar) VALUES (?, ?, ?, ?)",
			userEntry.Name, userEntry.Message, time.Now(), userEntry.Avatar)

		if err != nil {
			http.Error(w, "insertion error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	default:
		// Error handling
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
