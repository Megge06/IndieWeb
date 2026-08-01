package main

import (
	"encoding/json"
	"math"
	"net/http"
	"time"
)

type PollStats struct {
	Total    int     `json:"total"`
	YesCount int     `json:"yes_count"`
	NoCount  int     `json:"no_count"`
	YesPct   float64 `json:"yes_pct"`
	NoPct    float64 `json:"no_pct"`
}

type UserVote struct {
	Vote string `json:"vote"`
}

func (d *Database) getPollStats() (PollStats, error) {
	rows, err := d.db.Query("SELECT vote, COUNT(*) FROM poll_votes GROUP BY vote")
	if err != nil {
		return PollStats{}, err
	}
	defer func() { _ = rows.Close() }()

	var yesCount, noCount int
	for rows.Next() {
		var vote string
		var count int
		if err := rows.Scan(&vote, &count); err != nil {
			return PollStats{}, err
		}
		switch vote {
		case "yes":
			yesCount = count
		case "no":
			noCount = count
		}
	}

	total := yesCount + noCount
	var yesPct, noPct float64
	if total > 0 {
		yesPct = math.Round((float64(yesCount)/float64(total))*1000) / 10
		noPct = math.Round((float64(noCount)/float64(total))*1000) / 10
	} else {
		yesPct = 50.0
		noPct = 50.0
	}

	return PollStats{
		Total:    total,
		YesCount: yesCount,
		NoCount:  noCount,
		YesPct:   yesPct,
		NoPct:    noPct,
	}, nil
}

func (d *Database) pollHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case http.MethodGet:
		stats, err := d.getPollStats()
		if err != nil {
			http.Error(w, "database error", http.StatusInternalServerError)
			return
		}
		_ = json.NewEncoder(w).Encode(stats)

	case http.MethodPost:
		ip := rateLimitKey(r)

		if !allowCustomRateLimit("poll:"+ip, 15*time.Minute, 1) {
			http.Error(w, "Rate limited: Please wait before voting again.", http.StatusTooManyRequests)
			return
		}

		var uv UserVote
		err := json.NewDecoder(r.Body).Decode(&uv)
		if err != nil || (uv.Vote != "yes" && uv.Vote != "no") {
			http.Error(w, "invalid vote option", http.StatusBadRequest)
			return
		}

		_, err = d.db.Exec("INSERT INTO poll_votes (vote, ip, date) VALUES (?, ?, ?)",
			uv.Vote, ip, time.Now())
		if err != nil {
			http.Error(w, "insertion error", http.StatusInternalServerError)
			return
		}

		stats, err := d.getPollStats()
		if err != nil {
			w.WriteHeader(http.StatusCreated)
			return
		}
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(stats)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}