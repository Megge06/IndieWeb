package main

import (
	"sync"
	"time"

	"golang.org/x/time/rate"
)

const (
	rateLimitEvery = time.Hour
	rateLimitBurst = 1
)

type limiterEntry struct {
	lim  *rate.Limiter
	seen time.Time
}

var (
	limiters = map[string]*limiterEntry{}
	rateMu   sync.Mutex
)

func allowRateLimit(key string) bool {
	return allowCustomRateLimit("default:"+key, rateLimitEvery, rateLimitBurst)
}

// allowCustomRateLimit allows decoupled rate limits per feature
func allowCustomRateLimit(key string, interval time.Duration, burst int) bool {
	rateMu.Lock()
	defer rateMu.Unlock()
	e, ok := limiters[key]
	if !ok {
		e = &limiterEntry{lim: rate.NewLimiter(rate.Every(interval), burst)}
		limiters[key] = e
	}
	e.seen = time.Now()
	return e.lim.Allow()
}

// Deletes idle entries so the map cannot grow without bound.
func rateLimitCleanup(interval time.Duration, maxAge time.Duration) {
	go func() {
		for {
			time.Sleep(interval)
			rateMu.Lock()
			for key, e := range limiters {
				if time.Since(e.seen) > maxAge {
					delete(limiters, key)
				}
			}
			rateMu.Unlock()
		}
	}()
}